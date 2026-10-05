import { afterEach, describe, expect, test } from "bun:test";

import type { SymbolSubscription } from "@arbitrator/contracts";

import { WorkerPool, type WorkerLike } from "./pool";

const BTC: SymbolSubscription = { cmcId: 1, symbol: "BTC" };
const ETH: SymbolSubscription = { cmcId: 2, symbol: "ETH" };

const pools: WorkerPool[] = [];

afterEach(() => {
  for (const pool of pools) pool.terminateAll();
  pools.length = 0;
});

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
    // Keep respawns near-instant so tests don't wait seconds.
    1,
  );
  pools.push(pool);

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
      { id, exchangeSlug: "binance", symbols: [BTC], state: "disconnected" },
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

  test("reflects the state a worker reports", () => {
    const { pool, created } = setup();
    const id = spawnBinance(pool, [BTC]);

    created[0]?.emit("message", {
      type: "state",
      threadId: "binance-orderbook",
      exchange: "binance",
      state: "reconnecting",
    });

    expect(pool.snapshot()).toEqual([
      {
        id,
        exchangeSlug: "binance",
        symbols: [BTC],
        state: "reconnecting",
      },
    ]);
  });

  test("reads the legacy state-change envelope", () => {
    const { pool, created } = setup();
    spawnBinance(pool, [BTC]);

    created[0]?.emit("message", {
      type: "state-change",
      threadId: "binance-orderbook",
      exchange: "binance",
      content: { state: "connected" },
    });

    expect(pool.snapshot()[0]?.state).toBe("connected");
  });

  test("counts unexpected exits as recent failures", () => {
    const { pool, created } = setup();
    spawnBinance(pool, [BTC]);

    created[0]?.emit("exit", 1);

    expect(pool.failureCounts()).toEqual({ binance: 1 });
  });

  test("respawns a worker whose thread exited", async () => {
    const { pool, created } = setup();
    spawnBinance(pool, [BTC]);

    created[0]?.emit("exit", 1);
    await Bun.sleep(20);

    expect(created).toHaveLength(2);
    expect(pool.snapshot()).toHaveLength(1);
    expect(pool.snapshot()[0]?.symbols).toEqual([BTC]);
  });

  test("does not respawn an exchange that is no longer wanted", async () => {
    const created: FakeWorker[] = [];
    let wanted = true;
    const pool = new WorkerPool(
      () => {
        const worker = new FakeWorker();
        created.push(worker);
        return worker;
      },
      { shouldRespawn: () => wanted },
      1,
    );
    pools.push(pool);

    spawnBinance(pool, [BTC]);
    wanted = false;
    created[0]?.emit("exit", 1);
    await Bun.sleep(20);

    expect(created).toHaveLength(1);
    expect(pool.snapshot()).toEqual([]);
  });
});
