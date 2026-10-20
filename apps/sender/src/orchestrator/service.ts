import type { OrchestratorStatus } from "@arbitrator/contracts";
import { createLogger } from "@arbitrator/logger";

import type { WorkerPool } from "./pool";
import {
    type DesiredSubscription,
    type ReconcileResult,
    reconcile,
} from "./reconcile";
import { workerAdapters } from "./registry";

const logger = createLogger("arbitrator/sender/orchestrator");

/** Shape returned by `market.listTransferableCoins`. */
export type TransferableCoinsResult = {
    exchanges: Array<{
        id: number;
        slug: string;
        baseCurrency: "usdt" | "idr";
    }>;
    subscriptions: Array<{ exchangeId: number; cmcId: number; symbol: string }>;
    routes: Array<{
        aExchangeId: number;
        bExchangeId: number;
        cmcId: number;
        chainId: number;
    }>;
};

export type ListerGateway = {
    resolveExchangeIds(slugs: string[]): Promise<Map<string, number>>;
    listTransferableCoins(input: {
        exchangeIds: number[];
    }): Promise<TransferableCoinsResult>;
    /**
     * Reconcile persisted opportunities against the started exchanges. Seeds
     * missing directed legs and removes legs that are no longer transferable.
     */
    syncOpportunities(exchangeIds: number[]): Promise<void>;
};

export type { OrchestratorStatus };

/**
 * Owns the started-exchange set and drives reconciliation. Triggers are
 * coalesced and level-triggered: every run recomputes full desired state and
 * the pool applies only the delta.
 *
 * Status pushes are event-driven, not polled: every mutation (start/stop,
 * reconcile topology change, worker state report, death, respawn) notifies the
 * subscribers once, coalesced through a microtask so one reconcile emits one
 * push. The sender WS fans those pushes out; the UI never refetches.
 */
export class Orchestrator {
    private readonly started = new Set<string>();
    private readonly listeners = new Set<
        (status: OrchestratorStatus) => void
    >();
    private notifyQueued = false;
    private expiryTimer: ReturnType<typeof setTimeout> | undefined;
    private debounce: ReturnType<typeof setTimeout> | undefined;
    private running = false;
    private pending = false;
    /** Snapshot of the desired subscriptions used by the last reconcile. */
    private readonly desiredByExchange = new Map<string, number>();

    constructor(
        private readonly pool: WorkerPool,
        private readonly lister: ListerGateway,
        private readonly debounceMs = 300,
    ) {}

    start(slug: string): { ok: true } | { ok: false; reason: string } {
        if (!workerAdapters[slug]) {
            return { ok: false, reason: "exchange worker not implemented" };
        }
        if (this.started.has(slug)) return { ok: true };

        this.started.add(slug);
        this.schedule();
        this.notify();
        return { ok: true };
    }

    stop(slug: string): { ok: true } {
        const had = this.started.delete(slug);
        this.schedule();
        if (had) this.notify();
        return { ok: true };
    }

    status(): OrchestratorStatus {
        return {
            started: [...this.started],
            workers: this.pool.snapshot(),
            failures: this.pool.failureCounts(),
            desired: Object.fromEntries(this.desiredByExchange),
            capacity: Object.fromEntries(
                Object.entries(workerAdapters).map(([slug, adapter]) => [
                    slug,
                    adapter.maxSubscriptionsPerConnection,
                ]),
            ),
            supported: Object.keys(workerAdapters),
        };
    }

    /** Called when lister emits `metadata.changed`. No-op with nothing running. */
    notifyMetadataChanged(): void {
        if (this.started.size === 0) return;
        this.schedule();
    }

    /** Whether an exchange is still started, so the pool only respawns live work. */
    isStarted(slug: string): boolean {
        return this.started.has(slug);
    }

    /**
     * Subscribe to event-driven status pushes. The listener fires once per
     * mutation batch (never polled). Returns an unsubscribe function.
     */
    subscribe(listener: (status: OrchestratorStatus) => void): () => void {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }

    /** Called by the pool after any topology or worker-state mutation. */
    handlePoolChanged(): void {
        this.notify();
    }

