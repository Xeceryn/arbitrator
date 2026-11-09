import { afterAll, beforeAll, beforeEach, expect, spyOn, test } from "bun:test";

import type {
    ChainSelect,
    CryptocurrencySelect,
    ExchangeSelect,
    MarketWithRelations,
} from "@arbitrator/lister/types";
import { Elysia } from "elysia";

import { AssignmentController } from "./assignment.controller";
import { ChainController } from "./chain.controller";
import { CryptocurrencyController } from "./coin.controller";
import { ExchangeController } from "./market.controller";

const timestamps = {
    createdAt: new Date("2026-11-01"),
    updatedAt: new Date("2026-11-01"),
};
const coin: CryptocurrencySelect = {
    id: 1,
    cmcId: 1,
    name: "Bitcoin",
    symbol: "btc",
    slug: "bitcoin",
    logo: "https://example.com/coin.png",
    ...timestamps,
};
const exchange: ExchangeSelect = {
    id: 2,
    cmcId: 270,
    name: "Binance",
    slug: "binance",
    logo: "https://example.com/exchange.png",
    baseCurrency: "usdt",
    registeredOnCmc: true,
    ...timestamps,
};
const chain: ChainSelect = {
    id: 3,
    name: "Bitcoin",
    code: "BTC",
    ...timestamps,
};
const market: MarketWithRelations = {
    id: 4,
    exchangeId: 2,
    cryptocurrencyId: 1,
    exchangeSymbol: "BTC",
    tradeEnabled: true,
    exchange,
    cryptocurrency: coin,
    ...timestamps,
};

const meta = {
    page: 1,
    pages: 1,
    items: 1,
    from: 1,
    to: 1,
    limit: 5,
    search: "",
    searchBy: "name",
    orderBy: "name",
    order: "asc",
    hasNextPage: false,
    hasPreviousPage: false,
};
const app = new Elysia()
    .use(CryptocurrencyController)
    .use(ExchangeController)
    .use(ChainController)
    .use(AssignmentController);
let calls: Array<{ path: string; method: string; body: unknown }> = [];
let failure: { status: number; message: string } | undefined;
let fetchMock: ReturnType<typeof spyOn<typeof globalThis, "fetch">>;

beforeAll(() => {
    const fakeFetch: typeof fetch = Object.assign(
        async (input: Parameters<typeof fetch>[0], init?: RequestInit) => {
            const url = new URL(
                input instanceof Request ? input.url : String(input),
            );
            const method = init?.method ?? "GET";
            const body =
                typeof init?.body === "string"
                    ? JSON.parse(init.body)
                    : undefined;
            calls.push({ path: url.pathname, method, body });
            if (failure && method !== "GET")
                return Response.json(
                    { message: failure.message },
                    { status: failure.status },
                );
            if (url.pathname === "/market/available-exchanges")
                return Response.json({ data: [exchange], meta });
            if (url.pathname === "/chain-link/available-chains")
                return Response.json({ data: [chain], meta });
            if (url.pathname === "/market/detailed")
                return Response.json([market]);
            if (url.pathname === "/chain-link/detailed")
                return Response.json([]);
            if (url.pathname === "/market/4") return Response.json(market);
            if (url.pathname === "/cryptocurrency/1/routes")
                return Response.json({ exchanges: [], routes: [] });
            if (url.pathname === "/market" || url.pathname === "/market/assign")
                return Response.json(market);
            if (url.pathname === "/market/unassign")
                return Response.json(market);
            if (url.pathname === "/cryptocurrency/1")
                return Response.json({
                    ...coin,
                    ...(method === "PATCH" ? body : {}),
                });
            if (url.pathname === "/exchange/2")
                return Response.json({
                    ...exchange,
                    ...(method === "PATCH" ? body : {}),
                });
            if (url.pathname === "/chain/3")
                return Response.json({
                    ...chain,
                    ...(method === "PATCH" ? body : {}),
                });
            if (url.pathname === "/chain-link/5")
                return Response.json({
                    id: 5,
                    marketId: 4,
                    chainId: 3,
                    depositEnabled: true,
                    withdrawEnabled: false,
                    ...timestamps,
                });
            throw new Error(
                `Unexpected upstream request: ${method} ${url.pathname}`,
            );
        },
        { preconnect: fetch.preconnect },
    );
    fetchMock = spyOn(globalThis, "fetch").mockImplementation(fakeFetch);
});

