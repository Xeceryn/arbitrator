import { type SymbolSubscription, WorkerState } from "@arbitrator/contracts";
import WebSocket, { type RawData } from "ws";

import {
  bootstrap,
  createOrderbookPublisher,
  onCommand,
  postError,
  postState,
  postSubscribed,
  postUnsubscribed,
} from "../protocol";

const { exchange, threadId, symbols: initialSymbols } = bootstrap();

const publisher = await createOrderbookPublisher(exchange);
const ChannelStore = new Map<string, number>();

const toLevel = (row: [string | number, string | number]): [number, number] => [
  Number(row[0]),
  Number(row[1]),
];

const pairForSymbol = (symbol: string) => `${symbol.toUpperCase()}USDT`;
const topicForPair = (pair: string) => `${pair.toLowerCase()}@depth20@1000ms`;

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5NDY2MTg0MTV9.UR1lBM6Eqh0yWz-PVirw1uPCxe60FdchR8eNVdsskeo";

const SymbolStore = new Map();
// const { IndodaxSubscribeMap } = require("../../utils/IndodaxSubscribeMap");
const IndodaxSubscribeMap = new Map([
  [8104, "oneinch"],
  [7278, "lend"],
  [17795, "asix"],
  [1831, "bchabc"],
  [3602, "bchsv"],
  [131, "drk"],
  [20314, "lunav2"],
  [873, "nem"],
  [512, "str"],
  [23635, "bnxnew"],
  [7080, "galagames"],
  [21846, "spaceid"],
  [5786, "lyfel"],
  [32521, "neirocto"],
  [32809, "orderly"],
  [1104, "rep"],
  [8290, "superverse"],
  [17751, "threshold"],
]);

function stream(metadata: [string, number][]) {
  const socket = new WebSocket("wss://ws3.indodax.com/ws/");

  socket.on("open", () => {
    const event_change_message: OrderbookWorkerMessage = {
      type: WorkerMessageType.StateChange,
      threadId,
      exchange,
      content: {
        state: WorkerState.Connected,
      },
    };
    self.postMessage(event_change_message);
    socket.send(
      JSON.stringify({
        params: {
          token: token,
        },
        id: 1,
      }),
    );

    let subscribeId = 1;
    for (let [channel, cmcId] of metadata) {
      if (IndodaxSubscribeMap.has(cmcId)) {
        channel = "market:order-book-" + IndodaxSubscribeMap.get(cmcId) + "idr";
      }
      SymbolStore.set(channel, cmcId);
      socket.send(
        JSON.stringify({
          method: 1,
          params: {
            channel,
          },
          id: subscribeId,
        }),
      );
      subscribeId++;
    }
  });

  socket.on("message", (message) => {
    const parsed = stupidParser(message);
    if (!parsed) return;
    if (!("result" in parsed)) return;
    if ("data" in parsed.result) {
      const { data, channel } = parsed.result;
      const { ask, bid } = data.data;
      const cmcId = SymbolStore.get(channel);
      const asks = ask.map(({ idr_volume, price }) => [
        Number(price),
        Number(idr_volume),
      ]);
      const bids = bid.map(({ idr_volume, price }) => [
        Number(price),
        Number(idr_volume),
      ]);

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
    } else {
      return;
    }

    return;
  });

  const pingInterval = setInterval(() => {
    socket.send(
      JSON.stringify({
        method: 7,
        id: 3,
      }),
    );
  }, 1000 * 60);

  socket.on("close", () => {
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

    setTimeout(() => {
      const message: OrderbookWorkerMessage = {
        type: WorkerMessageType.StateChange,
        threadId,
        exchange,
        content: {
          state: WorkerState.Reconnecting,
        },
      };
      self.postMessage(message);
      stream(metadata);
    }, 2000);
  });

  socket.on("error", (_) => {
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
  });
}

function parseArgs(args: string): [string, number][] {
  if (!args) {
    console.error("No symbols provided");
    process.exit(1);
  }

  return args.split(",").map((meta) => {
    const [cmcId, symbol] = meta.split("-");
    if (isNaN(Number(cmcId)) || !symbol) {
      console.error("Invalid symbol format");
      process.exit(1);
    }
    return ["market:order-book-" + symbol + "idr", Number(cmcId)];
  });
}

async function main() {
  const args = Bun.argv.at(2)!;
  const symbols = parseArgs(args);

  stream(symbols);
}

function stupidParser(str: RawData) {
  try {
    const data = str
      .toString()
      .split("\n")
      .filter((r) => r !== "")
      .map((r) => JSON.parse(r));
    return data[0];
  } catch (error) {
    return false;
  }

  // try {
  //   const data = JSON.parse(str);
  //   return data;
  // } catch (e) {
  //   return false;
  // }
}

main();
