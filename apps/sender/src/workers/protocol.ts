import { parentPort, workerData } from "node:worker_threads";

import {
  type NormalizedOrderbookEvent,
  RoutingKeys,
  type SymbolSubscription,
  type WorkerCommand,
  type WorkerState,
  workerCommandSchema,
} from "@arbitrator/contracts";
import { ensurePublisher, publishNow } from "@arbitrator/messaging";

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
 * Orderbook data leaves the worker directly over RabbitMQ (never postMessage).
 * The worker normalizes exchange-specific payloads; the exchange is the routing
 * key. One connection per worker keeps the data plane parallel across threads.
 */
export async function createOrderbookPublisher(
  exchange: string,
): Promise<OrderbookPublisher> {
  await ensurePublisher();

  const routingKey = RoutingKeys.orderbookNormalized(exchange);

  return {
    publish(update) {
      const event: NormalizedOrderbookEvent = {
        exchange,
        cmcId: update.cmcId,
        asks: update.asks,
        bids: update.bids,
      };
      // Fire-and-forget: the next snapshot supersedes a dropped one.
      publishNow(routingKey, event);
    },
    async close() {
      // The connection is shared per worker thread; the thread exits on
      // shutdown, which tears the socket down. Nothing to drain here.
    },
  };
}
