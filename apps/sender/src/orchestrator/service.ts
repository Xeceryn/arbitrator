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
  exchanges: Array<{ id: number; slug: string; baseCurrency: "usdt" | "idr" }>;
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
};

export type OrchestratorStatus = {
  started: string[];
  workers: ReturnType<WorkerPool["snapshot"]>;
  unplaced: DesiredSubscription[];
};

/**
 * Owns the started-exchange set and drives reconciliation. Triggers are
 * coalesced and level-triggered: every run recomputes full desired state and
 * the pool applies only the delta.
 */
export class Orchestrator {
  private readonly started = new Set<string>();
  private unplaced: DesiredSubscription[] = [];
  private debounce: ReturnType<typeof setTimeout> | undefined;
  private running = false;
  private pending = false;

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
    return { ok: true };
  }

  stop(slug: string): { ok: true } {
    this.started.delete(slug);
    this.schedule();
    return { ok: true };
  }

  status(): OrchestratorStatus {
    return {
      started: [...this.started],
      workers: this.pool.snapshot(),
      unplaced: this.unplaced,
    };
  }

  /** Called when lister emits `metadata.changed`. No-op with nothing running. */
  notifyMetadataChanged(): void {
    if (this.started.size === 0) return;
    this.schedule();
  }

  private schedule(): void {
    if (this.debounce) clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this.debounce = undefined;
      void this.runReconcile();
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
      this.apply(
        reconcile({
          startedExchanges: [],
          desired: [],
          currentWorkers: this.pool.snapshot(),
          configs: workerAdapters,
        }),
      );
      return;
    }

    const idBySlug = await this.lister.resolveExchangeIds(started);
    const exchangeIds = started
      .map((slug) => idBySlug.get(slug))
      .filter((id): id is number => id !== undefined);

    const desired: DesiredSubscription[] = [];
    if (exchangeIds.length >= 2) {
      const data = await this.lister.listTransferableCoins({ exchangeIds });
      const slugById = new Map(data.exchanges.map((row) => [row.id, row.slug]));
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

    this.apply(
      reconcile({
        startedExchanges: started,
        desired,
        currentWorkers: this.pool.snapshot(),
        configs: workerAdapters,
        workerIdFactory: (slug) => this.pool.nextWorkerId(slug),
      }),
    );
  }

  private apply(result: ReconcileResult): void {
    this.unplaced = result.unplaced;
    this.pool.apply(result.commands);

    if (result.unplaced.length > 0) {
      const summary = result.unplaced
        .map((item) => `${item.exchangeSlug}:${item.cmcId}`)
        .join(", ");
      logger.warn(
        `${result.unplaced.length} subscription(s) unplaced (capacity): ${summary}`,
      );
    }
  }
}
