import { Worker } from "node:worker_threads";

import {
    type SymbolSubscription,
    type WorkerState,
    type WorkerStatus,
    workerStateSchema,
} from "@arbitrator/contracts";
import { Value } from "typebox/value";

import type { ReconcileCommand, WorkerSnapshot } from "./reconcile";
import { type WorkerAdapter, workerAdapters } from "./registry";

/** The subset of a Worker the pool uses; faked in tests. */
export type WorkerLike = {
    postMessage(message: unknown): void;
    terminate(): void | Promise<number>;
    on(
        event: "message" | "error" | "exit",
        listener: (argument: unknown) => void,
    ): unknown;
};

export type SpawnWorker = (spec: {
    exchangeSlug: string;
    symbols: SymbolSubscription[];
    adapter: WorkerAdapter;
}) => WorkerLike;

export const spawnThreadWorker: SpawnWorker = ({
    exchangeSlug,
    symbols,
    adapter,
}) =>
    new Worker(adapter.workerFile, {
        workerData: {
            exchange: exchangeSlug,
            threadId: `${exchangeSlug}-orderbook`,
            symbols,
        },
    }) as unknown as WorkerLike;

export type PoolEvents = {
    onWorkerEvent?: (workerId: string, event: unknown) => void;
    /** Called when a worker dies on its own (error/exit), so the service can reconcile. */
    onWorkerFailure?: (
        workerId: string,
        exchangeSlug: string,
        code?: number,
    ) => void;
    /** Whether process-level respawn is still wanted for this exchange. */
    shouldRespawn?: (exchangeSlug: string) => boolean;
    /** Called after any topology or worker-state mutation, to push a status event. */
    onChanged?: () => void;
};

/** Re-exported from contracts so callers keep importing from the pool. */
export type { WorkerStatus };

/**
 * Workers post their connection state either as the current discriminated
 * `state` event or the legacy `state-change` envelope. Read both so the status
 * view covers migrated and un-migrated exchanges alike.
 */
function readWorkerState(message: unknown): WorkerState | undefined {
    if (typeof message !== "object" || message === null) return undefined;
    const record = message as Record<string, unknown>;

    const candidate =
        record.type === "state"
            ? record.state
            : record.type === "state-change" &&
                typeof record.content === "object" &&
                record.content !== null
              ? (record.content as Record<string, unknown>).state
              : undefined;

    return Value.Check(workerStateSchema, candidate) ? candidate : undefined;
}

type Entry = { snapshot: WorkerSnapshot; handle: WorkerLike };

/**
 * Owns the real worker threads. It only translates reconcile commands into
 * thread lifecycle + postMessage, and keeps the projected snapshot in sync.
 */
export class WorkerPool {
    private readonly workers = new Map<string, Entry>();
    private readonly stopping = new Set<string>();
    /** Last connection state reported by each live worker. */
    private readonly states = new Map<string, WorkerState>();
    /** Unexpected worker deaths, surfaced as short-lived "exited" counts. */
    private readonly failures: Array<{ exchangeSlug: string; at: number }> = [];
    /** Consecutive unexpected exits per exchange, drives respawn backoff. */
    private readonly consecutiveFailures = new Map<string, number>();
    /** Pending process-respawn timers, cleared on shutdown. */
    private readonly respawnTimers = new Set<ReturnType<typeof setTimeout>>();
    private sequence = 0;

    constructor(
        private readonly spawn: SpawnWorker = spawnThreadWorker,
        private readonly events: PoolEvents = {},
        private readonly respawnBaseDelayMs = 1000,
    ) {}

    nextWorkerId = (exchangeSlug: string): string => {
        const id = `${exchangeSlug}:${this.sequence}`;
        this.sequence += 1;
        return id;
    };

    snapshot(): WorkerStatus[] {
        return [...this.workers.values()].map((entry) => ({
            id: entry.snapshot.id,
            exchangeSlug: entry.snapshot.exchangeSlug,
            symbols: [...entry.snapshot.symbols],
            state: this.states.get(entry.snapshot.id) ?? "disconnected",
        }));
    }

    /**
     * Unexpected worker deaths per exchange inside the window. Kept separate from
     * live states so a worker that crashed and was respawned still shows up as
     * "errored (retrying)" instead of silently disappearing.
     */
    failureCounts(windowMs = 15_000): Record<string, number> {
        this.pruneFailures(Date.now() - windowMs);

        const counts: Record<string, number> = {};
        for (const failure of this.failures) {
            counts[failure.exchangeSlug] =
                (counts[failure.exchangeSlug] ?? 0) + 1;
        }
        return counts;
    }

    private pruneFailures(cutoff: number): void {
        while (this.failures.length > 0 && this.failures[0]!.at < cutoff) {
            this.failures.shift();
        }
    }

    apply(commands: ReconcileCommand[]): void {
        for (const command of commands) {
            switch (command.type) {
                case "spawn":
                    this.startWorker(
                        command.workerId,
                        command.exchangeSlug,
                        command.symbols,
                    );
                    break;
                case "terminate":
                    this.terminateWorker(command.workerId);
                    break;
                case "subscribe":
                    this.post(command.workerId, {
                        type: "subscribe",
                        symbols: command.symbols,
                    });
                    this.mergeSymbols(command.workerId, command.symbols, "add");
                    break;
                case "unsubscribe":
                    this.post(command.workerId, {
                        type: "unsubscribe",
                        symbols: command.symbols,
                    });
                    this.mergeSymbols(
                        command.workerId,
                        command.symbols,
                        "remove",
                    );
                    break;
            }
        }
    }

