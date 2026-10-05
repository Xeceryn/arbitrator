import type { WorkerAdapterConfig } from "./reconcile";

export type WorkerAdapter = WorkerAdapterConfig & {
  /** Absolute location of the worker entry module. */
  workerFile: URL;
};

/**
 * Per-exchange worker configuration. Only exchanges listed here can be started;
 * an exchange that exists in lister but has no entry returns "worker not
 * implemented". Everything else is debt.
 */
export const workerAdapters: Record<string, WorkerAdapter> = {
  binance: {
    slug: "binance",
    modulePath: "src/workers/orderbooks/binance.ts",
    workerFile: new URL("../workers/orderbooks/binance.ts", import.meta.url),
    baseCurrency: "usdt",
    maxSubscriptionsPerConnection: 100,
    supportsDynamicSubscribe: true,
  },
  gate: {
    slug: "gate",
    modulePath: "src/workers/orderbooks/gate-io.ts",
    workerFile: new URL("../workers/orderbooks/gate-io.ts", import.meta.url),
    baseCurrency: "usdt",
    maxSubscriptionsPerConnection: 100,
    supportsDynamicSubscribe: true,
  },
  indodax: {
    slug: "indodax",
    modulePath: "src/workers/orderbooks/indodax.ts",
    workerFile: new URL("../workers/orderbooks/indodax.ts", import.meta.url),
    baseCurrency: "idr",
    maxSubscriptionsPerConnection: 50,
    supportsDynamicSubscribe: true,
  },
};

export function getWorkerAdapter(slug: string): WorkerAdapter | undefined {
  return workerAdapters[slug];
}
