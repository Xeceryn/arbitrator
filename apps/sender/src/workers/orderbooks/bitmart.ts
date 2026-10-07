// NOTE: for debugging purposes when not running as a worker
// change the self to log instead of sending message to the parent

// const self = {
//   postMessage(...args: any[]) {
//     console.log(args);
//   },
// };
declare let self: Worker;

import { WebsocketClient } from "bitmart-api";
const SymbolStore = new Map<string, number>();
import { threadId as processId } from "worker_threads";

import {
    WorkerMessageType,
    WorkerState,
    type OrderbookWorkerMessage,
} from "../../types";
import type { SymbolInfo } from "../../types/metadata";

const exchange = "bitmart";
const threadId = exchange + "-orderbook-" + processId;
const socketClient = new WebsocketClient(
    {},
    {
        error() {},
        info() {},
        trace() {},
    },
);

function stream(metadata: SymbolInfo[]) {
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
            // const [{ symbol, asks, bids }] = message.data;
            const symbol = message.data.at(0);
            const asks = message.data.at(0).asks.map(([price, volume]: any) => {
                return [Number(price), Number(volume)];
            });
            const bids = message.data.at(0).bids.map(([price, volume]: any) => {
                return [Number(price), Number(volume)];
            });

            const cmcId = SymbolStore.get(symbol)!;
            const m: OrderbookWorkerMessage = {
                type: WorkerMessageType.Data,
                threadId,
                exchange,
                content: {
                    cmcId: cmcId,
                    asks,
                    bids,
                },
            };
            self.postMessage(m);
            return;
        }
        return;
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

    // TODO: add error type state change to logging worker
    socketClient.on("exception", async () => {
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

    try {
        for (const { symbol, cmcId } of metadata) {
            SymbolStore.set(symbol, cmcId);
            socketClient.subscribe(
                ["spot/depth50:" + symbol.toUpperCase() + "_USDT"],
                "spot",
            );
        }
    } catch (error) {
        console.error("error", error);
    }
}

const args = Bun.argv
    .at(2)!
    .split(",")
    .map((s) => {
        const [id, symbol] = s.split("-");
        const cmcId = Number(id);
        // spot_depth_btcusdt_
        return { cmcId, symbol };
    });
stream(args);
