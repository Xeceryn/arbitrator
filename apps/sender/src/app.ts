import {
    orchestratorStatusSchema,
    senderMessageSchema,
    senderStartResponseSchema,
    senderStopResponseSchema,
    workerStatusSchema,
} from "@arbitrator/contracts";
import { Elysia } from "elysia";
import z from "zod";

import { createOrchestrator } from "./orchestrator/bootstrap";
import type { Orchestrator } from "./orchestrator/service";
import { eventsPlugin } from "./plugins/events";
import { orchestratorPlugin } from "./plugins/orchestrator";

type SenderSocket = { send(data: string | unknown): unknown };

const slugParams = z.object({ slug: z.string().min(1) });

/** One sender WS subscriber per connected UI. Unsubscribed on close. */
const statusSubscribers = new Map<SenderSocket, () => void>();

export function createApp(orchestrator: Orchestrator) {
    return (
        new Elysia({ name: "arbitrator-sender" })
            .use(orchestratorPlugin(orchestrator))
            .use(eventsPlugin(orchestrator))
            .post(
                "/exchanges/:slug/start",
                ({ params, orchestrator, set }) => {
                    const result = orchestrator.start(params.slug);
                    if (!result.ok) {
                        set.status = 501;
                        return { message: result.reason };
                    }
                    return { started: params.slug };
                },
                {
                    params: slugParams,
                    response: {
                        200: senderStartResponseSchema,
                        501: senderMessageSchema,
                    },
                },
            )
            .post(
                "/exchanges/:slug/stop",
                ({ params, orchestrator }) => {
                    orchestrator.stop(params.slug);
                    return { stopped: params.slug };
                },
                {
                    params: slugParams,
                    response: { 200: senderStopResponseSchema },
                },
            )
            /**
             * Force a full reconcile from current lister metadata. Safety valve for a
             * missed `metadata.changed` event (e.g. the broker was down when it fired).
             */
            .post(
                "/reconcile",
                async ({ orchestrator }) => {
                    await orchestrator.runReconcile();
                    return orchestrator.status();
                },
                { response: { 200: orchestratorStatusSchema } },
            )
            .get("/exchanges", ({ orchestrator }) => orchestrator.status(), {
                response: { 200: orchestratorStatusSchema },
            })
            .get(
                "/workers",
                ({ orchestrator }) => ({
                    workers: orchestrator.status().workers,
                }),
                {
                    response: {
                        200: z.object({
                            workers: z.array(workerStatusSchema),
                        }),
                    },
                },
            )
            /**
             * Event-driven status stream for the UI. Sends one `snapshot` on
             * connect, then a `status` push on every orchestrator mutation —
             * start/stop, reconcile topology change, worker state report,
             * unexpected death and respawn. The UI fans those pushes out to its
             * own `/workers/ws` browsers, so nothing polls `GET /exchanges`.
             */
            .ws("/exchanges/ws", {
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
