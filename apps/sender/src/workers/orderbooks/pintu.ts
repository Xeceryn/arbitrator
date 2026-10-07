declare let self: Worker;
// NOTE: for debugging purposes when not running as a worker
// const self = {
//   postMessage(...args: any[]) {
//     console.log(args);
//   },
// };

import { randomUUID } from "node:crypto";
import { threadId as processId } from "node:worker_threads";

import WebSocket from "ws";

import {
    WorkerMessageType,
    WorkerState,
    type OrderbookWorkerMessage,
} from "../../types";

const WS_URL = "wss://stream.pintu.pro/";
const SymbolStore = new Map();
const exchange = "pintu";
const threadId = exchange + "-orderbook-" + processId;

function stream(coins: string[]) {
    const socket = new WebSocket(WS_URL);
    socket.on("open", () => {
        const request_id = randomUUID();
        const subscribe = {
            method: "subscribe",
            params: {
                channels: coins,
            },
            request_id,
            timestamp: Date.now(),
        };

        socket.send(JSON.stringify(subscribe));

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

    socket.on("message", async (message) => {
        const messageParsed = JSON.parse(message.toString());
        const { method, data, request_id } = messageParsed;

        if (method == "subscription") {
            const cmcId = SymbolStore.get(messageParsed.channel);
            // const { asks, bids } = data;
            const asks = data.asks.map(
                ([raw_price, raw_volume]: [string, string]) => {
                    const price = Number(raw_price);
                    const volume = Number(raw_volume) * price;

                    return [price, volume];
                },
            );
            const bids = data.bids.map(
                ([raw_price, raw_volume]: [string, string]) => {
                    const price = Number(raw_price);
                    const volume = Number(raw_volume) * price;

                    return [price, volume];
                },
            );

            const message: OrderbookWorkerMessage = {
                type: WorkerMessageType.Data,
                threadId,
                exchange,
                content: { cmcId, asks, bids },
            };
            self.postMessage(message);
            return;
        }
        return;
    });

    const pingInterval = setInterval(() => {
        socket.send(
            JSON.stringify({
                method: "heartbeat-response",
                request_id: randomUUID(),
                timestamp: Date.now(),
            }),
        );
    }, 1000 * 5);

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
                exchange,
                threadId,
                content: {
                    state: WorkerState.Reconnecting,
                },
            };
            self.postMessage(message);
            stream(coins);
        }, 1000 * 2);
    });

    socket.on("error", () => {
        clearInterval(pingInterval);
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
const arg = Bun.argv
    .at(2)!
    .split(",")
    .map((s) => {
        const [id, symbol] = s.split("-");
        const cmcId = Number(id);
        // spot_depth_btcusdt_
        return { cmcId, symbol };
    });

const subscriptions = arg.map(({ symbol, cmcId }) => {
    const subs = `aggrbook.snapshot.50.${symbol.toUpperCase()}-IDR`;
    SymbolStore.set(subs, cmcId);
    return subs;
});

stream(subscriptions);
