// NOTE: for debugging purposes when not running as a worker
// change the self to log instead of sending message to the parent

// const self = {
//   postMessage(...args: any[]) {
//     console.log(args);
//   },
// };

declare let self: Worker;

import { threadId as processId } from "worker_threads";

import pako from "pako";
import WebSocket from "ws";

import {
    WorkerMessageType,
    WorkerState,
    type OrderbookWorkerMessage,
} from "../../types";

const WS_URL = "wss://api.huobi.pro/ws";
const SymbolStore = new Map();

const exchange = "huobi";
const threadId = exchange + "-orderbook-" + processId;

async function stream(coins: Array<{ symbol: string; cmcId: number }>) {
    const socket = new WebSocket(WS_URL);
    socket.on("open", () => {
        const message: OrderbookWorkerMessage = {
            type: WorkerMessageType.StateChange,
            threadId,
            exchange,
            content: {
                state: WorkerState.Connected,
            },
        };
        self.postMessage(message);

        coins.forEach((coin, index) => {
            const subscribe = {
                sub: `market.${coin.symbol}usdt.depth.step1`,
                id: `id${index}`,
            };
            SymbolStore.set(subscribe.sub, coin.cmcId);

            socket.send(JSON.stringify(subscribe));
        });
    });

    socket.on("message", async (message: pako.Data) => {
        const text = pako.inflate(message, { to: "string" });
        const msg = JSON.parse(text);

        if ("tick" in msg) {
            const cmcId = SymbolStore.get(msg.ch);
            const { asks, bids } = msg.tick;
            const message: OrderbookWorkerMessage = {
                type: WorkerMessageType.Data,
                threadId,
                exchange,
                content: {
                    cmcId,
                    asks,
                    bids,
                },
            };
            self.postMessage(message);
            return;
        }

        if ("ping" in msg) {
            // TODO: send last ping pong time to parent processes
            socket.send(JSON.stringify({ pong: msg.ping }));
            return;
        }
        return;
    });

    socket.on("close", async () => {
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
            stream(coins);
        }, 2000);
    });

    socket.on("error", (_error) => {
        const message: OrderbookWorkerMessage = {
            type: WorkerMessageType.StateChange,
            threadId,
            exchange,
            content: {
                state: WorkerState.Error,
            },
        };
        // TODO: create error logging capture workers
        // to know what kind of error we got
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

const symbols = arg.map((coin) => ({
    symbol: coin.symbol.toLowerCase(),
    cmcId: coin.cmcId,
}));

stream(symbols);
