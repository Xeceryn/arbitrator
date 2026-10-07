export const MEXC_ORDERBOOK_WORKER_PATH = __filename;

declare let self: Worker;
// NOTE: for debugging purposes when not running as a worker
// const self = {
//   postMessage(...args: any[]) {
//     console.log(args);
//   },
// };

import { threadId as processId } from "node:worker_threads";

import amqplib from "amqplib";

import { PushDataV3ApiWrapper } from "../../vendor/mexc-websocket-proto/gen/PushDataV3ApiWrapper";

// import dns from "node:dns/promises";
// dns.setServers(["1.1.1.1", "1.0.0.1"]);

const exchange = "mexc";
const threadId = exchange + "-orderbook-" + processId;
const logger = createLogger(threadId);

import { createLogger } from "@arbitrator/logger";

// import WebSocket from "ws";
import {
    WorkerMessageType,
    WorkerState,
    type OrderbookWorkerMessage,
} from "../../types";

const SymbolStore = new Map<string, number>();

function stream(coins: { symbol: string; cmcId: number }[]) {
    const socket = new WebSocket("wss://wbs-api.mexc.com/ws", {
        // tls: {
        //   rejectUnauthorized: false,
        // },
    });
    // const coins = [{ symbol: "adsf", cmcId: 123 }];

    socket.onopen = () => {
        logger.info("socket open");
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

    socket.onmessage = (event: Bun.MessageEvent<Buffer>) => {
        // NOTE: their message is a little bit wierd, they have 2 types of messages
        // is a json encoded ping / pong and some event of subscription
        // the other one is their message from protobuf encoded buffer
        try {
            const data = JSON.parse(event.data.toString()) as {
                id: number;
                code: number;
                msg: string;
            };
            if (data.msg === "PONG") {
                return;
            }
            return;
        } catch (error) {}

        const data = PushDataV3ApiWrapper.decode(event.data);
        console.log(JSON.stringify(data.publicLimitDepths));
    };

    const pingInterval = setInterval(() => {
        socket.send(
            JSON.stringify({
                method: "PING",
            }),
        );
    }, 5000);

    socket.onclose = async (event) => {
        logger.info("socket closed, code: " + event.code);
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
            logger.info("socket reconnecting");
            stream(coins);
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

    socket.onerror = (_) => {
        logger.error("socket error");
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

    stream(arg);
}
