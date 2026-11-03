// import { threadId as nodeThreadId } from "node:worker_threads";

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
import { INDODAX_SUBSCRIBE_PAIR_ID_BY_CMC_ID } from "./indodax-symbols";

const { exchange, threadId, symbols: initialSymbols } = bootstrap();

const logger = createLogger(`arbitrator/sender/worker/${exchange}-${threadId}`);
const publisher = await createOrderbookPublisher(exchange);

const WS_URL = "wss://ws3.indodax.com/ws/";
// Static token published by Indodax in the market data docs.
const TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5NDY2MTg0MTV9.UR1lBM6Eqh0yWz-PVirw1uPCxe60FdchR8eNVdsskeo";
const RECONNECT_DELAY_MS = 2000;
const PING_INTERVAL_MS = 60_000;

type IndodaxLevelRaw = {
    price: string;
    idr_volume: string;
};

type IndodaxMessageRaw = {
    id?: number;
    result?: {
        channel?: string;
        data?: {
            data?: {
                pair: string;
                ask?: IndodaxLevelRaw[];
                bid?: IndodaxLevelRaw[];
            };
        };
    };
};

/** indodax channel (e.g. `market:order-book-btcidr`) -> cmcId. */
const ChannelStore = new Map<string, number>();
/** channel -> last time a snapshot was published, for per-coin throttling. */
const LastSentAt = new Map<string, number>();
/** At most one snapshot per coin is forwarded to RabbitMQ per interval. */
const SEND_INTERVAL_MS = 1000;
/** Channels subscribed on the current connection; reset on every (re)connect. */
const SentChannels = new Set<string>();
/** Subscribe request id -> channel, awaiting the server's ack. */
const PendingSubscribes = new Map<number, string>();

let socket: WebSocket | undefined;
let pingTimer: ReturnType<typeof setInterval> | undefined;
let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
let authenticated = false;
let authRequestId = 0;
let requestId = 0;
let shuttingDown = false;

const nextRequestId = () => {
    requestId += 1;
    return requestId;
};

/**
 * The channel Indodax uses for a market. lister stores Indodax's *display*
 * ticker (`traded_currency_unit`), which is not always the websocket pair id
 * (`thresholdidr` but `T`; renamed markets stream the old ticker, `lendidr` for
 * `aaveidr`), so the CMC id is looked up first. Unknown ids fall back to
 * `<ticker>idr`.
 */
const channelForSymbol = (cmcId: number, symbol: string): string => {
    const pairId =
        INDODAX_SUBSCRIBE_PAIR_ID_BY_CMC_ID[cmcId] ?? defaultPairId(symbol);
    return `market:order-book-${pairId}`;
};

const defaultPairId = (symbol: string): string => {
    const base = symbol.toLowerCase();
    return base.endsWith("idr") ? base : `${base}idr`;
};

const toLevel = (row: IndodaxLevelRaw): [number, number] => [
    Number(row.price),
    Number(row.idr_volume),
];

function parseFrames(raw: RawData): IndodaxMessageRaw[] {
    try {
        const frames: IndodaxMessageRaw[] = [];
        for (const line of raw.toString().split("\n")) {
            const trimmed = line.trim();
            if (trimmed.length === 0) continue;
            try {
                frames.push(JSON.parse(trimmed) as IndodaxMessageRaw);
            } catch {
                // Ignore a malformed line; keep any valid frames from the same read.
            }
        }
        return frames;
    } catch {
        // Never let a malformed frame take the worker down.
        return [];
    }
}

function send(payload: unknown): void {
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
    }
}

function subscribeChannel(channel: string): void {
    if (!authenticated || SentChannels.has(channel)) return;
    SentChannels.add(channel);
    const id = nextRequestId();
    PendingSubscribes.set(id, channel);
    send({ method: 1, params: { channel }, id });
}

function unsubscribeChannel(channel: string): void {
    if (!SentChannels.delete(channel)) return;
    send({ method: 2, params: { channel }, id: nextRequestId() });
}

function subscribe(symbols: SymbolSubscription[]): void {
    for (const item of symbols) {
        const channel = channelForSymbol(item.cmcId, item.symbol);
        ChannelStore.set(channel, item.cmcId);
        LastSentAt.set(channel, Date.now());
        subscribeChannel(channel);
    }
}

function unsubscribe(symbols: SymbolSubscription[]): void {
    for (const item of symbols) {
        const channel = channelForSymbol(item.cmcId, item.symbol);
        if (!ChannelStore.delete(channel)) continue;
        LastSentAt.delete(channel);
        unsubscribeChannel(channel);
    }
    postUnsubscribed(symbols.map((item) => item.cmcId));
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
        authenticated = false;
        SentChannels.clear();
        PendingSubscribes.clear();
        logger.info("socket open, authenticating");
        postState(threadId, exchange, WorkerState.Connected);

        authRequestId = nextRequestId();
        send({ params: { token: TOKEN }, id: authRequestId });

        clearInterval(pingTimer);
        pingTimer = setInterval(() => {
            send({ method: 7, id: nextRequestId() });
        }, PING_INTERVAL_MS);
    });

    ws.on("message", (raw) => {
        if (socket !== ws) return;
        try {
            for (const parsed of parseFrames(raw)) {
                // Auth ack: flush every currently-held channel onto this connection.
                if (parsed.id !== undefined && parsed.id === authRequestId) {
                    authenticated = true;
                    for (const channel of ChannelStore.keys())
                        subscribeChannel(channel);
                    continue;
                }

                // Subscribe ack: mark the channel confirmed and report it upstream.
                if (typeof parsed?.id === "number") {
                    const acked = PendingSubscribes.get(parsed.id);
                    if (acked !== undefined) {
                        PendingSubscribes.delete(parsed.id);
                        const cmcId = ChannelStore.get(acked);
                        if (cmcId !== undefined) postSubscribed([cmcId]);
                        continue;
                    }
                }

                const result = parsed?.result;
                const channel = result?.channel;
                if (typeof channel !== "string") continue;

                const cmcId = ChannelStore.get(channel);
                if (cmcId === undefined) continue;

                const data = result?.data?.data;
                if (!data?.ask || !data?.bid) continue;

                // Throttle the broker per coin; the receiver only needs the
                // latest snapshot each second regardless of how fast indodax
                // pushes.
                const now = Date.now();
                const lastSentAt = LastSentAt.get(channel);
                if (
                    lastSentAt !== undefined &&
                    now - lastSentAt < SEND_INTERVAL_MS
                ) {
                    continue;
                }
                LastSentAt.set(channel, now);

                publisher.publish({
                    cmcId,
                    asks: data.ask.map(toLevel),
                    bids: data.bid.map(toLevel),
                });
            }
        } catch {
            // Ignore anything malformed; a bad frame must not crash the worker.
        }
    });

    ws.on("close", (code, reason) => {
        if (socket !== ws) return;
        clearInterval(pingTimer);
        pingTimer = undefined;
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
        clearInterval(pingTimer);
        clearTimeout(reconnectTimer);
        socket?.close();
        void publisher.close().finally(() => process.exit(0));
    }
});

subscribe(initialSymbols);
connect();
