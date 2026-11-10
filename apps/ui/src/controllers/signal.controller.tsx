import type {
    ExchangeSelect,
    OpportunitySignal,
} from "@arbitrator/lister/types";
import { lister } from "@arbitrator/sdk";
import { Elysia, t } from "elysia";

import { BaseLayout } from "../helpers/BaseLayout";
import { htmx } from "../plugins/htmx";
import { apiErrorMessage, toStringArray } from "../utils";
import { PageHeading } from "../views/components/PageHeading";
import { SignalCard } from "../views/components/SignalCard";
import {
    SignalBoard,
    SignalPage,
    parseRoutes,
    type SignalQuery,
    type SignalsData,
} from "../views/pages/SignalPage";

const ORDER_BY_VALUES = ["profitPercentage", "profitVolume"] as const;
type OrderBy = (typeof ORDER_BY_VALUES)[number];

/** `orderBy` picks the stream; it defaults to the profit-percentage board. */
const orderBySchema = t.Union(
    [t.Literal("profitPercentage"), t.Literal("profitVolume")],
    { default: "profitPercentage" },
);

/**
 * `hide` arrives as a repeated query param (`hide=a&hide=b`), a single value, or
 * nothing. The handler normalises all three to a string array with
 * `toStringArray`.
 */
const signalQuerySchema = t.Object({
    orderBy: orderBySchema,
    hide: t.Optional(t.Union([t.String(), t.Array(t.String())])),
    /** Route keys are validated leniently in `parseRoutes`, not by TypeBox. */
    route: t.Optional(t.Union([t.String(), t.Array(t.String())])),
});

/** The same `orderBy` choice, but for the socket's subscription query. */
const streamQuerySchema = t.Object({ orderBy: orderBySchema });

/** Profitable signals for one stream, always ranked descending. */
async function loadSignals(orderBy: OrderBy): Promise<SignalsData> {
    const { data, error } = await lister.opportunity.get({
        query: { orderBy, order: "desc" },
    });

    if (error || !data) {
        return {
            ok: false,
            message: apiErrorMessage(error) ?? "Unable to load signals.",
        };
    }

    return { ok: true, signals: data };
}

