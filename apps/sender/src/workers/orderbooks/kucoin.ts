// NOTE: for debugging purposes when not running as a worker
// change the self to log instead of sending message to the parent

// const self = {
//   postMessage(...args: any[]) {
//     console.log(args);
//   },
// };
declare let self: Worker;

import { threadId as processId } from "worker_threads";

import { WebsocketClient } from "kucoin-api";

import {
    WorkerMessageType,
    WorkerState,
    type OrderbookWorkerMessage,
} from "../../types";
import type { SymbolInfo } from "../../types/metadata";
import { split_symbols } from "../../utils";

const exchange = "kucoin";
const threadId = exchange + "-orderbook-" + processId;

const SymbolStore = new Map<string, number>();
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

    socketClient.on("update", (event) => {
        if (event.type === "message") {
            const cmcId = SymbolStore.get(event.topic)!;

            // const { asks, bids } = event.data;
            const asks = event.data.asks.map(([price, volume]: any) => {
                return [Number(price), Number(volume)];
            });
            const bids = event.data.bids.map(([price, volume]: any) => {
                return [Number(price), Number(volume)];
            });
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

    // TODO: add error detail logging if the state change is error
    socketClient.on("exception", (error) => {
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
        // for (const [_index, meta] of split_symbols(metadata, 100).entries()) {
        const subscriptions = metadata.map(({ symbol, cmcId }) => {
            const subscription =
                "/spotMarket/level2Depth50:" + symbol.toUpperCase() + "-USDT";
            SymbolStore.set(subscription, cmcId);
            return subscription;
        });

        socketClient.subscribe(subscriptions, "spotPublicV1");
        // }
    } catch (error) {
        const message: OrderbookWorkerMessage = {
            type: WorkerMessageType.StateChange,
            threadId,
            exchange,
            content: {
                state: WorkerState.Error,
            },
        };
        self.postMessage(message);
    }
}

const args = Bun.argv
    .at(2)!
    .split(",")
    .map((s) => {
        const [id, symbol] = s.split("-");
        const cmcId = Number(id);
        return { cmcId, symbol };
    });

stream(args);
