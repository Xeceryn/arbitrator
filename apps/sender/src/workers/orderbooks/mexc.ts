export const MEXC_ORDERBOOK_WORKER = __filename;

// declare var self: Worker;
// NOTE: for debugging purposes when not running as a worker
const self = {
  postMessage(...args: any[]) {
    console.log(args);
  },
};

import { threadId as processId } from "node:worker_threads";

// import dns from "node:dns/promises";
// dns.setServers(["1.1.1.1", "1.0.0.1"]);

const exchange = "mexc";
const threadId = exchange + "-orderbook-" + processId;

// import WebSocket from "ws";
import {
  WorkerMessageType,
  WorkerState,
  type OrderbookWorkerMessage,
} from "../../types";

const SymbolStore = new Map<string, number>();

async function main(coins: { symbol: string; cmcId: number }[]) {
  const socket = new WebSocket("wss://wbs.mexc.fm/ws", {
    // tls: {
    //   rejectUnauthorized: false,
    // },
  });
  // const coins = [{ symbol: "adsf", cmcId: 123 }];

  socket.onopen = () => {
    const message: OrderbookWorkerMessage = {
      type: WorkerMessageType.StateChange,
      threadId,
      exchange,
      content: {
        state: WorkerState.Connected,
      },
    };
    self.postMessage(message);

    let id = 0;
    for (const coin of coins) {
      const param =
        "spot@public.limit.depth.v3.api.pb@" +
        coin.symbol.toUpperCase() +
        "USDT@20";
      SymbolStore.set(coin.symbol.toUpperCase() + "USDT", coin.cmcId);
      socket.send(
        JSON.stringify({
          id: ++id,
          method: "SUBSCRIPTION",
          params: [param],
        }),
      );
    }
  };

  socket.onmessage = (event) => {
    console.log(event.data);
    // const data = JSON.parse(event.toString());
    // if ("s" in data) {
    //   const cmcId = SymbolStore.get(data.s);
    //   const bids = data.d.bids.map(({ p, v }: { p: string; v: string }) => [
    //     Number(p),
    //     Number(v),
    //   ]);
    //   const asks = data.d.asks.map(({ p, v }: { p: string; v: string }) => [
    //     Number(p),
    //     Number(v),
    //   ]);
    //   const message: OrderbookWorkerMessage = {
    //     type: WorkerMessageType.Data,
    //     threadId,
    //     exchange,
    //     content: {
    //       cmcId: cmcId,
    //       asks,
    //       bids,
    //     },
    //   };
    //   self.postMessage(message);
    //
    //   return;
    // }
  };

  const pingInterval = setInterval(() => {
    socket.send(
      JSON.stringify({
        method: "PING",
      }),
    );
    // TODO: add last ping property to the parent worker state store
    // loggingChannel.sendToQueue(
    //   "crawler-logs",
    //   Buffer.from(JSON.stringify({ market: "mexc-1", status: "ping" })),
    // );
  }, 5000);

  socket.onclose = async (ev) => {
    console.log("WORKER_SIDE", ev.code, ev.reason);
    clearInterval(pingInterval);
    const message: OrderbookWorkerMessage = {
      type: WorkerMessageType.StateChange,
      exchange,
      threadId,
      content: {
        state: WorkerState.Closed,
      },
    };
    self.postMessage(message);

    setTimeout(async () => {
      await main(coins);
      const reconnecting_message: OrderbookWorkerMessage = {
        type: WorkerMessageType.StateChange,
        threadId,
        exchange,
        content: {
          state: WorkerState.Reconnecting,
        },
      };
      self.postMessage(reconnecting_message);
    }, 2000);
  };

  socket.onerror = (ev) => {
    const message: OrderbookWorkerMessage = {
      type: WorkerMessageType.StateChange,
      threadId,
      exchange,
      content: {
        state: WorkerState.Error,
      },
    };
    self.postMessage(message);
    socket.close();
  };
}

if (Bun.main === __filename) {
  const arg = Bun.argv
    .at(2)!
    .split(",")
    .map((s) => {
      const [id, symbol] = s.split("-") as [string, string];
      const cmcId = Number(id);
      return { symbol, cmcId };
    });
  main(arg);
}
