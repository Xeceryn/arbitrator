import {
    orchestratorStatusSchema,
    senderMessageSchema,
    senderStartResponseSchema,
    senderStopResponseSchema,
    workerStatusSchema,
} from "@arbitrator/contracts";
import { openapiZodMap } from "@arbitrator/elysia-kit";
import { openapi } from "@elysia/openapi";
import { Elysia } from "elysia";
import { websocket } from "elysia/websocket";
import z from "zod";

import { createOrchestrator } from "./orchestrator/bootstrap";
import type { Orchestrator } from "./orchestrator/service";
import { eventsPlugin } from "./plugins/events";
import { orchestratorPlugin } from "./plugins/orchestrator";

type SenderSocket = { send(data: string | unknown): unknown };

const slugParams = z.object({ slug: z.string().min(1) });

const workersResponseSchema = z.object({
    workers: z.array(workerStatusSchema),
});

/** One sender WS subscriber per connected UI. Unsubscribed on close. */
const statusSubscribers = new Map<SenderSocket, () => void>();

export function createApp(orchestrator: Orchestrator) {
    return (
        new Elysia({ name: "arbitrator-sender" })
            .use(
                openapi({
                    documentation: {
                        info: {
                            title: "Arbitrator Sender",
                            version: "0.0.0",
                        },
                        tags: [
                            {
                                name: "orchestrator",
                                description:
                                    "Start/stop exchanges and force reconcile",
                            },
                            {
                                name: "workers",
                                description: "Worker pool status",
                            },
                            {
                                name: "events",
                                description: "Server-push status stream",
                            },
                        ],
                    },
                    mapJsonSchema: openapiZodMap,
                }),
            )
            // v2 severable WebSocket capability: `.ws()` needs this provider.
            .use(websocket())
            .use(orchestratorPlugin(orchestrator))
            .use(eventsPlugin(orchestrator))
            .post(
                "/exchanges/:slug/start",
                {
                    params: slugParams,
                    response: {
                        200: senderStartResponseSchema,
                        501: senderMessageSchema,
                    },
                    detail: {
                        summary: "Start an exchange worker",
                        tags: ["orchestrator"],
                    },
                },
                ({ params, orchestrator, set }) => {
                    const result = orchestrator.start(params.slug);
                    if (!result.ok) {
                        set.status = 501;
                        return { message: result.reason };
                    }
                    return { started: params.slug };
                },
            )
            .post(
                "/exchanges/:slug/stop",
                {
                    params: slugParams,
                    response: { 200: senderStopResponseSchema },
                    detail: {
                        summary: "Stop an exchange worker",
                        tags: ["orchestrator"],
                    },
                },
                ({ params, orchestrator }) => {
                    orchestrator.stop(params.slug);
                    return { stopped: params.slug };
                },
            )
            /**
             * Force a full reconcile from current lister metadata. Safety valve for a
             * missed `metadata.changed` event (e.g. the broker was down when it fired).
             */
            .post(
                "/reconcile",
                {
                    response: { 200: orchestratorStatusSchema },
                    detail: {
                        summary: "Force a full reconcile against lister",
                        tags: ["orchestrator"],
                    },
                },
                async ({ orchestrator }) => {
                    await orchestrator.runReconcile();
                    return orchestrator.status();
                },
            )
            .get(
                "/exchanges",
                {
                    response: { 200: orchestratorStatusSchema },
                    detail: {
                        summary: "Orchestrator status for every exchange",
                        tags: ["workers"],
                    },
                },
                ({ orchestrator }) => orchestrator.status(),
            )
            .get(
                "/workers",
                {
                    response: { 200: workersResponseSchema },
                    detail: {
                        summary: "Worker pool status",
                        tags: ["workers"],
                    },
                },
                ({ orchestrator }) => ({
                    workers: orchestrator.status().workers,
                }),
            )
            /**
             * Event-driven status stream for the UI. Sends one `snapshot` on
             * connect, then a `status` push on every orchestrator mutation —
             * start/stop, reconcile topology change, worker state report,
             * unexpected death and respawn. The UI fans those pushes out to its
             * own `/workers/ws` browsers, so nothing polls `GET /exchanges`.
             *
             * Server-push only, so it stays out of the OpenAPI document.
             */
            .ws("/exchanges/ws", {
                detail: { tags: ["events"], hide: true },
                open(ws) {
                    const socket = ws as unknown as SenderSocket;
                    socket.send(
                        JSON.stringify({
                            type: "snapshot",
                            status: orchestrator.status(),
                        }),
                    );
                    statusSubscribers.set(
                        socket,
                        orchestrator.subscribe((status) => {
                            socket.send(
                                JSON.stringify({ type: "status", status }),
                            );
                        }),
                    );
                },
                close(ws) {
                    const socket = ws as unknown as SenderSocket;
                    statusSubscribers.get(socket)?.();
                    statusSubscribers.delete(socket);
                },
                message() {
                    // Server-push only; client messages are ignored.
                },
            })
    );
}

export const orchestrator = createOrchestrator();
export const app = createApp(orchestrator);
export type App = typeof app;