    terminateAll(): void {
        for (const timer of this.respawnTimers) clearTimeout(timer);
        this.respawnTimers.clear();
        for (const workerId of this.workers.keys()) {
            this.terminateWorker(workerId);
        }
    }

    private startWorker(
        workerId: string,
        exchangeSlug: string,
        symbols: SymbolSubscription[],
    ): void {
        const adapter = workerAdapters[exchangeSlug];
        if (!adapter) return;

        const handle = this.spawn({ exchangeSlug, symbols, adapter });
        handle.on("message", (message) => {
            const state = readWorkerState(message);
            if (state) {
                const previous = this.states.get(workerId);
                this.states.set(workerId, state);
                if (state === "connected" || state === "reconnected") {
                    this.consecutiveFailures.delete(exchangeSlug);
                }
                if (previous !== state) this.events.onChanged?.();
            }
            this.events.onWorkerEvent?.(workerId, message);
        });
        handle.on("error", (error) => {
            this.events.onWorkerEvent?.(workerId, {
                type: "error",
                message:
                    error instanceof Error
                        ? (error.stack ?? error.message)
                        : String(error),
            });
            this.dropWorker(workerId);
        });
        handle.on("exit", (argument) => {
            if (this.stopping.delete(workerId)) return;
            const code = typeof argument === "number" ? argument : undefined;
            this.dropWorker(workerId, code);
        });

        this.workers.set(workerId, {
            snapshot: { id: workerId, exchangeSlug, symbols: [...symbols] },
            handle,
        });
        this.events.onChanged?.();
    }

    private terminateWorker(workerId: string): void {
        const entry = this.workers.get(workerId);
        if (!entry) return;
        this.workers.delete(workerId);
        this.states.delete(workerId);
        this.stopping.add(workerId);
        void entry.handle.terminate();
        this.events.onChanged?.();
    }

    private dropWorker(workerId: string, code?: number): void {
        const entry = this.workers.get(workerId);
        if (!entry) return;
        this.workers.delete(workerId);
        this.states.delete(workerId);

        const { exchangeSlug, symbols } = entry.snapshot;

        // Retain a short window of deaths so a crash-loop reads as "exited".
        const at = Date.now();
        this.pruneFailures(at - 60_000);
        this.failures.push({ exchangeSlug, at });

        this.events.onWorkerFailure?.(workerId, exchangeSlug, code);

        this.events.onChanged?.();
        this.scheduleRespawn(exchangeSlug, symbols);
    }

    /**
     * Process-level recovery. A worker thread that has exited cannot restart
     * itself, so the pool spawns a replacement — with socket reconnection left to
     * the worker, this only runs after the thread is gone. Retries back off
     * exponentially so a crash-looping worker does not spin, and it skips symbols
     * that a live worker (or a reconcile) already covers.
     */
    private scheduleRespawn(
        exchangeSlug: string,
        symbols: SymbolSubscription[],
    ): void {
        if (symbols.length === 0) return;

        const attempt = (this.consecutiveFailures.get(exchangeSlug) ?? 0) + 1;
        this.consecutiveFailures.set(exchangeSlug, attempt);
        const delay = Math.min(
            this.respawnBaseDelayMs * 2 ** (attempt - 1),
            30_000,
        );

        const timer = setTimeout(() => {
            this.respawnTimers.delete(timer);

            // The exchange may have been stopped while the backoff was pending.
            if (
                this.events.shouldRespawn &&
                !this.events.shouldRespawn(exchangeSlug)
            ) {
                return;
            }

            const covered = new Set(
                this.snapshot()
                    .filter((worker) => worker.exchangeSlug === exchangeSlug)
                    .flatMap((worker) =>
                        worker.symbols.map((symbol) => symbol.cmcId),
                    ),
            );
            const missing = symbols.filter(
                (symbol) => !covered.has(symbol.cmcId),
            );
            if (missing.length === 0) return;

            this.startWorker(
                this.nextWorkerId(exchangeSlug),
                exchangeSlug,
                missing,
            );
        }, delay);

        this.respawnTimers.add(timer);
    }

    private post(workerId: string, message: unknown): void {
        this.workers.get(workerId)?.handle.postMessage(message);
    }

    private mergeSymbols(
        workerId: string,
        symbols: SymbolSubscription[],
        mode: "add" | "remove",
    ): void {
        const entry = this.workers.get(workerId);
        if (!entry) return;

        if (mode === "add") {
            const held = new Set(
                entry.snapshot.symbols.map((symbol) => symbol.cmcId),
            );
            for (const symbol of symbols) {
                if (!held.has(symbol.cmcId))
                    entry.snapshot.symbols.push(symbol);
            }
            this.events.onChanged?.();
            return;
        }

        const removing = new Set(symbols.map((symbol) => symbol.cmcId));
        entry.snapshot.symbols = entry.snapshot.symbols.filter(
            (symbol) => !removing.has(symbol.cmcId),
        );
        this.events.onChanged?.();
    }
}
