import { type SymbolSubscription, WorkerState } from "@arbitrator/contracts";
import { createLogger } from "@arbitrator/logger";
import WebSocket, { type RawData } from "ws";

import { PushDataV3ApiWrapper } from "../../vendor/mexc-websocket-proto/gen/PushDataV3ApiWrapper";
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

const WS_URL = "wss://wbs-api.mexc.com/ws";
const DEPTH_CHANNEL = "spot@public.limit.depth.v3.api.pb";
const DEPTH_LEVELS = "20";
const RECONNECT_DELAY_MS = 2000;
const PING_INTERVAL_MS = 5000;
/** At most one snapshot per coin is forwarded to RabbitMQ per interval. */
const SEND_INTERVAL_MS = 1000;

/** Matches a limit-depth parameter and captures the pair, e.g. `...@BTCUSDT@20`. */
const DEPTH_PARAMETER_RE = new RegExp(
    `${DEPTH_CHANNEL.replace(/\./g, "\\.")}@([A-Z0-9]+)@(\\d+)`,
);

/** pair (e.g. `BTCUSDT`) -> cmcId. */
const PairStore = new Map<string, number>();
/** pair -> last time a snapshot was published, for per-coin throttling. */
const LastSentAt = new Map<string, number>();
/** Depth parameters subscribed on the current connection; reset on (re)connect. */
const SentParameters = new Set<string>();

let socket: WebSocket | undefined;
let pingTimer: ReturnType<typeof setInterval> | undefined;
let reconnectTimer: ReturnType<typeof setTimeout> | undefined;
let shuttingDown = false;

const pairForSymbol = (symbol: string) => `${symbol.toUpperCase()}USDT`;
const parameterForPair = (pair: string) =>
    `${DEPTH_CHANNEL}@${pair}@${DEPTH_LEVELS}`;

const toLevel = (row: {
    price: string;
    quantity: string;
}): [number, number] => [Number(row.price), Number(row.quantity)];

function toBuffer(raw: RawData): Buffer {
    if (Buffer.isBuffer(raw)) return raw;
    if (raw instanceof ArrayBuffer) return Buffer.from(raw);
    return Buffer.concat(raw);
}

function send(payload: unknown): void {
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(payload));
    }
}

function subscribeParameter(parameter: string): void {
    if (socket?.readyState !== WebSocket.OPEN) return;
    if (SentParameters.has(parameter)) return;
    SentParameters.add(parameter);
    send({ method: "SUBSCRIPTION", params: [parameter] });
}

function unsubscribeParameter(parameter: string): void {
    if (!SentParameters.delete(parameter)) return;
    send({ method: "UNSUBSCRIPTION", params: [parameter] });
}

function subscribe(symbols: SymbolSubscription[]): void {
    for (const item of symbols) {
        const pair = pairForSymbol(item.symbol);
        PairStore.set(pair, item.cmcId);
        LastSentAt.set(pair, Date.now());
        subscribeParameter(parameterForPair(pair));
    }
}

function unsubscribe(symbols: SymbolSubscription[]): void {
    for (const item of symbols) {
        const pair = pairForSymbol(item.symbol);
        if (!PairStore.delete(pair)) continue;
        LastSentAt.delete(pair);
        unsubscribeParameter(parameterForPair(pair));
    }
    postUnsubscribed(symbols.map((item) => item.cmcId));
}

/** Handle a JSON control frame (ping/pong and subscription acks). */
function handleControlFrame(raw: Buffer): void {
    let parsed: unknown;
    try {
        parsed = JSON.parse(raw.toString("utf8"));
    } catch {
        handleDataFrame(raw);
        return;
    }

    if (typeof parsed !== "object" || parsed === null) return;
    const frame = parsed as { code?: number; msg?: string };

    if (frame.msg === "PONG") return;
    if (typeof frame.msg !== "string") return;

    // The subscription ack echoes the depth parameter in `msg`.
    const match = frame.msg.match(DEPTH_PARAMETER_RE);
    if (!match) return;

    const parameter = match[0];
    const pair = match[1];
    if (pair === undefined) return;

    if (frame.code !== undefined && frame.code !== 0) {
        logger.error(`subscribe rejected pair=${pair} msg=${frame.msg}`);
        postError(`mexc subscribe rejected for ${pair}: ${frame.msg}`);
        return;
    }

    // Ignore acks for parameters we already dropped (e.g. an unsubscribe).
    if (!SentParameters.has(parameter)) return;

    const cmcId = PairStore.get(pair);
    if (cmcId !== undefined) postSubscribed([cmcId]);
}

/** Handle a protobuf depth frame. */
function handleDataFrame(raw: Buffer): void {
    try {
        const message = PushDataV3ApiWrapper.decode(raw);
        const pair = message.symbol;
        if (pair === undefined) return;

        const cmcId = PairStore.get(pair);
        if (cmcId === undefined) return;

        const depth = message.publicLimitDepths;
        if (!depth) return;

        // Throttle the broker per coin: MEXC pushes far faster than once a
        // second, but the receiver only needs the latest snapshot each second.
        const now = Date.now();
        const lastSentAt = LastSentAt.get(pair);
        if (lastSentAt !== undefined && now - lastSentAt < SEND_INTERVAL_MS) {
            return;
        }
        LastSentAt.set(pair, now);

        publisher.publish({
            cmcId,
            asks: depth.asks.map(toLevel),
            bids: depth.bids.map(toLevel),
        });
    } catch (error) {
        logger.error(
            `failed to decode frame: ${error instanceof Error ? error.message : String(error)}`,
        );
    }
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
        SentParameters.clear();
        logger.info("socket open, subscribing");
        postState(threadId, exchange, WorkerState.Connected);

        // MEXC drops subscriptions on reconnect, so replay everything held.
        for (const pair of PairStore.keys()) {
            subscribeParameter(parameterForPair(pair));
        }

        clearInterval(pingTimer);
        pingTimer = setInterval(() => {
            send({ method: "PING" });
        }, PING_INTERVAL_MS);
    });

    ws.on("message", (raw) => {
        if (socket !== ws) return;
        handleControlFrame(toBuffer(raw));
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
