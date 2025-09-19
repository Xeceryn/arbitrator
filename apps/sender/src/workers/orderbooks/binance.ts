// NOTE: for debugging purposes when not running as a worker
// change the self to log instead of sending message to the parent

// const self = {
//   postMessage(...args: any[]) {
//     console.log(args);
//   },
// };
declare let self: Worker;

import { threadId as processId } from "worker_threads";

import {
  WebsocketClient,
  type WsMessagePartialBookDepthEventRaw,
} from "binance";

import {
  type OrderbookWorkerMessage,
  WorkerMessageType,
  WorkerState,
} from "../../types";

const exchange = "binance";
const threadId = exchange + "-orderbook-" + processId;

const ChannelStore = new Map<string, number>();

const arg = Bun.argv
  .at(2)!
  .split(",")
  .map((s) => {
    const [id, symbol] = s.split("-");
    const cmcId = Number(id);
    // spot_depth_btcusdt_
    ChannelStore.set(`spot_depth_${symbol!.toLowerCase()}usdt_`, cmcId);
    return { cmcId, symbol };
  });

const socketClient = new WebsocketClient(
  {},
  // {
  //   // ...DefaultLogger,
  //   // info: () => {},
  //   // error: () => {},
  // },
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

socketClient.on("message", (event) => {
  const data = event as WsMessagePartialBookDepthEventRaw;
  const cmc_id = ChannelStore.get(data.wsKey)!;
  const asks = data.asks.map(([price, volume]) => {
    return [Number(price), Number(volume)];
  });
  const bids = data.bids.map(([price, volume]) => {
    return [Number(price), Number(volume)];
  });

  const message: OrderbookWorkerMessage = {
    type: WorkerMessageType.Data,
    threadId,
    exchange,
    content: {
      cmcId: cmc_id,
      asks,
      bids,
    },
  };
  self.postMessage(message);
});

socketClient.on("reconnecting", () => {
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

socketClient.on("error", (_err) => {
  const message: OrderbookWorkerMessage = {
    type: WorkerMessageType.StateChange,
    threadId,
    exchange,
    content: {
      state: WorkerState.Error,
    },
  };
  self.postMessage(message);
});

for (const s of arg) {
  socketClient.subscribePartialBookDepths(
    s.symbol!.toUpperCase() + "USDT",
    20,
    1000,
    "spot",
  );
}
