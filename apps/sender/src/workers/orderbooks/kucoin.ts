import { type SymbolSubscription, WorkerState } from "@arbitrator/contracts";
import { createLogger } from "@arbitrator/logger";
import { WebsocketClient } from "kucoin-api";

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
        error() {},
        info() {},
        trace() {},
    },
);

/** The spot public connection every topic is routed to. */
const WS_KEY = "spotPublicV1";
/** Level-50 orderbook topic prefix. */
const TOPIC_PREFIX = "/spotMarket/level2Depth50:";
/**
 * KuCoin limits client -> server messages to 100 per 10 seconds *per
 * connection*, and `kucoin-api` emits one message per topic. Send one
 * subscribe/unsubscribe at a time and sleep a second between them so a worker
 * holding a full symbol set never trips the limit. The first `subscribe()` call
 * is also what makes the SDK open the socket.
 */
const SUBSCRIBE_INTERVAL_MS = 1000;
/** At most one snapshot per coin is forwarded to RabbitMQ per interval. */
const SEND_INTERVAL_MS = 1000;

/** topic (e.g. `/spotMarket/level2Depth50:BTC-USDT`) -> cmcId. */
const TopicStore = new Map<string, number>();
/** topic -> last time a snapshot was published, for per-coin throttling. */
const LastSentAt = new Map<string, number>();

type DepthLevelRaw = [string | number, string | number];
type DepthMessageRaw = {
    type: string;
    topic: string;
    data: { asks: DepthLevelRaw[]; bids: DepthLevelRaw[] };
};

const toLevel = (row: DepthLevelRaw): [number, number] => [
    Number(row[0]),
    Number(row[1]),
];

const topicForSymbol = (symbol: string): string =>
    `${TOPIC_PREFIX}${symbol.toUpperCase()}-USDT`;

const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

/** Serializes outbound (un)subscribes so only one leaves per interval. */
let outbound: Promise<void> = Promise.resolve();

function sendSequentially(
    action: "subscribe" | "unsubscribe",
    topic: string,
): void {
    outbound = outbound
        .then(async () => {
            if (action === "subscribe") {
                socketClient.subscribe([topic], WS_KEY);
            } else {
                socketClient.unsubscribe([topic], WS_KEY);
            }
            await sleep(SUBSCRIBE_INTERVAL_MS);
        })
        .catch((error: unknown) => {
            logger.error(`failed to ${action} ${topic}: ${String(error)}`);
        });
}

function subscribe(symbols: SymbolSubscription[]): void {
    for (const item of symbols) {
        const topic = topicForSymbol(item.symbol);
        TopicStore.set(topic, item.cmcId);
        LastSentAt.set(topic, Date.now());
        sendSequentially("subscribe", topic);
    }
    if (symbols.length > 0) postSubscribed(symbols.map((item) => item.cmcId));
}

function unsubscribe(symbols: SymbolSubscription[]): void {
    for (const item of symbols) {
        const topic = topicForSymbol(item.symbol);
        if (!TopicStore.delete(topic)) continue;
        LastSentAt.delete(topic);
        sendSequentially("unsubscribe", topic);
    }
    postUnsubscribed(symbols.map((item) => item.cmcId));
}

socketClient.on("open", () => {
    postState(threadId, exchange, WorkerState.Connected);
    logger.info("socket open");
});

socketClient.on("update", (event) => {
    const message = event as DepthMessageRaw;
    if (message.type !== "message") return;

    const cmcId = TopicStore.get(message.topic);
    if (cmcId === undefined) return;
    if (
        !Array.isArray(message.data?.asks) ||
        !Array.isArray(message.data?.bids)
    ) {
        return;
    }

    // Throttle the broker per coin; the receiver only needs the latest
    // snapshot each second regardless of how fast KuCoin pushes.
    const now = Date.now();
    const lastSentAt = LastSentAt.get(message.topic);
    if (lastSentAt !== undefined && now - lastSentAt < SEND_INTERVAL_MS) {
        return;
    }
    LastSentAt.set(message.topic, now);

    publisher.publish({
        cmcId,
        asks: message.data.asks.map(toLevel),
        bids: message.data.bids.map(toLevel),
    });
});

socketClient.on("reconnect", () => {
    postState(threadId, exchange, WorkerState.Reconnecting);
    logger.info("socket closed, reconnecting");
});

socketClient.on("reconnected", () => {
    postState(threadId, exchange, WorkerState.Connected);
    logger.info("socket reconnected");
});

socketClient.on("close", () => {
    postState(threadId, exchange, WorkerState.Closed);
    logger.info("socket closed");
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
