import { describe, expect, test } from "bun:test";

import type { SymbolSubscription } from "@arbitrator/contracts";

import { WorkerPool, type WorkerLike } from "./pool";

const BTC: SymbolSubscription = { cmcId: 1, symbol: "BTC" };
const ETH: SymbolSubscription = { cmcId: 2, symbol: "ETH" };

class FakeWorker implements WorkerLike {
  readonly messages: unknown[] = [];
  terminated = false;
  private readonly listeners = new Map<
    string,
    Array<(argument: unknown) => void>
  >();

  postMessage(message: unknown): void {
    this.messages.push(message);
  }

  terminate(): void {
    this.terminated = true;
  }

  on(event: string, listener: (argument: unknown) => void): unknown {
    const bucket = this.listeners.get(event) ?? [];
    bucket.push(listener);
    this.listeners.set(event, bucket);
    return this;
  }

  emit(event: string, argument?: unknown): void {
    for (const listener of this.listeners.get(event) ?? []) {
      listener(argument);
    }
  }
}

function setup() {
  const created: FakeWorker[] = [];
  const failures: Array<{ workerId: string; exchangeSlug: string }> = [];

  const pool = new WorkerPool(
    () => {
      const worker = new FakeWorker();
      created.push(worker);
      return worker;
    },
    {
      onWorkerFailure: (workerId, exchangeSlug) =>
        failures.push({ workerId, exchangeSlug }),
    },
  );

  return { pool, created, failures };
}

function spawnBinance(pool: WorkerPool, symbols: SymbolSubscription[]) {
  const id = pool.nextWorkerId("binance");
  pool.apply([
    { type: "spawn", workerId: id, exchangeSlug: "binance", symbols },
  ]);
  return id;
}

describe("WorkerPool", () => {
  test("spawns a worker and tracks its snapshot", () => {
    const { pool, created } = setup();
    const id = spawnBinance(pool, [BTC]);

    expect(created).toHaveLength(1);
    expect(pool.snapshot()).toEqual([
      { id, exchangeSlug: "binance", symbols: [BTC] },
    ]);
  });

  test("subscribe posts a command and updates the snapshot", () => {
    const { pool, created } = setup();
    const id = spawnBinance(pool, [BTC]);

    pool.apply([
      {
        type: "subscribe",
        workerId: id,
        exchangeSlug: "binance",
        symbols: [ETH],
      },
    ]);

    expect(created[0]?.messages).toEqual([
      { type: "subscribe", symbols: [ETH] },
    ]);
    expect(pool.snapshot()[0]?.symbols).toEqual([BTC, ETH]);
  });

  test("unsubscribe posts a command and updates the snapshot", () => {
    const { pool, created } = setup();
    const id = spawnBinance(pool, [BTC, ETH]);

    pool.apply([
      {
        type: "unsubscribe",
        workerId: id,
        exchangeSlug: "binance",
        symbols: [ETH],
      },
    ]);

    expect(created[0]?.messages).toEqual([
      { type: "unsubscribe", symbols: [ETH] },
    ]);
    expect(pool.snapshot()[0]?.symbols).toEqual([BTC]);
  });

  test("terminate stops the worker and drops it", () => {
    const { pool, created } = setup();
    const id = spawnBinance(pool, [BTC]);

    pool.apply([{ type: "terminate", workerId: id, exchangeSlug: "binance" }]);

    expect(created[0]?.terminated).toBe(true);
    expect(pool.snapshot()).toEqual([]);
  });

  test("unexpected exit surfaces a failure and drops the worker", () => {
    const { pool, created, failures } = setup();
    const id = spawnBinance(pool, [BTC]);

    created[0]?.emit("exit", 1);

    expect(failures).toEqual([{ workerId: id, exchangeSlug: "binance" }]);
    expect(pool.snapshot()).toEqual([]);
  });

  test("intentional terminate does not surface a failure", () => {
    const { pool, created, failures } = setup();
    const id = spawnBinance(pool, [BTC]);

    pool.apply([{ type: "terminate", workerId: id, exchangeSlug: "binance" }]);
    created[0]?.emit("exit", 0);

    expect(failures).toEqual([]);
  });
});
