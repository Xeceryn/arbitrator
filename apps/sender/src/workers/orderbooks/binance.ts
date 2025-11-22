// NOTE: for debugging purposes when not running as a worker
// change the self to log instead of sending message to the parent

// const self = {
//   postMessage(...args: any[]) {
//     console.log(args);
//   },
// };
declare let self: Worker;

import { threadId as processId } from "worker_threads";

import { connect } from "@nats-io/transport-node";
import {
  WebsocketClient,
  type WsMessagePartialBookDepthEventRaw,
} from "binance";

import { WorkerState, type WorkerMessage } from "../../types";
import type { OrderbookMessageContent } from "../../types/orderbook";

const exchange = "binance";
const threadId = exchange + "-orderbook-" + processId;

const ChannelStore = new Map<string, number>();

const nc = await connect();

// const arg = Bun.argv
//   .at(2)!
//   .split(",")
//   .map((s) => {
//     const [id, symbol] = s.split("-");
//     const cmcId = Number(id);
//     // spot_depth_btcusdt_
//     ChannelStore.set(`spot_depth_${symbol!.toLowerCase()}usdt_`, cmcId);
//     return { cmcId, symbol };
//   });
const arg = "1-btc,2-eth,3-xrp,4-sol".split(",").map((s) => {
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
  const message: WorkerMessage = {
    threadId,
    exchange,
    state: WorkerState.Connected,
  };
  self.postMessage(message);
});

socketClient.on("message", (event) => {
  const data = event as WsMessagePartialBookDepthEventRaw;
  const cmcId = ChannelStore.get(data.wsKey)!;
  const asks = data.asks.map(([price, volume]) => {
    return [Number(price), Number(volume)];
  });
  const bids = data.bids.map(([price, volume]) => {
    return [Number(price), Number(volume)];
  });

  const message: OrderbookMessageContent = {
    exchange,
    cmcId,
    asks,
    bids,
  };

  nc.publish("orderbook.binance.update", JSON.stringify(message));
});

socketClient.on("reconnecting", () => {
  const message: WorkerMessage = {
    threadId,
    exchange,
    state: WorkerState.Reconnecting,
  };
  self.postMessage(message);
});

socketClient.on("reconnected", () => {
  const message: WorkerMessage = {
    threadId,
    exchange,
    state: WorkerState.Connected,
  };
  self.postMessage(message);
});

socketClient.on("close", () => {
  const message: WorkerMessage = {
    exchange,
    threadId,
    state: WorkerState.Closed,
  };
  self.postMessage(message);
});

for (const s of arg) {
  socketClient.subscribePartialBookDepths(
    s.symbol!.toUpperCase() + "USDT",
    // s.symbol! + "usdt",
    20,
    1000,
    "spot",
  );
}
