import type { ExchangeSelect } from "@arbitrator/lister/types";
import { listerClient } from "@arbitrator/sdk";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { Elysia } from "elysia";
import z from "zod";

import { BaseLayout } from "../helpers/BaseLayout";
import { PageHeading } from "../views/components/PageHeading";
import {
    SignalBoard,
    type SignalQuery,
    SignalPage,
    type SignalsData,
} from "../views/pages/SignalPage";

/**
 * `hide` arrives as a repeated query param (`hide=a&hide=b`), a single value,
 * or nothing. Normalise all three to a string array.
 */
const hideSchema = z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((value) =>
        value === undefined ? [] : Array.isArray(value) ? value : [value],
    );

const signalQuerySchema = z.object({
    view: z.enum(["card", "table"]).default("card"),
    orderBy: z
        .enum(["profitPercentage", "profitVolume"])
        .default("profitPercentage"),
    order: z.enum(["asc", "desc"]).default("desc"),
    hide: hideSchema,
});

const DEFAULT_QUERY: SignalQuery = {
    view: "card",
    orderBy: "profitPercentage",
    order: "desc",
    hide: [],
};

/** Profitable signals, minus any leg touching a hidden exchange. */
async function loadSignals(query: SignalQuery): Promise<SignalsData> {
    const [error, data] = await listerClient.opportunity.list({
        orderBy: query.orderBy,
        order: query.order,
    });

    if (error || !data) {
        return {
            ok: false,
            message: error?.message ?? "Unable to load signals.",
        };
    }

    const hidden = new Set(query.hide);
    return {
        ok: true,
        signals: data.filter(
            (signal) =>
                !hidden.has(signal.buyExchange.slug) &&
                !hidden.has(signal.sellExchange.slug),
        ),
    };
}

async function loadExchanges(): Promise<ExchangeSelect[]> {
    const [error, data] = await listerClient.exchange.list({ limit: -1 });
    if (error || !data) return [];
    return data.data;
}

type Sendable = {
    readyState: number;
    send(data: unknown): unknown;
};

/**
 * Every connected board. One shared timer feeds all of them: the server fetches
 * and renders the board once per tick, then fans the identical payload out to
 * each socket. Filtering, sorting and the card/table switch all happen on the
 * client, so no per-connection state is kept here.
 */
const sockets = new Set<Sendable>();
let timer: ReturnType<typeof setInterval> | null = null;
let busy = false;

/**
 * Fetch + render once, then send the same payload to every open socket. Skips
 * entirely when nobody is connected, and while a previous push is in flight.
 */
async function broadcast() {
    if (busy || sockets.size === 0) return;
    busy = true;
    try {
        const data = await loadSignals(DEFAULT_QUERY);
        const html = <SignalBoard data={data} />;
        for (const ws of sockets) {
            if (ws.readyState === 1) ws.send(html);
        }
    } finally {
        busy = false;
    }
}

/** Run one shared interval only while at least one board is connected. */
function startTimer() {
    if (timer) return;
    timer = setInterval(() => void broadcast(), 500);
    void broadcast();
}

function stopTimer() {
    if (sockets.size === 0 && timer) {
        clearInterval(timer);
        timer = null;
    }
}

export const SignalController = new Elysia()
    .use(htmx())

    .get(
        "/signals",
        async ({ query, hx }) => {
            const [data, exchanges] = await Promise.all([
                loadSignals(query),
                loadExchanges(),
            ]);

            if (!hx.isHTMX) {
                return (
                    <BaseLayout title="arbitmage - Signals" heading="Signals">
                        <SignalPage
                            query={query}
                            data={data}
                            exchanges={exchanges}
                        />
                    </BaseLayout>
                );
            }
            return (
                <>
                    <PageHeading heading="Signals" oob />
                    <title>Signals</title>
                    <SignalPage
                        query={query}
                        data={data}
                        exchanges={exchanges}
                    />
                </>
            );
        },
        { query: signalQuerySchema },
    )

    /**
     * The only WebSocket in the UI. One shared timer broadcasts a single rendered
     * board to every connected client; the clients do their own filtering and
     * sorting, and never send anything back. The timer runs only while at least
     * one socket is open.
     */
    .ws("/signals/ws", {
        open(ws) {
            const wasEmpty = sockets.size === 0;
            sockets.add(ws);
            if (wasEmpty) startTimer();
        },
        close(ws) {
            sockets.delete(ws);
            stopTimer();
        },
    });
