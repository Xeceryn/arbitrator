import { type SymbolSubscription, WorkerState } from "@arbitrator/contracts";
import { DefaultLogger, WebsocketClient } from "gateio-api";

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
const socketClient = new WebsocketClient(
    {},
    {
        ...DefaultLogger,
        info: () => {},
        trace: () => {},
        error: () => {},
    },
);

/** gate pair (e.g. `BTC_USDT`) -> cmcId. */
const PairStore = new Map<string, number>();
/** pair -> last time a snapshot was published, for per-coin throttling. */
const LastSentAt = new Map<string, number>();
/** At most one snapshot per coin is forwarded to RabbitMQ per interval. */
const SEND_INTERVAL_MS = 1000;

const toLevel = (row: [string, string]): [number, number] => [
    Number(row[0]),
    Number(row[1]),
];

const pairForSymbol = (symbol: string) => `${symbol.toUpperCase()}_USDT`;

const requestForPair = (pair: string) => ({
    topic: "spot.order_book",
    payload: [pair, "50", "1000ms"],
});

function subscribe(symbols: SymbolSubscription[]): void {
    const requests = symbols.map((item) => {
        const pair = pairForSymbol(item.symbol);
        PairStore.set(pair, item.cmcId);
        LastSentAt.set(pair, Date.now());
        return requestForPair(pair);
    });

    if (requests.length > 0) {
        socketClient.subscribe(requests, "spotV4");
    }
    if (symbols.length > 0) {
        postSubscribed(symbols.map((item) => item.cmcId));
    }
}

function unsubscribe(symbols: SymbolSubscription[]): void {
    const requests = symbols.map((item) => {
        const pair = pairForSymbol(item.symbol);
        PairStore.delete(pair);
        LastSentAt.delete(pair);
        return requestForPair(pair);
    });

    if (requests.length > 0) {
        socketClient.unsubscribe(requests, "spotV4");
    }
    postUnsubscribed(symbols.map((item) => item.cmcId));
}

socketClient.on("open", () => {
    postState(threadId, exchange, WorkerState.Connected);
});

socketClient.on("update", (message) => {
    if (!("event" in message) || message.event !== "update") return;
    const { result } = message;
    if (!result.s) return;

    const cmcId = PairStore.get(result.s);
    if (cmcId === undefined) return;

    // Throttle the broker per coin; the receiver only needs the latest
    // snapshot each second regardless of how fast gate pushes.
    const now = Date.now();
    const lastSentAt = LastSentAt.get(result.s);
    if (lastSentAt !== undefined && now - lastSentAt < SEND_INTERVAL_MS) {
        return;
    }
    LastSentAt.set(result.s, now);

    publisher.publish({
        cmcId,
        asks: result.asks.map(toLevel),
        bids: result.bids.map(toLevel),
    });
});

socketClient.on("reconnect", () => {
    postState(threadId, exchange, WorkerState.Reconnecting);
});

socketClient.on("reconnected", () => {
    postState(threadId, exchange, WorkerState.Connected);
});

socketClient.on("close", () => {
    postState(threadId, exchange, WorkerState.Closed);
});

socketClient.on("exception", (error) => {
    postError(error instanceof Error ? error.message : String(error));
});

onCommand((command) => {
    if (command.type === "subscribe") subscribe(command.symbols);
    if (command.type === "unsubscribe") unsubscribe(command.symbols);
    if (command.type === "shutdown") {
        void publisher.close().finally(() => process.exit(0));
    }
});

subscribe(initialSymbols);