async function loadExchanges(): Promise<ExchangeSelect[]> {
    const { data, error } = await lister.exchange.get({
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
    if (error || !data) return [];
    return data.data;
}

type Sendable = {
    id: string;
    readyState: number;
    send(data: unknown): unknown;
};

/**
 * One stream per `orderBy`. A room only runs while it has subscribers, and the
 * server diffs each tick against the cards it last sent, so a steady board
 * costs a handful of card swaps instead of the whole 60-card board.
 */
type Room = {
    sockets: Set<Sendable>;
    /** Last payload sent for each card, keyed by its DOM id. */
    cards: Map<string, string>;
    /** Latest signals, so a socket that joins mid-stream can be resynced. */
    signals: OpportunitySignal[];
    /** Whether any board has been sent for this room yet. */
    rendered: boolean;
    busy: boolean;
};

const rooms: Record<OrderBy, Room> = {
    profitPercentage: {
        sockets: new Set(),
        cards: new Map(),
        signals: [],
        rendered: false,
        busy: false,
    },
    profitVolume: {
        sockets: new Set(),
        cards: new Map(),
        signals: [],
        rendered: false,
        busy: false,
    },
};

/** Which room each connected socket currently subscribes to, by socket id. */
const subscription = new Map<string, OrderBy>();

function cardId(signal: OpportunitySignal): string {
    return `signal-card-${signal.cmcId}-${signal.buyExchange.id}-${signal.sellExchange.id}`;
}

function renderCard(signal: OpportunitySignal): string {
    return String(<SignalCard signal={signal} />);
}

/**
 * Replace the whole board. Used on the first push and whenever membership
 * flips between empty and non-empty, where an in-place card swap would leave a
 * stale grid or a stale empty state behind.
 */
function fullBoard(signals: OpportunitySignal[]): string {
    return `<hx-partial hx-target="#signal-board" hx-swap="innerHTML">${String(
        <SignalBoard data={{ ok: true, signals }} />,
    )}</hx-partial>`;
}

/**
 * Fetch one stream, send only what changed, and remember the new state.
 * Unchanged cards are never serialized to the wire and never touch the DOM.
 */
async function refreshRoom(orderBy: OrderBy) {
    const room = rooms[orderBy];
    if (room.busy || room.sockets.size === 0) return;
    room.busy = true;

    try {
        const data = await loadSignals(orderBy);
        // Keep the last good board on a transient error rather than blanking it.
        if (!data.ok) return;

        const { signals } = data;
        room.signals = signals;

        const cards = new Map(
            signals.map((signal) => [cardId(signal), renderCard(signal)]),
        );

        const tasks: string[] = [];
        const membershipFlipped =
            (cards.size === 0) !== (room.cards.size === 0);

        if (!room.rendered || membershipFlipped) {
            tasks.push(fullBoard(signals));
        } else {
            for (const [id, html] of cards) {
                if (!room.cards.has(id)) {
                    // A new leg has no card to morph yet. Insert it into the
                    // existing grid; the client reapplies hide/sort after swap.
                    tasks.push(
                        `<hx-partial hx-target="#signal-list" hx-swap="beforeend">${html}</hx-partial>`,
                    );
                } else if (room.cards.get(id) !== html) {
                    tasks.push(
                        `<hx-partial hx-target="#${id}" hx-swap="outerMorph">${html}</hx-partial>`,
                    );
                }
            }
            for (const id of room.cards.keys()) {
                if (!cards.has(id)) {
                    tasks.push(
                        `<hx-partial hx-target="#${id}" hx-swap="delete"></hx-partial>`,
                    );
                }
            }
        }

        room.cards = cards;
        room.rendered = true;

        if (tasks.length > 0) {
            const payload = tasks.join("");
            for (const ws of room.sockets) {
                if (ws.readyState === 1) ws.send(payload);
            }
        }
    } finally {
        room.busy = false;
    }
}

let timer: ReturnType<typeof setInterval> | null = null;

function broadcast() {
    for (const orderBy of ORDER_BY_VALUES) {
        if (rooms[orderBy].sockets.size > 0) void refreshRoom(orderBy);
    }
}

/** Run one shared interval only while at least one room has subscribers. */
function startTimer() {
    if (timer) return;
    timer = setInterval(broadcast, 500);
    broadcast();
}

function stopTimer() {
    if (
        timer &&
        ORDER_BY_VALUES.every((orderBy) => rooms[orderBy].sockets.size === 0)
    ) {
        clearInterval(timer);
        timer = null;
    }
}

export const SignalController = new Elysia({
    name: "signal",
    tags: ["signals"],
})
    .use(htmx())

    .get("/signals", { query: signalQuerySchema }, async ({ query, hx }) => {
        // `hide` is a repeated query param, a single value, or nothing.
        const filters: SignalQuery = {
            orderBy: query.orderBy,
            hide: toStringArray(query.hide),
            routes: parseRoutes(toStringArray(query.route)),
        };

        const [data, exchanges] = await Promise.all([
            loadSignals(filters.orderBy),
            loadExchanges(),
        ]);

        if (!hx.isHTMX) {
            return (
                <BaseLayout title="Arbitrator - Signals" heading="Signals">
                    <SignalPage
                        query={filters}
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
                <SignalPage query={filters} data={data} exchanges={exchanges} />
            </>
        );
    })

    /**
     * The only WebSocket in the UI. Each socket subscribes to one of two rooms
     * (`profitPercentage` / `profitVolume`) chosen by the `orderBy` query, and
     * `hx-ws:send` moves it between rooms when the select changes. One shared
     * timer refreshes each active room once and fans the identical card diffs
     * out to that room's sockets; clients keep doing their own hide/sort.
     */
    .ws("/signals/ws", {
        query: streamQuerySchema,
        open(ws) {
            const { orderBy } = ws.query;
            rooms[orderBy].sockets.add(ws);
            subscription.set(ws.id, orderBy);
            startTimer();

            // Resync this socket: the HTTP render may be stale, or may have
            // come from the other stream if the user just switched.
            const room = rooms[orderBy];
            if (room.rendered) {
                ws.send(fullBoard(room.signals));
            } else {
                void refreshRoom(orderBy);
            }
        },
        message(ws, message) {
            const orderBy = (message as { orderBy?: unknown } | null)?.orderBy;
            if (orderBy !== "profitPercentage" && orderBy !== "profitVolume") {
                return;
            }

            const current = subscription.get(ws.id);
            if (current === orderBy) return;
            if (current) rooms[current].sockets.delete(ws);

            const room = rooms[orderBy];
            room.sockets.add(ws);
            subscription.set(ws.id, orderBy);
            startTimer();

            if (room.rendered) {
                ws.send(fullBoard(room.signals));
            } else {
                void refreshRoom(orderBy);
            }
        },
        close(ws) {
            const orderBy = subscription.get(ws.id);
            if (orderBy) rooms[orderBy].sockets.delete(ws);
            subscription.delete(ws.id);
            stopTimer();
        },
    });
