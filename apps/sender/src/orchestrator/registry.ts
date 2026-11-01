import { existsSync } from "node:fs";

import type { WorkerAdapterConfig } from "./reconcile";

/**
 * Resolve a worker entry in both layouts:
 *
 * - dev: `import.meta.url` is `src/orchestrator/registry.ts`, so the worker is
 *   next door at `src/workers/orderbooks/<name>.ts`;
 * - bundled: `import.meta.url` is `dist/index.js`, and `build.ts` emits the
 *   workers at `dist/workers/orderbooks/<name>.js`.
 */
function resolveWorkerFile(name: string): URL {
    const source = new URL(`../workers/orderbooks/${name}.ts`, import.meta.url);
    if (existsSync(source)) return source;
    return new URL(`./workers/orderbooks/${name}.js`, import.meta.url);
}

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
        workerFile: resolveWorkerFile("binance"),
        baseCurrency: "usdt",
        maxSubscriptionsPerConnection: 100,
        supportsDynamicSubscribe: true,
    },
    gate: {
        slug: "gate",
        modulePath: "src/workers/orderbooks/gate-io.ts",
        workerFile: resolveWorkerFile("gate-io"),
        baseCurrency: "usdt",
        maxSubscriptionsPerConnection: 100,
        supportsDynamicSubscribe: true,
    },
    indodax: {
        slug: "indodax",
        modulePath: "src/workers/orderbooks/indodax.ts",
        workerFile: resolveWorkerFile("indodax"),
        baseCurrency: "idr",
        maxSubscriptionsPerConnection: 50,
        supportsDynamicSubscribe: true,
    },
    kucoin: {
        slug: "kucoin",
        modulePath: "src/workers/orderbooks/kucoin.ts",
        workerFile: resolveWorkerFile("kucoin"),
        baseCurrency: "usdt",
        // KuCoin caps both topics per request and, comfortably above that, the
        // spot topic count per connection (400). One worker per 100 symbols
        // keeps each connection's paced subscribe backlog small.
        maxSubscriptionsPerConnection: 100,
        supportsDynamicSubscribe: true,
    },
    mexc: {
        slug: "mexc",
        modulePath: "src/workers/orderbooks/mexc.ts",
        workerFile: resolveWorkerFile("mexc"),
        baseCurrency: "usdt",
        maxSubscriptionsPerConnection: 20,
        supportsDynamicSubscribe: true,
    },
};

export function getWorkerAdapter(slug: string): WorkerAdapter | undefined {
    return workerAdapters[slug];
}
