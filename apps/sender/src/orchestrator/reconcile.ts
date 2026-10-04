import type { SymbolSubscription } from "@arbitrator/contracts";

/** Per-exchange worker configuration. One exchange may need several workers. */
export type WorkerAdapterConfig = {
  slug: string;
  modulePath: string;
  baseCurrency: "usdt" | "idr";
  maxSubscriptionsPerConnection: number;
  maxConnectionsPerExchange: number;
  supportsDynamicSubscribe: boolean;
};

/** A coin that should be streamed for one exchange. */
export type DesiredSubscription = SymbolSubscription & { exchangeSlug: string };

/** The projected state of one worker. */
export type WorkerSnapshot = {
  id: string;
  exchangeSlug: string;
  symbols: SymbolSubscription[];
};

export type ReconcileCommand =
  | {
      type: "subscribe";
      workerId: string;
      exchangeSlug: string;
      symbols: SymbolSubscription[];
    }
  | {
      type: "unsubscribe";
      workerId: string;
      exchangeSlug: string;
      symbols: SymbolSubscription[];
    }
  | {
      type: "spawn";
      workerId: string;
      exchangeSlug: string;
      symbols: SymbolSubscription[];
    }
  | { type: "terminate"; workerId: string; exchangeSlug: string };

export type ReconcileInput = {
  /** Canonical exchange slugs the user has started. */
  startedExchanges: string[];
  /** Full desired subscription set from lister (union, deduped). */
  desired: DesiredSubscription[];
  /** Current worker topology owned by the pool. */
  currentWorkers: WorkerSnapshot[];
  configs: Record<string, WorkerAdapterConfig | undefined>;
  /** Override worker id generation (defaults to `<slug>:<n>`). */
  workerIdFactory?: (exchangeSlug: string, sequence: number) => string;
};

export type ReconcileResult = {
  commands: ReconcileCommand[];
  /** Coins that could not be placed within the connection cap. */
  unplaced: DesiredSubscription[];
  /** Projected worker topology after the commands are applied. */
  nextWorkers: WorkerSnapshot[];
};

/**
 * Level-triggered, delta-only reconciliation. Given the desired subscription
 * set and the current worker topology, return the minimum commands to converge.
 * Pure: no I/O, no time, no randomness.
 */
export function reconcile(input: ReconcileInput): ReconcileResult {
  const { startedExchanges, desired, currentWorkers, configs } = input;
  const commands: ReconcileCommand[] = [];
  const unplaced: DesiredSubscription[] = [];
  const nextWorkers: WorkerSnapshot[] = [];

  // Fewer than two started exchanges means nothing is arbitrageable.
  const active =
    startedExchanges.length >= 2
      ? new Set(startedExchanges)
      : new Set<string>();

  const wantedByExchange = new Map<string, Map<number, string>>();
  for (const item of desired) {
    if (!active.has(item.exchangeSlug)) continue;
    let bucket = wantedByExchange.get(item.exchangeSlug);
    if (!bucket) {
      bucket = new Map<number, string>();
      wantedByExchange.set(item.exchangeSlug, bucket);
    }
    bucket.set(item.cmcId, item.symbol);
  }

  const workersByExchange = new Map<string, WorkerSnapshot[]>();
  for (const worker of currentWorkers) {
    const bucket = workersByExchange.get(worker.exchangeSlug) ?? [];
    bucket.push({ ...worker, symbols: [...worker.symbols] });
    workersByExchange.set(worker.exchangeSlug, bucket);
  }

  const exchanges = new Set<string>([
    ...workersByExchange.keys(),
    ...wantedByExchange.keys(),
  ]);

  let sequence = 0;
  const nextId =
    input.workerIdFactory ??
    ((exchangeSlug: string, seq: number) => `${exchangeSlug}:${seq}`);

  for (const exchangeSlug of [...exchanges].sort()) {
    const config = configs[exchangeSlug];
    const workers = (workersByExchange.get(exchangeSlug) ?? []).sort((a, b) =>
      a.id.localeCompare(b.id),
    );
    const wanted =
      active.has(exchangeSlug) && config
        ? (wantedByExchange.get(exchangeSlug) ?? new Map<number, string>())
        : new Map<number, string>();

    // Exchange stopped, or no adapter: tear its workers down.
    if (!active.has(exchangeSlug) || !config) {
      for (const worker of workers) {
        commands.push({ type: "terminate", workerId: worker.id, exchangeSlug });
      }
      // Unconfigured but started: report the coins it cannot serve.
      if (active.has(exchangeSlug) && !config) {
        for (const [cmcId, symbol] of wantedByExchange.get(exchangeSlug) ??
          []) {
          unplaced.push({ exchangeSlug, cmcId, symbol });
        }
      }
      continue;
    }

    // 1. Unsubscribe coins no longer wanted.
    for (const worker of workers) {
      const remove = worker.symbols.filter(
        (symbol) => !wanted.has(symbol.cmcId),
      );
      if (remove.length === 0) continue;
      commands.push({
        type: "unsubscribe",
        workerId: worker.id,
        exchangeSlug,
        symbols: remove,
      });
      worker.symbols = worker.symbols.filter((symbol) =>
        wanted.has(symbol.cmcId),
      );
    }

    // 2. Subscribe missing coins into workers that have room.
    const held = new Set(
      workers.flatMap((worker) => worker.symbols.map((symbol) => symbol.cmcId)),
    );
    const pending: SymbolSubscription[] = [];
    for (const [cmcId, symbol] of wanted) {
      if (held.has(cmcId)) continue;
      const target = workers.find(
        (worker) =>
          worker.symbols.length < config.maxSubscriptionsPerConnection,
      );
      if (target) {
        commands.push({
          type: "subscribe",
          workerId: target.id,
          exchangeSlug,
          symbols: [{ cmcId, symbol }],
        });
        target.symbols.push({ cmcId, symbol });
      } else {
        pending.push({ cmcId, symbol });
      }
    }

    // 3. Spawn additional workers for the remainder, up to the connection cap.
    let connections = workers.length;
    let index = 0;
    while (
      index < pending.length &&
      connections < config.maxConnectionsPerExchange
    ) {
      const chunk = pending.slice(
        index,
        index + config.maxSubscriptionsPerConnection,
      );
      const id = nextId(exchangeSlug, sequence);
      sequence += 1;
      commands.push({
        type: "spawn",
        workerId: id,
        exchangeSlug,
        symbols: chunk,
      });
      workers.push({ id, exchangeSlug, symbols: [...chunk] });
      connections += 1;
      index += chunk.length;
    }
    for (; index < pending.length; index += 1) {
      const symbol = pending[index]!;
      unplaced.push({ exchangeSlug, ...symbol });
    }

    // 4. Terminate workers left with nothing to stream.
    for (const worker of workers) {
      if (worker.symbols.length === 0) {
        commands.push({ type: "terminate", workerId: worker.id, exchangeSlug });
      } else {
        nextWorkers.push(worker);
      }
    }
  }

  return { commands, unplaced, nextWorkers };
}
