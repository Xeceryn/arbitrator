import { htmx } from "@gtramontina.com/elysia-htmx";
import { Elysia, redirect } from "elysia";
import z from "zod";

import { BaseLayout } from "../helpers/BaseLayout";
import { type AppClients, clientsPlugin } from "../plugins/clients";
import { PageHeading } from "../views/components/PageHeading";
import {
    type SenderStatus,
    type WorkersData,
    WorkersPage,
    WorkersResults,
    WorkersRowUpdate,
    WorkersStatusUpdate,
} from "../views/pages/WorkersPage";

const slugParam = z.object({ slug: z.string().min(1) });

/** Eden surfaces the error body; sender returns `{ message }` for 501s. */
function describeError(error: unknown): string {
    if (!error) return "request failed";
    if (typeof error === "object" && error !== null) {
        const record = error as Record<string, unknown>;
        const value = record.value;
        if (value && typeof value === "object" && "message" in value) {
            return String((value as { message: unknown }).message);
        }
        if ("message" in record) return String(record.message);
    }
    return String(error);
}

/** Tolerate a sender that is older/newer than this UI (missing fields). */
function numberRecord(value: unknown): Record<string, number> {
    return value && typeof value === "object"
        ? (value as Record<string, number>)
        : {};
}

/** Tolerate a sender that is older/newer than this UI (missing fields). */
function normalizeStatus(input: unknown): SenderStatus {
    const record = (input ?? {}) as Partial<SenderStatus>;
    return {
        started: Array.isArray(record.started) ? record.started : [],
        workers: Array.isArray(record.workers) ? record.workers : [],
        failures: numberRecord(record.failures),
        desired: numberRecord(record.desired),
        capacity: numberRecord(record.capacity),
        supported: Array.isArray(record.supported) ? record.supported : [],
    };
}

async function loadWorkersData({
    lister,
    sender,
}: AppClients): Promise<WorkersData> {
    try {
        const { data, error } = await sender.exchanges.get();
        if (error || !data) {
            return { ok: false, message: describeError(error) };
        }

        const [listError, list] = await lister.exchange.list({ limit: -1 });
        if (listError || !list) {
            return { ok: false, message: "Unable to load exchanges." };
        }

        return {
            ok: true,
            status: normalizeStatus(data),
            exchanges: list.data,
        };
    } catch (error) {
        return { ok: false, message: describeError(error) };
    }
}

/**
 * Sender-only status for the poll. Deliberately skips the lister, so the 3s
 * refresh never re-requests the exchange list.
 */
async function loadSenderStatus({
    sender,
}: Pick<AppClients, "sender">): Promise<SenderStatus | undefined> {
    try {
        const { data, error } = await sender.exchanges.get();
        if (error || !data) return undefined;
        return normalizeStatus(data);
    } catch {
        return undefined;
    }
}

/**
 * After start/stop, swap only the affected row (the primary response) and let
 * the summary/hint update out-of-band. Falls back to the full results when the
 * data can't be loaded.
 */
async function renderRowUpdate(clients: AppClients, slug: string) {
    const data = await loadWorkersData(clients);
    if (!data.ok) {
        return <WorkersResults data={data} />;
    }

    const exchange = data.exchanges.find((item) => item.slug === slug);
    if (!exchange) {
        return <WorkersResults data={data} />;
    }

    return <WorkersRowUpdate status={data.status} exchange={exchange} />;
}

export const WorkersController = new Elysia()
    .use(htmx())
    .use(clientsPlugin)

    .get("/workers", async ({ hx, lister, sender }) => {
        const data = await loadWorkersData({ lister, sender });

        if (!hx.isHTMX) {
            return (
                <BaseLayout title="arbitmage - Workers" heading="Workers">
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

    .get("/workers/status", async ({ sender }) => {
        const status = await loadSenderStatus({ sender });
        if (!status) return "";
        return <WorkersStatusUpdate status={status} />;
    })

    .post("/workers/reconcile", async ({ hx, lister, sender }) => {
        const { error } = await sender.reconcile.post();
        if (error) {
            hx.triggerEvent({
                "make-toast": { level: "error", message: describeError(error) },
            });
        } else {
            hx.triggerEvent({
                "make-toast": {
                    level: "success",
                    message: "Reconciled workers from current metadata",
                },
            });
        }
        return (
            <WorkersResults data={await loadWorkersData({ lister, sender })} />
        );
    })

    .post(
        "/workers/:slug/start",
        async ({ params, hx, lister, sender }) => {
            const { error } = await sender
                .exchanges({ slug: params.slug })
                .start.post();

            if (error) {
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: describeError(error),
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

            return renderRowUpdate({ lister, sender }, params.slug);
        },
        { params: slugParam },
    )

    .post(
        "/workers/:slug/stop",
        async ({ params, hx, lister, sender }) => {
            const { error } = await sender
                .exchanges({ slug: params.slug })
                .stop.post();

            if (error) {
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: describeError(error),
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

            return renderRowUpdate({ lister, sender }, params.slug);
        },
        { params: slugParam },
    );
