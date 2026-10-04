import { Worker } from "node:worker_threads";

import type { SymbolSubscription } from "@arbitrator/contracts";

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
  onWorkerFailure?: (workerId: string, exchangeSlug: string) => void;
};

type Entry = { snapshot: WorkerSnapshot; handle: WorkerLike };

/**
 * Owns the real worker threads. It only translates reconcile commands into
 * thread lifecycle + postMessage, and keeps the projected snapshot in sync.
 */
export class WorkerPool {
  private readonly workers = new Map<string, Entry>();
  private readonly stopping = new Set<string>();
  private sequence = 0;

  constructor(
    private readonly spawn: SpawnWorker = spawnThreadWorker,
    private readonly events: PoolEvents = {},
  ) {}

  nextWorkerId = (exchangeSlug: string): string => {
    const id = `${exchangeSlug}:${this.sequence}`;
    this.sequence += 1;
    return id;
  };

  snapshot(): WorkerSnapshot[] {
    return [...this.workers.values()].map((entry) => ({
      id: entry.snapshot.id,
      exchangeSlug: entry.snapshot.exchangeSlug,
      symbols: [...entry.snapshot.symbols],
    }));
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
          this.mergeSymbols(command.workerId, command.symbols, "remove");
          break;
      }
    }
  }

  terminateAll(): void {
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
      this.events.onWorkerEvent?.(workerId, message);
    });
    handle.on("error", (error) => {
      this.events.onWorkerEvent?.(workerId, {
        type: "error",
        message: String(error),
      });
      this.dropWorker(workerId);
    });
    handle.on("exit", () => {
      if (this.stopping.delete(workerId)) return;
      this.dropWorker(workerId);
    });

    this.workers.set(workerId, {
      snapshot: { id: workerId, exchangeSlug, symbols: [...symbols] },
      handle,
    });
  }

  private terminateWorker(workerId: string): void {
    const entry = this.workers.get(workerId);
    if (!entry) return;
    this.workers.delete(workerId);
    this.stopping.add(workerId);
    void entry.handle.terminate();
  }

  private dropWorker(workerId: string): void {
    const entry = this.workers.get(workerId);
    if (!entry) return;
    this.workers.delete(workerId);
    this.events.onWorkerFailure?.(workerId, entry.snapshot.exchangeSlug);
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
        if (!held.has(symbol.cmcId)) entry.snapshot.symbols.push(symbol);
      }
      return;
    }

    const removing = new Set(symbols.map((symbol) => symbol.cmcId));
    entry.snapshot.symbols = entry.snapshot.symbols.filter(
      (symbol) => !removing.has(symbol.cmcId),
    );
  }
}
