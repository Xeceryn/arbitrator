// NOTE: for debugging purposes when not running as a worker
// const self = {
//   postMessage(...args: any[]) {
//     console.log(args);
//   },
// };
declare let self: Worker;

import { threadId as processId } from "node:worker_threads";

import { DefaultLogger, WebsocketClientV2 } from "bitget-api";

import {
    WorkerMessageType,
    WorkerState,
    type OrderbookWorkerMessage,
} from "../../types";

const SymbolStore = new Map<string, number>();
const exchange = "bitget";

const threadId = exchange + "-orderbook-" + processId;

const socketClient = new WebsocketClientV2(
    {},
    {
        // ...DefaultLogger,
        silly: () => {},
        debug: () => {},
        notice: () => {},
        info: () => {},
        warning: () => {},
        error: () => {},
    },
);

function stream(metadata: [string, number][]) {
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
        if ("data" in message) {
            // const [{ asks, bids }] = message.data;
            const cmcId = SymbolStore.get(message.arg.instId)!;
            const asks = message.data
                .at(0)
                .asks.map(([price, volume]: [string, string]) => {
                    return [Number(price), Number(volume)];
                });
            const bids = message.data
                .at(0)
                .bids.map(([price, volume]: [string, string]) => {
                    return [Number(price), Number(volume)];
                });

            const m: OrderbookWorkerMessage = {
                type: WorkerMessageType.Data,
                threadId,
                exchange,
                content: {
                    cmcId,
                    asks,
                    bids,
                },
            };
            self.postMessage(m);
            return;
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

    // socketClient.on("exception", () => {
    //   const message: OrderbookWorkerMessage = {
    //     type: WorkerMessageType.StateChange,
    //     threadId,
    //     exchange,
    //     content: {
    //       state: WorkerState.Error,
    //     },
    //   };
    //   self.postMessage(message);
    // });

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

    try {
        for (const [symbol, cmcId] of metadata) {
            SymbolStore.set(symbol, cmcId);
            socketClient.subscribeTopic("SPOT", "books", symbol);
        }
    } catch (error) {
        console.error("error", error);
    }
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
        return [symbol.toUpperCase() + "USDT", Number(cmcId)];
    });
}

// const args = [{ symbol: "", cmcId: 1 }].map(
//   (coin) => coin.symbol + ":" + coin.cmcId,
// );
const symbols = parseArgs(Bun.argv.at(2)!);

stream(symbols);
