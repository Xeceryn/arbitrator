import { randomUUID } from "node:crypto";

import { type SymbolSubscription, WorkerState } from "@arbitrator/contracts";
import { createLogger } from "@arbitrator/logger";
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

const logger = createLogger(`arbitrator/sender/worker/${exchange}-${threadId}`);
const publisher = await createOrderbookPublisher(exchange);

const WS_URL = "wss://stream.pintu.pro/";
const RECONNECT_DELAY_MS = 2000;
/**
 * At most one snapshot per coin is forwarded to RabbitMQ per interval. Pintu
 * pushes an aggregated 50-level snapshot once a second per channel, but the
 * receiver only needs the latest one.
 */
const SEND_INTERVAL_MS = 1000;
/** Pintu publishes top-50 aggregated books under this channel prefix. */
const CHANNEL_PREFIX = "aggrbook.snapshot.50.";
const QUOTE = "IDR";

type PintuLevelRaw = [price: string, volume: string, orders?: string];

type PintuMessageRaw = {
    request_id?: string;
    method?: string;
    code?: number;
    message?: string;
    channel?: string;
    data?: {
        channel?: string;
        symbol?: string;
        asks?: PintuLevelRaw[];
        bids?: PintuLevelRaw[];
    };
};

type PendingRequest = {
    method: "subscribe" | "unsubscribe";
    /** channel -> cmcId, so an ack still knows the coin after the store changes. */
    channels: Map<string, number>;
};

/** channel (e.g. `aggrbook.snapshot.50.BTC-IDR`) -> cmcId. */
const ChannelStore = new Map<string, number>();
/** channel -> last time a snapshot was published, for per-coin throttling. */
const LastSentAt = new Map<string, number>();
/** Channels subscribed on the current connection; reset on every (re)connect. */
const SentChannels = new Set<string>();
/** Channels with a subscribe/unsubscribe request in flight. */
const PendingChannels = new Set<string>();
/** Request id -> channels awaiting the server's ack. */
const PendingRequests = new Map<string, PendingRequest>();

let socket: WebSocket | undefined;
let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
let shuttingDown = false;

const channelForSymbol = (symbol: string): string =>
    `${CHANNEL_PREFIX}${symbol.toUpperCase()}-${QUOTE}`;

/**
 * Pintu reports volume in base units. lister marks Pintu as an IDR-quoted
 * exchange, and the receiver treats those books as `[price, idr_notional]`,
 * so the base volume is multiplied by price (same as the legacy worker).
 */
const toLevel = (row: PintuLevelRaw): [number, number] => {
    const price = Number(row[0]);
    const volume = Number(row[1]);
    return [price, volume * price];
};

function send(payload: unknown): void {
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
    }
}

function request(
    method: "subscribe" | "unsubscribe",
    entries: ReadonlyArray<{ channel: string; cmcId: number }>,
): void {
    if (entries.length === 0) return;
    if (socket?.readyState !== WebSocket.OPEN) return;

    const requestId = randomUUID();
    PendingRequests.set(requestId, {
        method,
        channels: new Map(entries.map((entry) => [entry.channel, entry.cmcId])),
    });
    for (const entry of entries) PendingChannels.add(entry.channel);

    send({
        method,
        params: { channels: entries.map((entry) => entry.channel) },
        request_id: requestId,
        timestamp: Date.now(),
    });
}

function subscribe(symbols: SymbolSubscription[]): void {
    const entries: Array<{ channel: string; cmcId: number }> = [];

    for (const item of symbols) {
        const channel = channelForSymbol(item.symbol);
        ChannelStore.set(channel, item.cmcId);
        LastSentAt.set(channel, Date.now());

        if (SentChannels.has(channel) || PendingChannels.has(channel)) continue;
        entries.push({ channel, cmcId: item.cmcId });
    }

    request("subscribe", entries);
}

function unsubscribe(symbols: SymbolSubscription[]): void {
    const entries: Array<{ channel: string; cmcId: number }> = [];

    for (const item of symbols) {
        const channel = channelForSymbol(item.symbol);
        const cmcId = ChannelStore.get(channel) ?? item.cmcId;
        if (!ChannelStore.delete(channel)) continue;

        LastSentAt.delete(channel);
        if (SentChannels.has(channel)) {
            entries.push({ channel, cmcId });
        }
    }

    request("unsubscribe", entries);
    postUnsubscribed(symbols.map((item) => item.cmcId));
}

