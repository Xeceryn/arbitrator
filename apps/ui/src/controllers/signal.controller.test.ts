import { afterAll, beforeAll, expect, spyOn, test } from "bun:test";

import type { OpportunitySignal } from "@arbitrator/lister/types";
import { Elysia } from "elysia";
import { websocket } from "elysia/websocket";

import { SignalController } from "./signal.controller";

function signal(cmcId: number, sellExchangeId = 2): OpportunitySignal {
    return {
        id: cmcId,
        cmcId,
        buyExchangeId: 1,
        sellExchangeId,
        buyExchangeSymbol: `COIN${cmcId}`,
        sellExchangeSymbol: `COIN${cmcId}`,
        buyPrice: 10,
        sellPrice: 11,
        buyVolume: 100,
        sellVolume: 100,
        profitPercentage: 10,
        profitVolume: 100,
        buyExchange: {
            id: 1,
            name: "Buy exchange",
            slug: "buy",
            logo: "",
            baseCurrency: "usdt",
        },
        sellExchange: {
            id: sellExchangeId,
            name: "Sell exchange",
            slug: `sell-${sellExchangeId}`,
            logo: "",
            baseCurrency: "usdt",
        },
        coin: {
            cmcId,
            name: `Coin ${cmcId}`,
            symbol: `COIN${cmcId}`,
            logo: "",
        },
    };
}

let signals = [signal(1)];
const app = new Elysia().use(websocket()).use(SignalController);
let fetchMock: ReturnType<typeof spyOn<typeof globalThis, "fetch">>;

beforeAll(() => {
    // Exercise the real Eden read and WebSocket handler without live infra.
    const fakeFetch: typeof fetch = Object.assign(
        async (input: Parameters<typeof fetch>[0]) => {
            const url = new URL(
                input instanceof Request ? input.url : String(input),
            );
            if (url.pathname === "/opportunity") return Response.json(signals);
            if (url.pathname === "/exchange")
                return Response.json({ data: [] });
            throw new Error(`Unexpected test request: ${url.pathname}`);
        },
        { preconnect: fetch.preconnect },
    );
    fetchMock = spyOn(globalThis, "fetch").mockImplementation(fakeFetch);
    return new Promise<void>((resolve) => {
        app.listen({ hostname: "127.0.0.1", port: 0 }, () => resolve());
    });
});

afterAll(async () => {
    await app.stop(true);
    fetchMock.mockRestore();
});

/** Buffer pushes, including the initial snapshot sent immediately on open. */
function connect() {
    const ws = new WebSocket(
        `ws://127.0.0.1:${app.server!.port}/signals/ws?orderBy=profitPercentage`,
    );
    const messages: string[] = [];
    let notify: (() => void) | undefined;
    ws.addEventListener("message", (event) => {
        messages.push(String(event.data));
        notify?.();
    });

    return {
        ws,
        async next(): Promise<string> {
            if (messages.length === 0) {
                await new Promise<void>((resolve, reject) => {
                    const timer = setTimeout(
                        () =>
                            reject(
                                new Error("Timed out waiting for signal push"),
                            ),
                        2000,
                    );
                    notify = () => {
                        clearTimeout(timer);
                        notify = undefined;
                        resolve();
                    };
                });
            }
            return messages.shift()!;
        },
        async close() {
            if (ws.readyState === WebSocket.CLOSED) return;
            const closed = new Promise<void>((resolve) => {
                ws.addEventListener("close", () => resolve(), { once: true });
            });
            ws.close();
            await closed;
        },
    };
}

test("live updates insert newly profitable signals without reloading", async () => {
    signals = [signal(1)];
    const client = connect();
    try {
        const snapshot = await client.next();
        expect(snapshot).toContain('id="signal-list"');
        expect(snapshot).toContain('id="signal-card-1-1-2"');
        expect(snapshot).not.toContain('id="signal-card-2-1-3"');

        // A newly started exchange supplies a new profitable leg while the
        // board is already non-empty. The new card has no DOM target yet.
        signals = [signal(1), signal(2, 3)];
        const push = await client.next();
        expect(push).toContain('id="signal-card-2-1-3"');
        expect(push).toContain('hx-target="#signal-list" hx-swap="beforeend"');
        expect(push).not.toContain(
            'hx-target="#signal-card-2-1-3" hx-swap="outerMorph"',
        );

        // Normal market updates can also make a previously absent coin enter.
        signals = [...signals, signal(3)];
        const addition = await client.next();
        expect(addition).toContain('id="signal-card-3-1-2"');
        expect(addition).toContain(
            'hx-target="#signal-list" hx-swap="beforeend"',
        );
        expect(addition).not.toContain('hx-target="#signal-board"');

        // Existing cards still morph individually; unchanged ones stay put.
        signals = signals.map((value) =>
            value.cmcId === 1 ? { ...value, buyPrice: 9 } : value,
        );
        const update = await client.next();
        expect(update).toContain(
            'hx-target="#signal-card-1-1-2" hx-swap="outerMorph"',
        );
        expect(update).not.toContain('id="signal-card-2-1-3"');
        expect(update).not.toContain('id="signal-card-3-1-2"');

        // Top-60 turnover: one card enters while another leaves, with no
        // empty/non-empty transition to force a full board replacement.
        signals = [signal(3), signal(4)];
        const turnover = await client.next();
        expect(turnover).toContain('id="signal-card-4-1-2"');
        expect(turnover).toContain(
            'hx-target="#signal-list" hx-swap="beforeend"',
        );
        expect(turnover).toContain(
            'hx-target="#signal-card-1-1-2" hx-swap="delete"',
        );
        expect(turnover).toContain(
            'hx-target="#signal-card-2-1-3" hx-swap="delete"',
        );
        expect(turnover).not.toContain('hx-target="#signal-board"');

        signals = [];
        const empty = await client.next();
        expect(empty).toContain(
            'hx-target="#signal-board" hx-swap="innerHTML"',
        );
        expect(empty).toContain("No profitable signals");
        expect(empty).not.toContain('id="signal-list"');

        signals = [signal(5)];
        const repopulated = await client.next();
        expect(repopulated).toContain(
            'hx-target="#signal-board" hx-swap="innerHTML"',
        );
        expect(repopulated).toContain('id="signal-list"');
        expect(repopulated).toContain('id="signal-card-5-1-2"');
    } finally {
        await client.close();
    }
}, 10000);

test("joining, reconnecting and switching streams resync the full board", async () => {
    signals = [signal(5)];
    const first = connect();
    try {
        const snapshot = await first.next();
        expect(snapshot).toContain(
            'hx-target="#signal-board" hx-swap="innerHTML"',
        );
        expect(snapshot).toContain('id="signal-card-5-1-2"');

        const second = connect();
        try {
            expect(await second.next()).toBe(snapshot);
        } finally {
            await second.close();
        }

        first.ws.send(JSON.stringify({ orderBy: "profitVolume" }));
        expect(await first.next()).toBe(snapshot);
        first.ws.send(JSON.stringify({ orderBy: "profitPercentage" }));
        expect(await first.next()).toBe(snapshot);
    } finally {
        await first.close();
    }
});
