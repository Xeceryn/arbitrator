import type { OrchestratorStatus } from "@arbitrator/contracts";
import type { ExchangeSelect } from "@arbitrator/lister/types";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { Elysia, redirect, status } from "elysia";
import z from "zod";

import { BaseLayout } from "../helpers/BaseLayout";
import { type AppClients, clientsPlugin } from "../plugins/clients";
import { getLastSenderStatus, subscribeToSenderStatus } from "../sender-stream";
import { PageHeading } from "../views/components/PageHeading";
import {
    type WorkersData,
    WorkersPage,
    WorkersResults,
    WorkersStatusUpdate,
} from "../views/pages/WorkersPage";

const slugParam = z.object({ slug: z.string().min(1) });

type SenderCallError = { status: number; value: unknown } | null | undefined;

/** Sender failures arrive as `{ message }` (501) or a validation body. */
function senderErrorMessage(error: SenderCallError, fallback: string): string {
    if (!error) return fallback;
    const value = error.value;
    if (typeof value === "string" && value.length > 0) return value;
    if (value && typeof value === "object") {
        const record = value as { message?: unknown; summary?: unknown };
        if (typeof record.message === "string" && record.message.length > 0) {
            return record.message;
        }
        if (typeof record.summary === "string" && record.summary.length > 0) {
            return record.summary;
        }
    }
    return fallback;
}

async function loadWorkersData({
    lister,
    sender,
}: AppClients): Promise<WorkersData> {
    const { data, error } = await sender.exchanges.get();
    if (error || !data) {
        return {
            ok: false,
            message: senderErrorMessage(error, "Unable to reach the sender."),
        };
    }

    const [listError, list] = await lister.exchange.list({ limit: -1 });
    if (listError || !list) {
        return { ok: false, message: "Unable to load exchanges." };
    }

    cacheExchanges(list.data);
    return { ok: true, status: data, exchanges: list.data };
}

type BrowserSocket = {
    readyState: number;
    send(data: unknown): unknown;
};

/**
 * Exchange list from the last snapshot (`GET /workers`, `/workers/list`).
 * The sender only knows slugs, so the socket needs these names to render row
 * action buttons. Refreshed on every snapshot; never re-requested per event.
 */
let cachedExchanges: ExchangeSelect[] = [];

function cacheExchanges(exchanges: ExchangeSelect[]): void {
    cachedExchanges = exchanges;
}

/**
 * Every connected workers board. One shared sender stream feeds all of them:
 * the sender pushes its full status on every mutation and this fans the same
 * rendered `WorkersStatusUpdate` fragment out to each socket. The exchange
 * list is only fetched once per page load; nothing polls after that.
 */
const browserSockets = new Set<BrowserSocket>();
let unsubscribeSender: (() => void) | null = null;

function broadcast(status: OrchestratorStatus): void {
    if (browserSockets.size === 0) return;
    const html = (
        <WorkersStatusUpdate status={status} exchanges={cachedExchanges} />
    );
    let sent = 0;
    for (const ws of browserSockets) {
        if (ws.readyState === 1) {
            ws.send(html);
            sent += 1;
        }
    }
    console.log(
        `[workers-ws] broadcast started=${status.started.length} workers=${status.workers.length} to ${sent}/${browserSockets.size} sockets`,
    );
}

function ensureSenderSubscription(): void {
    if (unsubscribeSender) return;
    unsubscribeSender = subscribeToSenderStatus(broadcast);
}

function releaseSenderSubscription(): void {
    if (browserSockets.size === 0 && unsubscribeSender) {
        unsubscribeSender();
        unsubscribeSender = null;
    }
}

export const WorkersController = new Elysia()
    .use(htmx())
    .use(clientsPlugin)

    .get("/workers", async ({ hx, lister, sender }) => {
        const data = await loadWorkersData({ lister, sender });

        if (!hx.isHTMX) {
            return (
                <BaseLayout title="Arbitrator - Workers" heading="Workers">
                    <WorkersPage data={data} />
                </BaseLayout>
            );
        }
        return (
            <>
                <PageHeading heading="Workers" oob />
                <title>Workers</title>
                <WorkersPage data={data} />
            </>
        );
    })

    .get("/workers/list", async ({ hx, lister, sender }) => {
        if (!hx.isHTMX) {
            return redirect("/workers");
        }
        return (
            <WorkersResults data={await loadWorkersData({ lister, sender })} />
        );
    })

    /**
     * Fire-and-forget: forward to the sender, toast the outcome, swap nothing.
     * Every visual change (this tab and all others) arrives via the socket.
     */
    .post("/workers/reconcile", async ({ hx, sender }) => {
        const { error } = await sender.reconcile.post();
        if (error) {
            hx.triggerEvent({
                "make-toast": {
                    level: "error",
                    message: senderErrorMessage(error, "Reconcile failed."),
                },
            });
        } else {
            hx.triggerEvent({
                "make-toast": {
                    level: "success",
                    message: "Reconciled workers from current metadata",
                },
            });
        }
        hx.reswap("none");
        return status("No Content");
    })

    .post(
        "/workers/:slug/start",
        async ({ params, hx, sender }) => {
            const { error } = await sender
                .exchanges({ slug: params.slug })
                .start.post();

            if (error) {
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: senderErrorMessage(
                            error,
                            `Failed to start ${params.slug}.`,
                        ),
                    },
                });
            } else {
                hx.triggerEvent({
                    "make-toast": {
                        level: "success",
                        message: `Started ${params.slug}`,
                    },
                });
            }

            hx.reswap("none");
            return status("No Content");
        },
        { params: slugParam },
    )

    .post(
        "/workers/:slug/stop",
        async ({ params, hx, sender }) => {
            const { error } = await sender
                .exchanges({ slug: params.slug })
                .stop.post();

            if (error) {
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: senderErrorMessage(
                            error,
                            `Failed to stop ${params.slug}.`,
                        ),
                    },
                });
            } else {
                hx.triggerEvent({
                    "make-toast": {
                        level: "success",
                        message: `Stopped ${params.slug}`,
                    },
                });
            }

            hx.reswap("none");
            return status("No Content");
        },
        { params: slugParam },
    )

    /**
     * The only workers WebSocket in the UI. One shared sender stream
     * broadcasts a single rendered status fragment to every connected board;
     * the subscription runs only while at least one socket is open.
     */
    .ws("/workers/ws", {
        open(ws) {
            const socket = ws as unknown as BrowserSocket;
            browserSockets.add(socket);
            ensureSenderSubscription();
            console.log(
                `[workers-ws] browser connected (${browserSockets.size} sockets)`,
            );
            // Catch-up: a browser joining an idle page gets the last known
            // status immediately instead of waiting for the next sender event.
            const last = getLastSenderStatus();
            if (last && socket.readyState === 1) {
                socket.send(
                    <WorkersStatusUpdate
                        status={last}
                        exchanges={cachedExchanges}
                    />,
                );
            }
        },
        close(ws) {
            browserSockets.delete(ws as unknown as BrowserSocket);
            console.log(
                `[workers-ws] browser disconnected (${browserSockets.size} sockets)`,
            );
            releaseSenderSubscription();
        },
    });