beforeEach(() => {
    calls = [];
    failure = undefined;
});
afterAll(() => fetchMock.mockRestore());

function request(
    path: string,
    method = "GET",
    values?: Record<string, string>,
) {
    return app.handle(
        new Request(`http://localhost${path}`, {
            method,
            headers: {
                "HX-Request": "true",
                ...(values
                    ? { "content-type": "application/x-www-form-urlencoded" }
                    : {}),
            },
            ...(values && method !== "GET" && method !== "DELETE"
                ? { body: new URLSearchParams(values) }
                : {}),
        }),
    );
}

test("coin edits validate inline without writing or announcing success", async () => {
    const response = await request("/coins/1/edit", "PATCH", {
        name: "   ",
        cmcId: "0",
    });
    expect(response.status).toBe(422);
    expect(await response.text()).toContain("Enter the coin name.");
    expect(response.headers.get("HX-Trigger")).toContain(
        '"fields":["name","cmcId"]',
    );
    expect(response.headers.get("HX-Trigger")).not.toContain("coin-updated");
    expect(calls).toHaveLength(0);
});

test("successful coin edits coerce form numbers and return only the updated row", async () => {
    const response = await request("/coins/1/edit", "PATCH", {
        name: " Bitcoin ",
        cmcId: "1",
    });
    expect(response.status).toBe(200);
    expect(calls).toEqual([
        {
            path: "/cryptocurrency/1",
            method: "PATCH",
            body: { name: "Bitcoin", cmcId: 1 },
        },
    ]);
    expect(await response.text()).toContain('id="coin-table-row-1"');
    expect(response.headers.get("HX-Trigger")).toContain("coin-updated");
});

test("duplicate values stay in the editor with a field-specific error", async () => {
    failure = { status: 409, message: "cmcId is already in use" };
    const response = await request("/coins/1/edit", "PATCH", { cmcId: "2" });
    expect(response.status).toBe(422);
    expect(await response.text()).toContain("That CMC ID is already in use");
    expect(response.headers.get("HX-Trigger")).not.toContain("coin-updated");
});

test("upstream save failures never close the editor or replace its row", async () => {
    failure = { status: 500, message: "Internal server error" };
    const response = await request("/coins/1/edit", "PATCH", {
        name: "Bitcoin",
    });
    expect(response.status).toBe(502);
    expect(response.headers.get("HX-Reswap")).toBe("none");
    expect(response.headers.get("HX-Trigger")).not.toContain("coin-updated");
    expect(await response.text()).toBe("");
});

test("exchange editing preserves an explicit false CoinMarketCap setting", async () => {
    const response = await request("/markets/2/edit", "PATCH", {
        registeredOnCmc: "false",
        cmcId: "270",
    });
    expect(response.status).toBe(200);
    expect(calls[0]?.body).toEqual({ registeredOnCmc: false, cmcId: 270 });
    expect(await response.text()).toContain('id="market-table-row-2"');
});

test("chain editing reports duplicate codes inline", async () => {
    failure = { status: 409, message: "code is already in use" };
    const response = await request("/chain/3/edit", "PATCH", { code: "BTC" });
    expect(response.status).toBe(422);
    expect(await response.text()).toContain("That code is already in use");
    expect(response.headers.get("HX-Trigger")).not.toContain("chain-updated");
});

const deletionCases: Array<[string, string, string]> = [
    ["/coins/1", "/cryptocurrency/1", "coin-deleted"],
    ["/markets/2", "/exchange/2", "exchange-deleted"],
    ["/chain/3", "/chain/3", "chain-deleted"],
];
for (const [path, upstream, event] of deletionCases) {
    test(`${path}: deletion uses the existing service operation and refreshes list state`, async () => {
        const response = await request(path, "DELETE");
        expect(response.status).toBe(200);
        expect(calls[0]).toEqual({
            path: upstream,
            method: "DELETE",
            body: undefined,
        });
        expect(await response.text()).toBe("");
        expect(response.headers.get("HX-Trigger")).toContain(event);
        expect(
            JSON.parse(response.headers.get("HX-Trigger")!)[event].target,
        ).toBe("body");
    });

    test(`${path}: a failed deletion cannot remove the row`, async () => {
        failure = { status: 500, message: "Unavailable" };
        const response = await request(path, "DELETE");
        expect(response.headers.get("HX-Reswap")).toBe("none");
        expect(response.headers.get("HX-Trigger")).not.toContain(event);
    });
}