/** Handle a subscribe/unsubscribe ack (one frame per channel). */
function handleAck(message: PintuMessageRaw): void {
    const requestId = message.request_id;
    const channel = message.data?.channel ?? message.channel;
    if (!requestId || !channel) return;

    const pending = PendingRequests.get(requestId);
    if (!pending) return;
    if (!pending.channels.has(channel)) return;

    const cmcId = pending.channels.get(channel);
    pending.channels.delete(channel);
    PendingChannels.delete(channel);
    if (pending.channels.size === 0) PendingRequests.delete(requestId);

    if (message.code !== undefined && message.code !== 0) {
        const detail = message.message ?? `code ${message.code}`;
        logger.error(`pintu ${pending.method} rejected ${channel}: ${detail}`);
        postError(
            `pintu ${pending.method} rejected for ${channel}: ${detail}`,
            cmcId === undefined ? undefined : [cmcId],
        );
        return;
    }

    if (pending.method === "subscribe") {
        // The symbol was removed while the subscribe was in flight.
        if (!ChannelStore.has(channel)) {
            if (cmcId !== undefined) {
                request("unsubscribe", [{ channel, cmcId }]);
            }
            return;
        }

        SentChannels.add(channel);
        if (cmcId !== undefined) postSubscribed([cmcId]);
        return;
    }

    SentChannels.delete(channel);
}

/** The server asks for a heartbeat roughly every 30 seconds; echo its id. */
function handleHeartbeat(message: PintuMessageRaw): void {
    send({
        method: "heartbeat-response",
        request_id: message.request_id ?? randomUUID(),
        timestamp: Date.now(),
    });
}

/** Handle an aggregated book snapshot. */
function handleData(message: PintuMessageRaw): void {
    const channel = message.channel ?? message.data?.channel;
    if (!channel) return;

    const cmcId = ChannelStore.get(channel);
    if (cmcId === undefined) return;

    const asks = message.data?.asks;
    const bids = message.data?.bids;
    if (!Array.isArray(asks) || !Array.isArray(bids)) return;

    // Throttle the broker per coin; Pintu may push more than once a second.
    const now = Date.now();
    const lastSentAt = LastSentAt.get(channel);
    if (lastSentAt !== undefined && now - lastSentAt < SEND_INTERVAL_MS) {
        return;
    }
    LastSentAt.set(channel, now);

    publisher.publish({
        cmcId,
        asks: asks.map(toLevel),
        bids: bids.map(toLevel),
    });
}

function scheduleReconnect(): void {
    if (shuttingDown || reconnectTimer) return;
    logger.info(`socket closed, reconnecting in ${RECONNECT_DELAY_MS}ms`);
    postState(threadId, exchange, WorkerState.Reconnecting);
    reconnectTimer = setTimeout(() => {
        reconnectTimer = undefined;
        connect();
    }, RECONNECT_DELAY_MS);
}

function connect(): void {
    if (shuttingDown) return;

    const ws = new WebSocket(WS_URL);
    socket = ws;

    ws.on("open", () => {
        if (socket !== ws) return;
        SentChannels.clear();
        PendingChannels.clear();
        PendingRequests.clear();
        logger.info("socket open, subscribing");
        postState(threadId, exchange, WorkerState.Connected);

        // Pintu drops subscriptions on reconnect, so replay everything held.
        request(
            "subscribe",
            [...ChannelStore].map(([channel, cmcId]) => ({ channel, cmcId })),
        );
    });

    ws.on("message", (raw: RawData) => {
        if (socket !== ws) return;

        let message: PintuMessageRaw;
        try {
            message = JSON.parse(raw.toString()) as PintuMessageRaw;
        } catch {
            // Ignore malformed frames; a bad frame must not crash the worker.
            return;
        }
        if (typeof message !== "object" || message === null) return;

        if (message.method === "subscription") {
            handleData(message);
        } else if (
            message.method === "subscribe" ||
            message.method === "unsubscribe"
        ) {
            handleAck(message);
        } else if (message.method === "heartbeat-request") {
            handleHeartbeat(message);
        }
    });

    ws.on("close", (code, reason) => {
        if (socket !== ws) return;
        SentChannels.clear();
        PendingChannels.clear();
        PendingRequests.clear();
        logger.info(`socket closed code=${code} reason=${reason.toString()}`);
        postState(threadId, exchange, WorkerState.Closed);
        scheduleReconnect();
    });

    ws.on("error", (error) => {
        if (socket !== ws) return;
        logger.error(
            `socket error: ${error instanceof Error ? error.message : String(error)}`,
        );
        postError(error instanceof Error ? error.message : String(error));
        ws.close();
    });
}

onCommand((command) => {
    if (command.type === "subscribe") subscribe(command.symbols);
    if (command.type === "unsubscribe") unsubscribe(command.symbols);
    if (command.type === "shutdown") {
        shuttingDown = true;
        clearTimeout(reconnectTimer);
        socket?.close();
        void publisher.close().finally(() => process.exit(0));
    }
});

subscribe(initialSymbols);
connect();
