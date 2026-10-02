declare let self: Worker;
import { threadId as processId } from "worker_threads";

// NOTE: for debugging purposes when not running as a worker
// const self = {
//   postMessage(...args: any[]) {
//     console.log(args);
//   },
// };
import { DefaultLogger, WebsocketClient } from "gateio-api";

import {
  WorkerMessageType,
  WorkerState,
  type OrderbookWorkerMessage,
} from "../../types";

const SymbolStore = new Map<string, number>();

const exchange = "gate-io";
const threadId = exchange + "-orderbook-" + processId;

const socketClient = new WebsocketClient(
  {},
  {
    ...DefaultLogger,
    info: () => {},
    trace: () => {},
    error: () => {},
  },
);

socketClient.on("open", () => {
  const message: OrderbookWorkerMessage = {
    type: WorkerMessageType.StateChange,
    threadId,
    exchange,
    content: {
      state: WorkerState.Connected,
    },
  };
  self.postMessage(message);
});

socketClient.on("update", (message) => {
  if ("event" in message) {
    const { event, result } = message;
    if (event === "update") {
      const asks = result.asks.map(([price, volume]: [string, string]) => {
        return [Number(price), Number(volume)];
      });
      const bids = result.bids.map(([price, volume]: [string, string]) => {
        return [Number(price), Number(volume)];
      });
      const cmcId = SymbolStore.get(result.s)!;
      const message: OrderbookWorkerMessage = {
        type: WorkerMessageType.Data,
        threadId,
        exchange,
        content: {
          cmcId: cmcId,
          asks,
          bids,
        },
      };
      self.postMessage(message);
      return;
    }
  }

  return;
});

socketClient.on("close", () => {
  const message: OrderbookWorkerMessage = {
    type: WorkerMessageType.StateChange,
    exchange,
    threadId,
    content: {
      state: WorkerState.Closed,
    },
  };
  self.postMessage(message);
});

socketClient.on("exception", (_error) => {
  const message: OrderbookWorkerMessage = {
    type: WorkerMessageType.StateChange,
    exchange,
    threadId,
    content: {
      state: WorkerState.Error,
    },
  };
  self.postMessage(message);
});

socketClient.on("reconnect", () => {
  const message: OrderbookWorkerMessage = {
    type: WorkerMessageType.StateChange,
    threadId,
    exchange,
    content: {
      state: WorkerState.Reconnecting,
    },
  };
  self.postMessage(message);
});

socketClient.on("reconnected", () => {
  const message: OrderbookWorkerMessage = {
    type: WorkerMessageType.StateChange,
    exchange,
    threadId,
    content: {
      state: WorkerState.Connected,
    },
  };
  self.postMessage(message);
});

const arg = Bun.argv
  .at(2)!
  .split(",")
  .map((s) => {
    const [id, symbol] = s.split("-");
    const cmcId = Number(id);
    return [cmcId, symbol.toUpperCase() + "_USDT"] as [number, string];
  });
try {
  for (const [cmcId, symbol] of arg) {
    SymbolStore.set(symbol, cmcId);
    socketClient.subscribe(
      [{ topic: "spot.order_book", payload: [symbol, "50", "1000ms"] }],
      "spotV4",
    );
  }
} catch (error) {
  console.error("error", error);
}