test("opening an exchange picker immediately renders available choices", async () => {
    const response = await request("/coins/1/assignment/new");
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html).toContain("Binance");
    expect(html).toContain("assignments/select?exchangeId=2");
    expect(html).not.toContain('hx-trigger="load"');
    expect(calls).toHaveLength(1);
});

test("opening a chain picker immediately renders available choices", async () => {
    const response = await request("/coins/1/assignments/4/chains/new");
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html).toContain("Bitcoin");
    expect(html).toContain("chains/select?chainId=3");
    expect(calls).toHaveLength(1);
});

test("an exchange symbol save keeps the chain panel independent", async () => {
    const response = await request("/coins/1/assignments/4", "PATCH", {
        exchangeSymbol: " XBT ",
    });
    expect(response.status).toBe(200);
    expect(calls.find(({ method }) => method === "PATCH")?.body).toEqual({
        exchangeId: 2,
        cryptocurrencyId: 1,
        tradeEnabled: true,
        exchangeSymbol: "XBT",
    });
    const html = await response.text();
    expect(html).toContain('hx-morph-skip="true"');
    expect(response.headers.get("HX-Trigger")).toContain(
        "assignment-symbol-saved",
    );
});

test("an invalid symbol reports a field error without saving", async () => {
    const response = await request("/coins/1/assignments/4", "PATCH", {
        exchangeSymbol: " ",
    });
    expect(response.status).toBe(422);
    expect(await response.text()).toContain('aria-invalid="true"');
    expect(calls.every(({ method }) => method === "GET")).toBe(true);
});

test("a failed trade switch restores its saved value", async () => {
    failure = { status: 500, message: "Unavailable" };
    const response = await request("/coins/1/assignments/4", "PATCH", {
        tradeEnabled: "false",
    });
    expect(response.headers.get("HX-Reswap")).toBe("none");
    expect(response.headers.get("HX-Trigger")).toContain('"tradeEnabled":true');
});

test("an assignment cannot be changed through another coin's editor", async () => {
    const response = await request("/coins/9/assignments/4", "DELETE");
    expect(response.headers.get("HX-Reswap")).toBe("none");
    expect(calls.every(({ method }) => method === "GET")).toBe(true);
});

test("assignment workspaces have reloadable URLs and both navigation destinations", async () => {
    const response = await app.handle(
        new Request("http://localhost/coins/1/assignment"),
    );
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html).toContain('id="coin-workspace-identity"');
    expect(html).toContain('href="/coins/1/routes"');
    expect(html).toContain('id="coin-assignment-list"');
    expect(html).toContain('id="assign-exchange-dialog"');
    expect(html).toContain('data-open-dialog="assign-exchange-dialog"');
    expect(html).toContain('id="assign-chain-dialog-4"');
    expect(html).toContain('id="market-chain-staging-4"');
    expect(html).toContain('data-symbol-trigger="4"');
    expect(html.match(/id="coin-assignment-indicator"/g)).toHaveLength(1);
});

test("workspace editing updates its identity rather than targeting an absent table row", async () => {
    const editor = await request("/coins/1/edit-modal?view=workspace");
    expect(await editor.text()).toContain(
        'hx-target="#coin-workspace-identity"',
    );
    const response = await request("/coins/1/edit?view=workspace", "PATCH", {
        name: "New coin name",
    });
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html).toContain('id="coin-workspace-identity"');
    expect(html).toContain("New coin name");
    expect(html).not.toContain('id="coin-table-row-1"');
});

test("transfer routes are a reloadable workspace destination", async () => {
    const response = await app.handle(
        new Request("http://localhost/coins/1/routes"),
    );
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(html).toContain('aria-label="Coin workspace"');
    expect(html).toContain('href="/coins/1/assignment"');
});
