import { parentPort, workerData } from "node:worker_threads";

import {
  type NormalizedOrderbookEvent,
  type SymbolSubscription,
  Subjects,
  type WorkerCommand,
  type WorkerState,
  workerCommandSchema,
} from "@arbitrator/contracts";
import { type NatsConnection, connect } from "@nats-io/transport-node";

/** Payload every orderbook worker is spawned with. */
export type WorkerBootstrap = {
  exchange: string;
  threadId: string;
  symbols: SymbolSubscription[];
};

export function bootstrap(): WorkerBootstrap {
  const data = workerData as WorkerBootstrap | undefined;
  if (!data?.exchange) {
    throw new Error(
      "worker must be spawned with workerData { exchange, threadId, symbols }",
    );
  }
  return data;
}

/** Receive validated control commands from the parent (postMessage only). */
export function onCommand(
  handler: (command: WorkerCommand) => void | Promise<void>,
): void {
  if (!parentPort) return;
  parentPort.on("message", (raw: unknown) => {
    const parsed = workerCommandSchema.safeParse(raw);
    if (!parsed.success) return;
    void handler(parsed.data);
  });
}

export function postState(
  threadId: string,
  exchange: string,
  state: WorkerState,
): void {
  parentPort?.postMessage({ type: "state", threadId, exchange, state });
}

export function postSubscribed(cmcIds: number[]): void {
  parentPort?.postMessage({ type: "subscribed", cmcIds });
}

export function postUnsubscribed(cmcIds: number[]): void {
  parentPort?.postMessage({ type: "unsubscribed", cmcIds });
}

export function postError(message: string, cmcIds?: number[]): void {
  parentPort?.postMessage({ type: "error", message, cmcIds });
}

export type OrderbookPublisher = {
  publish(update: {
    cmcId: number;
    asks: Array<[number, number]>;
    bids: Array<[number, number]>;
  }): void;
  close(): Promise<void>;
};

/**
 * Orderbook data leaves the worker directly over NATS (never postMessage). The
 * worker normalizes exchange-specific payloads; the exchange is the subject.
 * One connection per worker keeps the data plane parallel across threads.
 */
export async function createOrderbookPublisher(
  exchange: string,
): Promise<OrderbookPublisher> {
  const nc: NatsConnection = await connect({
    servers: Bun.env.NATS_URL ?? "nats://localhost:4222",
    user: Bun.env.NATS_USER,
    pass: Bun.env.NATS_PASSWORD,
    name: `arbitrator-sender-${exchange}`,
    maxReconnectAttempts: -1,
  });

  const subject = Subjects.orderbookNormalized(exchange);
  const encoder = new TextEncoder();

  return {
    publish(update) {
      const event: NormalizedOrderbookEvent = {
        cmcId: update.cmcId,
        asks: update.asks,
        bids: update.bids,
      };
      nc.publish(subject, encoder.encode(JSON.stringify(event)));
    },
    async close() {
      await nc.drain();
    },
  };
}
