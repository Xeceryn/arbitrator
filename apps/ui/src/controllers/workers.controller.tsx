import type { OrchestratorStatus } from "@arbitrator/contracts";
import type { ExchangeSelect } from "@arbitrator/lister/types";
import { Elysia, redirect, t } from "elysia";

import { BaseLayout } from "../helpers/BaseLayout";
import { type AppClients, clientsPlugin } from "../plugins/clients";
import { htmx } from "../plugins/htmx";
import { getLastSenderStatus, subscribeToSenderStatus } from "../sender-stream";
import { PageHeading } from "../views/components/PageHeading";
import {
    renderWorkerRow,
    type WorkersData,
    WorkersPage,
    WorkersResults,
    wrapWorkerRowPartial,
} from "../views/pages/WorkersPage";

const slugParam = t.Object({ slug: t.String({ minLength: 1 }) });

/**
 * Eden reports a failed call as `{ status, value }`. Elysia keeps the status
 * union wide (`unknown`) when a route declares several statuses, so only
 * `value` is used here — never treat `status` as a number.
 */
type SenderCallError = { status: unknown; value: unknown } | null | undefined;

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

    const { data: list, error: listError } = await lister.exchange.get({
        // The lister schema declares these as defaults, which Elysia applies on
        // the server; Eden types the whole query, so pass them explicitly.
        query: {
            page: 1,
            limit: -1,
            search: "",
            searchBy: "name",
            orderBy: "id",
            order: "asc",
        },
    });
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
 * The sender only knows slugs, so every render needs these names. Refreshed on
 * every snapshot; never re-requested per event.
 */
let cachedExchanges: ExchangeSelect[] = [];

function cacheExchanges(exchanges: ExchangeSelect[]): void {
    cachedExchanges = exchanges;
}

/**
 * Last row HTML sent for each exchange, keyed by slug. The sender pushes its
 * full status on every mutation; the UI diffs the rendered rows against this
 * map and sends only what changed. Kept in sync by both the socket push and the
 * write endpoints, so a row is never sent twice for the same state.
 */
const lastPushedRows = new Map<string, string>();

/** Render every exchange's row once, keyed by slug. */
function buildRowState(status: OrchestratorStatus): Map<string, string> {
    return new Map(
        cachedExchanges.map((exchange) => [
            exchange.slug,
            renderWorkerRow(status, exchange),
        ]),
    );
}

function resetLastPushedRows(next: Map<string, string>): void {
    lastPushedRows.clear();
    for (const [slug, html] of next) lastPushedRows.set(slug, html);
}

/**
 * Every connected workers board. One shared sender stream feeds all of them:
 * on each status event the UI renders every exchange row, compares it with the
 * last row it sent, and pushes only the changed ones as `<hx-partial>`
 * fragments. `outerMorph` keeps focus and scroll inside a row across a push.
 */
const browserSockets = new Set<BrowserSocket>();
let unsubscribeSender: (() => void) | null = null;