    /**
     * Coalesced fan-out: synchronous mutation bursts (one reconcile applying
     * several commands) emit a single push. Also schedules a delayed push while
     * failure counts are non-empty, so the short-lived "exited" badges clear
     * without polling once the 15s window expires.
     */
    private notify(): void {
        if (this.notifyQueued) return;
        this.notifyQueued = true;
        queueMicrotask(() => {
            this.notifyQueued = false;
            if (this.listeners.size === 0) return;
            const status = this.status();
            for (const listener of this.listeners) listener(status);
            this.scheduleExpiryPush(status);
        });
    }

    private scheduleExpiryPush(status: OrchestratorStatus): void {
        if (this.expiryTimer) clearTimeout(this.expiryTimer);
        this.expiryTimer = undefined;
        if (Object.keys(status.failures).length === 0) return;
        this.expiryTimer = setTimeout(() => {
            this.expiryTimer = undefined;
            if (this.listeners.size === 0) return;
            const next = this.status();
            for (const listener of this.listeners) listener(next);
            this.scheduleExpiryPush(next);
        }, 16_000);
    }

    private schedule(): void {
        if (this.debounce) clearTimeout(this.debounce);
        this.debounce = setTimeout(() => {
            this.debounce = undefined;
            // Eden rejects on transport/HTTP errors (the old safe client returned
            // an error tuple), so a lister outage must not become an unhandled
            // rejection that takes the sender down.
            void this.runReconcile().catch((error: unknown) => {
                logger.error(
                    `reconcile failed: ${
                        error instanceof Error ? error.message : String(error)
                    }`,
                );
            });
        }, this.debounceMs);
    }

    /** Single-flight: a trigger arriving mid-run re-runs once afterwards. */
    async runReconcile(): Promise<void> {
        if (this.running) {
            this.pending = true;
            return;
        }

        this.running = true;
        try {
            do {
                this.pending = false;
                await this.reconcileOnce();
            } while (this.pending);
        } finally {
            this.running = false;
        }
    }

    private async reconcileOnce(): Promise<void> {
        const started = [...this.started];

        if (started.length < 2) {
            this.desiredByExchange.clear();
            this.apply(
                reconcile({
                    startedExchanges: [],
                    desired: [],
                    currentWorkers: this.pool.snapshot(),
                    configs: workerAdapters,
                }),
            );
            // Nothing is arbitrageable: drop every persisted leg.
            await this.lister.syncOpportunities([]);
            this.notify();
            return;
        }

        const idBySlug = await this.lister.resolveExchangeIds(started);
        const exchangeIds = started
            .map((slug) => idBySlug.get(slug))
            .filter((id): id is number => id !== undefined);

        const desired: DesiredSubscription[] = [];
        if (exchangeIds.length >= 2) {
            const data = await this.lister.listTransferableCoins({
                exchangeIds,
            });
            const slugById = new Map(
                data.exchanges.map((row) => [row.id, row.slug]),
            );
            for (const subscription of data.subscriptions) {
                const slug = slugById.get(subscription.exchangeId);
                if (slug) {
                    desired.push({
                        exchangeSlug: slug,
                        cmcId: subscription.cmcId,
                        symbol: subscription.symbol,
                    });
                }
            }
        }

        this.desiredByExchange.clear();
        for (const item of desired) {
            this.desiredByExchange.set(
                item.exchangeSlug,
                (this.desiredByExchange.get(item.exchangeSlug) ?? 0) + 1,
            );
        }

        this.apply(
            reconcile({
                startedExchanges: started,
                desired,
                currentWorkers: this.pool.snapshot(),
                configs: workerAdapters,
                workerIdFactory: (slug) => this.pool.nextWorkerId(slug),
            }),
        );

        // Keep persisted legs in lockstep with the started set + current metadata.
        await this.lister.syncOpportunities(exchangeIds);
        this.notify();
    }

    private apply(result: ReconcileResult): void {
        if (result.commands.length > 0) {
            const counts = new Map<string, number>();
            for (const command of result.commands) {
                const key = `${command.type} ${command.exchangeSlug}`;
                counts.set(key, (counts.get(key) ?? 0) + 1);
            }
            logger.info(
                `reconcile: ${[...counts].map(([key, n]) => `${key} x${n}`).join(", ")}`,
            );
        }
        this.pool.apply(result.commands);
    }
}
