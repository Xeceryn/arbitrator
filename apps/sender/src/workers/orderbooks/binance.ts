import { type SymbolSubscription, WorkerState } from "@arbitrator/contracts";
import { createLogger } from "@arbitrator/logger";
import {
    type WsMessagePartialBookDepthEventRaw,
    WebsocketClient,
} from "binance";

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

const logger = createLogger(`arbitrator/sender/worker/${exchange}-${threadId}`);
const publisher = await createOrderbookPublisher(exchange);
const socketClient = new WebsocketClient(
    {},
    {
        info: () => {},
        trace: () => {},
        error: () => {},
    },
);

/** binance stream topic (also `data.streamName`) -> cmcId. */
const ChannelStore = new Map<string, number>();

const toLevel = (row: [string | number, string | number]): [number, number] => [
    Number(row[0]),
    Number(row[1]),
];

const pairForSymbol = (symbol: string) => `${symbol.toUpperCase()}USDT`;
const topicForPair = (pair: string) => `${pair.toLowerCase()}@depth20@1000ms`;

function subscribe(symbols: SymbolSubscription[]): void {
    for (const item of symbols) {
        const pair = pairForSymbol(item.symbol);
        ChannelStore.set(topicForPair(pair), item.cmcId);
        void socketClient.subscribePartialBookDepths(pair, 20, 1000, "spot");
    }
    if (symbols.length > 0) {
        postSubscribed(symbols.map((item) => item.cmcId));
    }
}

function unsubscribe(symbols: SymbolSubscription[]): void {
    const topics: string[] = [];
    for (const item of symbols) {
        const topic = topicForPair(pairForSymbol(item.symbol));
        if (ChannelStore.delete(topic)) topics.push(topic);
    }
    if (topics.length > 0) {
        void socketClient.unsubscribe(topics, "main");
    }
    postUnsubscribed(symbols.map((item) => item.cmcId));
}

socketClient.on("open", () => {
    postState(threadId, exchange, WorkerState.Connected);
    logger.info("socket open, subscribing");
});

socketClient.on("message", (event) => {
    const data = event as WsMessagePartialBookDepthEventRaw;
    const cmcId = ChannelStore.get(data.streamName);
    if (cmcId === undefined) return;

    publisher.publish({
        cmcId,
        asks: data.asks.map(toLevel),
        bids: data.bids.map(toLevel),
    });
});

socketClient.on("reconnecting", () => {
    postState(threadId, exchange, WorkerState.Reconnecting);
    logger.info(`socket closed, reconnecting`);
});

socketClient.on("reconnected", () => {
    postState(threadId, exchange, WorkerState.Connected);
    logger.info("socket reconnected, resubscribing");
});

socketClient.on("close", () => {
    postState(threadId, exchange, WorkerState.Closed);
    logger.info(`socket closed`);
});

socketClient.on("exception", (error) => {
    postError(error instanceof Error ? error.message : String(error));
    logger.error(
        `socket exception: ${error instanceof Error ? error.message : String(error)}`,
    );
});

onCommand((command) => {
    if (command.type === "subscribe") subscribe(command.symbols);
    if (command.type === "unsubscribe") unsubscribe(command.symbols);
    if (command.type === "shutdown") {
        void publisher.close().finally(() => process.exit(0));
    }
});

subscribe(initialSymbols);
