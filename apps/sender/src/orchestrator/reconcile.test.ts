import { describe, expect, test } from "bun:test";

import {
  type DesiredSubscription,
  type WorkerAdapterConfig,
  type WorkerSnapshot,
  reconcile,
} from "./reconcile";

const binance: WorkerAdapterConfig = {
  slug: "binance",
  modulePath: "src/workers/orderbooks/binance.ts",
  baseCurrency: "usdt",
  maxSubscriptionsPerConnection: 2,
  maxConnectionsPerExchange: 1,
  supportsDynamicSubscribe: true,
};

const gate: WorkerAdapterConfig = { ...binance, slug: "gate" };

const configs = { binance, gate };

function coins(exchangeSlug: string, cmcIds: number[]): DesiredSubscription[] {
  return cmcIds.map((cmcId) => ({
    exchangeSlug,
    cmcId,
    symbol: `COIN${cmcId}`,
  }));
}

describe("reconcile", () => {
  test("fewer than two started exchanges tears everything down", () => {
    const currentWorkers: WorkerSnapshot[] = [
      {
        id: "binance:0",
        exchangeSlug: "binance",
        symbols: [{ cmcId: 1, symbol: "COIN1" }],
      },
    ];

    const result = reconcile({
      startedExchanges: ["binance"],
      desired: coins("binance", [1, 2]),
      currentWorkers,
      configs,
    });

    expect(result.commands).toEqual([
      { type: "terminate", workerId: "binance:0", exchangeSlug: "binance" },
    ]);
    expect(result.nextWorkers).toEqual([]);
    expect(result.unplaced).toEqual([]);
  });

  test("spawns one worker per exchange for two started exchanges", () => {
    const desired = [...coins("binance", [1, 2]), ...coins("gate", [1, 2])];

    const result = reconcile({
      startedExchanges: ["binance", "gate"],
      desired,
      currentWorkers: [],
      configs,
    });

    const spawns = result.commands.filter((c) => c.type === "spawn");
    expect(spawns).toHaveLength(2);
    expect(result.unplaced).toEqual([]);
    expect(result.nextWorkers).toHaveLength(2);
  });

  test("is idempotent: re-running against projected state emits nothing", () => {
    const desired = [...coins("binance", [1, 2]), ...coins("gate", [1, 2])];

    const first = reconcile({
      startedExchanges: ["binance", "gate"],
      desired,
      currentWorkers: [],
      configs,
    });
    const second = reconcile({
      startedExchanges: ["binance", "gate"],
      desired,
      currentWorkers: first.nextWorkers,
      configs,
    });

    expect(second.commands).toEqual([]);
    expect(second.unplaced).toEqual([]);
    expect(second.nextWorkers).toEqual(first.nextWorkers);
  });

  test("surfaces coins beyond the connection cap as unplaced", () => {
    const result = reconcile({
      startedExchanges: ["binance", "gate"],
      desired: [...coins("binance", [1, 2, 3]), ...coins("gate", [1])],
      currentWorkers: [],
      configs,
    });

    expect(result.commands.filter((c) => c.type === "spawn")).toHaveLength(2);
    expect(result.unplaced).toEqual([
      { exchangeSlug: "binance", cmcId: 3, symbol: "COIN3" },
    ]);
  });

  test("unsubscribes a coin when metadata drops it", () => {
    const currentWorkers: WorkerSnapshot[] = [
      {
        id: "binance:0",
        exchangeSlug: "binance",
        symbols: [
          { cmcId: 1, symbol: "COIN1" },
          { cmcId: 2, symbol: "COIN2" },
        ],
      },
    ];

    const result = reconcile({
      startedExchanges: ["binance", "gate"],
      desired: [...coins("binance", [1]), ...coins("gate", [1, 2])],
      currentWorkers,
      configs,
    });

    const unsubscribe = result.commands.find((c) => c.type === "unsubscribe");
    expect(unsubscribe).toEqual({
      type: "unsubscribe",
      workerId: "binance:0",
      exchangeSlug: "binance",
      symbols: [{ cmcId: 2, symbol: "COIN2" }],
    });
  });

  test("stops an exchange by terminating its workers only", () => {
    const currentWorkers: WorkerSnapshot[] = [
      {
        id: "binance:0",
        exchangeSlug: "binance",
        symbols: [{ cmcId: 1, symbol: "COIN1" }],
      },
      {
        id: "gate:1",
        exchangeSlug: "gate",
        symbols: [{ cmcId: 1, symbol: "COIN1" }],
      },
    ];

    const result = reconcile({
      startedExchanges: ["binance"],
      desired: [...coins("binance", [1]), ...coins("gate", [1])],
      currentWorkers,
      configs,
    });

    expect(result.commands).toEqual([
      { type: "terminate", workerId: "binance:0", exchangeSlug: "binance" },
      { type: "terminate", workerId: "gate:1", exchangeSlug: "gate" },
    ]);
  });
});