function broadcast(status: OrchestratorStatus): void {
    if (browserSockets.size === 0) return;

    const changed: string[] = [];
    const present = new Set<string>();
    for (const exchange of cachedExchanges) {
        present.add(exchange.slug);
        const html = renderWorkerRow(status, exchange);
        if (lastPushedRows.get(exchange.slug) !== html) {
            lastPushedRows.set(exchange.slug, html);
            changed.push(wrapWorkerRowPartial(exchange.slug, html));
        }
    }
    // An exchange removed from the lister list no longer has a row to push.
    for (const slug of lastPushedRows.keys()) {
        if (!present.has(slug)) lastPushedRows.delete(slug);
    }

    if (changed.length === 0) {
        console.log("[workers-ws] push skipped: no changed rows");
        return;
    }

    const payload = changed.join("");
    let sent = 0;
    for (const ws of browserSockets) {
        if (ws.readyState === 1) {
            ws.send(payload);
            sent += 1;
        }
    }
    console.log(
        `[workers-ws] pushed ${changed.length} changed row(s) of ${cachedExchanges.length} to ${sent}/${browserSockets.size} sockets`,
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

/**
 * The current sender status for a write response. Prefer a fresh HTTP read;
 * fall back to the last socket push if the sender is momentarily unreachable.
 */
async function freshSenderStatus(
    sender: AppClients["sender"],
): Promise<OrchestratorStatus | undefined> {
    const { data, error } = await sender.exchanges.get();
    if (error || !data) return getLastSenderStatus();
    return data;
}

/** Minimal response for start/stop: just the affected exchange's row. */
async function oneRowResponse(
    sender: AppClients["sender"],
    slug: string,
): Promise<string> {
    const status = await freshSenderStatus(sender);
    const exchange = cachedExchanges.find(
        (candidate) => candidate.slug === slug,
    );
    if (!status || !exchange) return "";
    const html = renderWorkerRow(status, exchange);
    lastPushedRows.set(slug, html);
    return wrapWorkerRowPartial(slug, html);
}

/** Minimal response for reconcile: one partial per row that changed. */
async function changedRowsResponse(
    sender: AppClients["sender"],
): Promise<string> {
    const status = await freshSenderStatus(sender);
    if (!status) return "";
    const parts: string[] = [];
    for (const exchange of cachedExchanges) {
        const html = renderWorkerRow(status, exchange);
        if (lastPushedRows.get(exchange.slug) !== html) {
            lastPushedRows.set(exchange.slug, html);
            parts.push(wrapWorkerRowPartial(exchange.slug, html));
        }
    }
    return parts.join("");
}

export const WorkersController = new Elysia({
    name: "workers",
    tags: ["workers"],
})
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
     * Fire-and-forget mutation: forward to the sender, toast the outcome, and
     * return one partial per changed exchange row. The main swap stays `none`;
     * the partials morph the rows.
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
        return changedRowsResponse(sender);
    })

    .post(
        "/workers/:slug/start",
        { params: slugParam },
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
            return oneRowResponse(sender, params.slug);
        },
    )

    .post(
        "/workers/:slug/stop",
        { params: slugParam },
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
            return oneRowResponse(sender, params.slug);
        },
    )

    /**
     * The only workers WebSocket in the UI. One shared sender stream broadcasts
     * only the rows that changed to every connected board; the subscription
     * runs only while at least one socket is open.
     */
    .ws("/workers/ws", {
        async open(ws) {
            const socket = ws as unknown as BrowserSocket;
            browserSockets.add(socket);
            ensureSenderSubscription();
            console.log(
                `[workers-ws] browser connected (${browserSockets.size} sockets)`,
            );

            // A board can connect before this process ever rendered a page, so
            // the exchange list may be cold. Load it before rendering rows.
            if (cachedExchanges.length === 0) {
                try {
                    await loadWorkersData({
                        lister: ws.lister,
                        sender: ws.sender,
                    });
                } catch (error) {
                    console.error(
                        `[workers-ws] initial exchange load failed: ${error instanceof Error ? error.message : String(error)}`,
                    );
                }
            }

            const status = getLastSenderStatus();
            if (!status) {
                console.log(
                    "[workers-ws] initial sync deferred: no sender status yet",
                );
                return;
            }
            if (cachedExchanges.length === 0) {
                console.log(
                    "[workers-ws] initial sync skipped: no exchanges cached",
                );
                return;
            }

            const rows = buildRowState(status);
            resetLastPushedRows(rows);
            const payload = [...rows.entries()]
                .map(([slug, html]) => wrapWorkerRowPartial(slug, html))
                .join("");
            if (socket.readyState === 1) socket.send(payload);
            console.log(`[workers-ws] initial sync rows=${rows.size}`);
        },
        close(ws) {
            browserSockets.delete(ws as unknown as BrowserSocket);
            console.log(
                `[workers-ws] browser disconnected (${browserSockets.size} sockets)`,
            );
            releaseSenderSubscription();
        },
    });
