import {
    senderStatusEventSchema,
    type OrchestratorStatus,
} from "@arbitrator/contracts";
import { env } from "@arbitrator/env-loader";
import { Value } from "typebox/value";

const senderHttpUrl = () => env.SENDER_URL;

const senderWsUrl = () =>
    `${senderHttpUrl().replace(/^http/, "ws")}/exchanges/ws`;

type StatusListener = (status: OrchestratorStatus) => void;

const listeners = new Set<StatusListener>();
let socket: WebSocket | null = null;
let reconnectDelayMs = 500;
/** Last status pushed by the sender; served to browsers that connect mid-idle. */
let lastStatus: OrchestratorStatus | undefined;

/**
 * One shared WebSocket to the sender's `/exchanges/ws`. The sender pushes a
 * `snapshot` on connect and a `status` event on every mutation, so the UI
 * never polls `GET /exchanges`. Connects lazily on the first subscriber and
 * reconnects with backoff while anyone is listening.
 */
export function subscribeToSenderStatus(listener: StatusListener): () => void {
    listeners.add(listener);
    ensureConnected();
    return () => {
        listeners.delete(listener);
        if (listeners.size === 0) {
            try {
                socket?.close();
            } catch {
                // Closing a dead socket is a no-op.
            }
            socket = null;
            reconnectDelayMs = 500;
        }
    };
}

/** Most recent sender status, if the stream has delivered anything yet. */
export function getLastSenderStatus(): OrchestratorStatus | undefined {
    return lastStatus;
}

function ensureConnected(): void {
    if (socket || listeners.size === 0) return;
    connect();
}

function connect(): void {
    const url = senderWsUrl();
    let next: WebSocket;
    try {
        next = new WebSocket(url);
    } catch (error) {
        console.error(
            `[sender-stream] connect to ${url} failed: ${error instanceof Error ? error.message : String(error)}`,
        );
        scheduleReconnect(url);
        return;
    }
    socket = next;

    next.addEventListener("open", () => {
        reconnectDelayMs = 500;
        console.log(`[sender-stream] connected to ${url}`);
    });

    next.addEventListener("message", (event) => {
        if (typeof event.data !== "string") return;
        let json: unknown;
        try {
            json = JSON.parse(event.data);
        } catch {
            console.warn("[sender-stream] dropped non-JSON frame");
            return;
        }
        // The contracts schemas are Elysia `t` (TypeBox); `Value.Check` is the
        // type guard, so `json` narrows to `SenderStatusEvent` below.
        if (!Value.Check(senderStatusEventSchema, json)) {
            console.warn(
                `[sender-stream] dropped invalid frame: ${event.data.slice(0, 160)}`,
            );
            return;
        }
        lastStatus = json.status;
        for (const listener of listeners) {
            listener(json.status);
        }
    });

    next.addEventListener("close", (event) => {
        if (socket === next) socket = null;
        console.log(
            `[sender-stream] closed (code=${event.code}); reconnecting ${url}`,
        );
        scheduleReconnect(url);
    });

    next.addEventListener("error", () => {
        try {
            next.close();
        } catch {
            // The close handler schedules the reconnect.
        }
    });
}

function scheduleReconnect(url: string): void {
    if (listeners.size === 0) return;
    const delay = reconnectDelayMs;
    reconnectDelayMs = Math.min(reconnectDelayMs * 2, 10_000);
    console.log(`[sender-stream] retrying ${url} in ${delay}ms`);
    setTimeout(() => {
        if (listeners.size > 0 && !socket) connect();
    }, delay);
}
