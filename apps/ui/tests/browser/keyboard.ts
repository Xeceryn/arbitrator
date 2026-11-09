import assert from "node:assert/strict";

import type {
    ChainLinkWithChain,
    ChainSelect,
    CryptocurrencySelect,
    ExchangeSelect,
    MarketWithRelations,
} from "@arbitrator/lister/types";
import { staticPlugin } from "@elysia/static";
import { Elysia } from "elysia";
import { chromium } from "playwright";

import { bundleClientSideResources } from "../../src/bundler";
import { AssignmentController } from "../../src/controllers/assignment.controller";
import { CryptocurrencyController } from "../../src/controllers/coin.controller";

// Exercise real controllers, fragments and browser events with an in-memory
// upstream. Every fetch is intercepted: these tests cannot mutate a catalog.
const timestamps = {
    createdAt: new Date("2026-11-01"),
    updatedAt: new Date("2026-11-01"),
};
const coin: CryptocurrencySelect = {
    id: 1,
    cmcId: 1,
    name: "Test Bitcoin",
    symbol: "BTC",
    slug: "test-bitcoin",
    logo: "",
    ...timestamps,
};
const exchange: ExchangeSelect = {
    id: 2,
    cmcId: 270,
    name: "Test exchange",
    slug: "test-exchange",
    logo: "",
    baseCurrency: "usdt",
    registeredOnCmc: true,
    ...timestamps,
};
const market: MarketWithRelations = {
    id: 4,
    cryptocurrencyId: 1,
    exchangeId: 2,
    exchangeSymbol: "BTC",
    tradeEnabled: true,
    cryptocurrency: coin,
    exchange,
    ...timestamps,
};
const availableExchange: ExchangeSelect = {
    ...exchange,
    id: 3,
    name: "Test second exchange",
    slug: "test-second-exchange",
};
const markets = [market];
const chain: ChainSelect = {
    id: 6,
    name: "Test Bitcoin network",
    code: "BTC",
    ...timestamps,
};
const availableChain: ChainSelect = {
    id: 7,
    name: "Test Ethereum network",
    code: "ERC20",
    ...timestamps,
};
const links: ChainLinkWithChain[] = [
    {
        id: 5,
        marketId: 4,
        chainId: 6,
        chain,
        depositEnabled: true,
        withdrawEnabled: false,
        ...timestamps,
    },
];
let rejectWrite = false;
const meta = {
    items: 1,
    pages: 1,
    page: 1,
    limit: 10,
    from: 1,
    to: 1,
    hasPreviousPage: false,
    hasNextPage: false,
    search: "",
    searchBy: "symbol",
    order: "asc",
    orderBy: "cmcId",
};

await bundleClientSideResources();
const originalFetch = globalThis.fetch;
globalThis.fetch = Object.assign(
    async (input: Parameters<typeof fetch>[0], init?: RequestInit) => {
        const url = new URL(
            input instanceof Request ? input.url : String(input),
        );
        const path = url.pathname;
        const body: Record<string, unknown> =
            typeof init?.body === "string" ? JSON.parse(init.body) : {};
        if (rejectWrite && init?.method && init.method !== "GET")
            return Response.json(
                { message: "Test upstream unavailable" },
                { status: 500 },
            );
        if (path === "/cryptocurrency")
            return Response.json({ data: [coin], meta });
        if (path === "/cryptocurrency/1") {
            if (init?.method === "PATCH" && typeof body.name === "string")
                coin.name = body.name;
            return Response.json(coin);
        }
        if (path === "/market/detailed") return Response.json(markets);
        if (path === "/market/available-exchanges") {
            const search = url.searchParams.get("search") ?? "";
            const data =
                markets.some(
                    (item) => item.exchangeId === availableExchange.id,
                ) ||
                !availableExchange.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
                    ? []
                    : [availableExchange];
            return Response.json({
                data,
                meta: { ...meta, search, items: data.length },
            });
        }
        if (path === "/exchange/3") return Response.json(availableExchange);
        if (path === "/market/assign") {
            const created = {
                ...market,
                id: 9,
                exchangeId: 3,
                exchange: availableExchange,
                exchangeSymbol: String(body.exchangeSymbol ?? coin.symbol),
                tradeEnabled: body.tradeEnabled === true,
            };
            markets.push(created);
            return Response.json(created);
        }
        if (path === "/market/4") return Response.json(market);
        if (path === "/market" && init?.method === "PATCH") {
            if (typeof body.exchangeSymbol === "string")
                market.exchangeSymbol = body.exchangeSymbol;
            return Response.json(market);
        }
        if (path === "/chain-link/detailed")
            return Response.json(
                links.filter(
                    (link) =>
                        link.marketId ===
                        Number(url.searchParams.get("marketId")),
                ),
            );
        if (path === "/chain-link/available-chains") {
            const search = url.searchParams.get("search") ?? "";
            const data =
                links.some((link) => link.chainId === availableChain.id) ||
                !availableChain.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
                    ? []
                    : [availableChain];
            return Response.json({
                data,
                meta: { ...meta, search, items: data.length },
            });
        }
        if (path === "/chain/7") return Response.json(availableChain);
        if (path === "/chain-link" && init?.method === "POST") {
            const created = {
                id: 8,
                chainId: 7,
                chain: availableChain,
                marketId: 4,
                depositEnabled: true,
                withdrawEnabled: true,
                ...timestamps,
            };
            links.push(created);
            return Response.json(created);
        }
        if (path === "/chain-link/5" && init?.method === "PATCH") {
            const link = links.find((item) => item.id === 5)!;
            if (typeof body.depositEnabled === "boolean")
                link.depositEnabled = body.depositEnabled;
            if (typeof body.withdrawEnabled === "boolean")
                link.withdrawEnabled = body.withdrawEnabled;
            return Response.json(link);
        }
        throw new Error(`Unexpected browser-test upstream request: ${path}`);
    },
    { preconnect: originalFetch.preconnect },
);

const app = new Elysia()
    .onBeforeHandle(({ request, set }) => {
        if (!new URL(request.url).pathname.startsWith("/public/"))
            set.headers["content-type"] = "text/html; charset=utf-8";
    })
    .use(staticPlugin({ prefix: "/public", assets: "./public" }))
    .use(CryptocurrencyController)
    .use(AssignmentController)
    .listen({ hostname: "127.0.0.1", port: 0 });
const executableArg = Bun.argv.indexOf("--executable-path");
const executablePath =
    executableArg === -1 ? undefined : Bun.argv[executableArg + 1];
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;

try {
    browser = await chromium.launch({
        executablePath,
        headless: true,
        args: ["--no-sandbox"],
    });
    const page = await browser.newPage({
        viewport: { width: 1440, height: 1000 },
        reducedMotion: "reduce",
    });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.setDefaultTimeout(10000);
    await page.goto(`http://127.0.0.1:${app.server!.port}/coins`);
    await page
        .getByRole("button", { name: "Edit Test Bitcoin", exact: true })
        .click();
    await page
        .locator("#cryptocurrency_edit_modal input[name=name]")
        .fill("Renamed Bitcoin");
    await page
        .locator("#cryptocurrency_edit_modal input[name=name]")
        .press("Enter");
    await page
        .locator("#cryptocurrency_edit_modal")
        .waitFor({ state: "hidden" });
    await page.waitForFunction(
        () =>
            document.activeElement?.getAttribute("aria-label") ===
            "Edit Renamed Bitcoin",
    );
    assert.equal(coin.name, "Renamed Bitcoin");

    await page
        .getByRole("link", {
            name: "Manage assignments for Renamed Bitcoin",
            exact: true,
        })
        .click();
    await page.getByRole("button", { name: "Edit coin", exact: true }).click();
    await page
        .locator("#cryptocurrency_edit_modal input[name=name]")
        .fill("Workspace Bitcoin");
    await page
        .getByRole("button", { name: "Save changes", exact: true })
        .click();
    await page
        .locator("#cryptocurrency_edit_modal")
        .waitFor({ state: "hidden" });
    await page.waitForFunction(
        () =>
            document.activeElement?.getAttribute("hx-get") ===
            "/coins/1/edit-modal?view=workspace",
    );
    assert.equal(coin.name, "Workspace Bitcoin");

    for (const width of [1440, 390]) {
        await page.setViewportSize({ width, height: 1000 });
        const openSymbol = async () => {
            await page
                .getByRole("button", {
                    name: "Edit exchange symbol for Test exchange",
                    exact: true,
                })
                .click();
        };
        const focusedSymbolControl = () =>
            page.waitForFunction(
                () => document.activeElement?.id === "edit-symbol-button-4",
            );

        await openSymbol();
        await page.locator("#exchange-symbol-4").fill("Discard me");
        await page
            .locator("#symbol-editor-4")
            .getByRole("button", { name: "Cancel", exact: true })
            .click();
        await focusedSymbolControl();
        assert.notEqual(market.exchangeSymbol, "Discard me");

        await openSymbol();
        await page.locator("#exchange-symbol-4").press("Escape");
        await focusedSymbolControl();
        assert.equal(await page.locator("#symbol-editor-4").isVisible(), false);

        await openSymbol();
        await page.locator("#exchange-symbol-4").fill(`BTC${width}`);
        await page
            .getByRole("button", { name: "Save symbol", exact: true })
            .focus();
        await page.keyboard.press("Enter");
        await page.locator("#symbol-editor-4").waitFor({ state: "hidden" });
        await focusedSymbolControl();
        assert.equal(market.exchangeSymbol, `BTC${width}`);
    }

    for (const width of [1440, 390, 320]) {
        await page.setViewportSize({ width, height: 900 });
        const exchangeDialog = page.locator("#assign-exchange-dialog");
        await page
            .getByRole("button", { name: "Assign exchange", exact: true })
            .click();
        await exchangeDialog
            .getByRole("button", {
                name: "Select Test second exchange",
                exact: true,
            })
            .waitFor();
        await page.waitForFunction(
            () => document.activeElement?.id === "exchange-search",
        );
        assert.equal(
            await page
                .locator("#add-exchange-button")
                .getAttribute("aria-expanded"),
            "true",
        );
        // Native dialogs can visit browser chrome, but never background controls.
        for (let tab = 0; tab < 8; tab++) {
            await page.keyboard.press("Shift+Tab");
            assert.equal(
                await exchangeDialog.evaluate(
                    (dialog) =>
                        dialog.contains(document.activeElement) ||
                        document.activeElement === document.body,
                ),
                true,
            );
        }
        await page.locator("#exchange-search").focus();
        await page.keyboard.press("Escape");
        await page.waitForFunction(
            () =>
                document.activeElement?.id === "add-exchange-button" &&
                document.activeElement.getAttribute("aria-expanded") ===
                    "false",
        );
        assert.equal(
            await page
                .locator("#add-exchange-button")
                .getAttribute("aria-expanded"),
            "false",
        );

        await page.locator("#expand-chains-button-4").click();
        await page.locator("#add-chain-button-4").waitFor();
        await page.locator("#add-chain-button-4").click();
        const chainDialog = page.locator("#assign-chain-dialog-4");
        await chainDialog
            .getByRole("button", {
                name: "Select Test Ethereum network",
                exact: true,
            })
            .waitFor();
        await page.waitForFunction(
            () => document.activeElement?.id === "chain-search-4",
        );
        await chainDialog
            .getByRole("button", { name: "Cancel", exact: true })
            .click();
        await page.waitForFunction(
            () =>
                document.activeElement?.id === "add-chain-button-4" &&
                document.activeElement.getAttribute("aria-expanded") ===
                    "false",
        );
        assert.equal(
            await page
                .locator("#add-chain-button-4")
                .getAttribute("aria-expanded"),
            "false",
        );
        assert.equal(
            await page.evaluate(
                () => document.documentElement.scrollWidth <= innerWidth,
            ),
            true,
        );
        const panel = page.locator("#market-chains-row-4 section");
        assert.equal(
            await panel.evaluate(
                (element) => element.scrollWidth <= element.clientWidth,
            ),
            true,
        );
        await page.locator("#expand-chains-button-4").click();
    }

    await page.locator("#add-exchange-button").click();
    await page.waitForFunction(
        () => document.activeElement?.id === "exchange-search",
    );
    const searchResponse = page.waitForResponse(
        (response) =>
            new URL(response.url()).pathname === "/coins/1/available-exchanges",
    );
    await page.locator("#exchange-search").fill("no matching exchange");
    assert.equal(
        new URL((await searchResponse).url()).searchParams.get("search"),
        "no matching exchange",
    );
    await page
        .locator("#available-exchanges")
        .getByText("No exchanges match", { exact: false })
        .waitFor();
    await page
        .getByRole("button", { name: "Clear search", exact: true })
        .click();
    await page
        .getByRole("button", {
            name: "Select Test second exchange",
            exact: true,
        })
        .click();
    await page.waitForFunction(
        () => document.activeElement?.id === "exchange-symbol-input",
    );
    await page.locator("#exchange-symbol-input").fill("TESTBTC");
    rejectWrite = true;
    await page
        .getByRole("button", { name: "Add exchange", exact: true })
        .click();
    await page
        .locator("#toast-container")
        .getByText("Unable to assign the exchange. Try again.", { exact: true })
        .waitFor();
    assert.equal(
        await page.locator("#assign-exchange-dialog").isVisible(),
        true,
    );
    assert.equal(
        await page.locator("#exchange-symbol-input").inputValue(),
        "TESTBTC",
    );
    rejectWrite = false;
    await page
        .getByRole("button", { name: "Add exchange", exact: true })
        .click();
    await page.locator("#assign-exchange-dialog").waitFor({ state: "hidden" });
    await page.locator("#market-card-9").waitFor();
    await page.waitForFunction(
        () => document.activeElement?.id === "add-exchange-button",
    );
    assert.equal(markets[1]?.exchangeSymbol, "TESTBTC");

    await page.locator("#expand-chains-button-4").click();
    await page.locator("#add-chain-button-4").click();
    await page.locator("#chain-search-4").fill("no matching chain");
    await page
        .locator("#available-chains-4")
        .getByText("No chains match", { exact: false })
        .waitFor();
    await page
        .getByRole("button", { name: "Clear search", exact: true })
        .click();
    await page
        .getByRole("button", {
            name: "Select Test Ethereum network",
            exact: true,
        })
        .click();
    rejectWrite = true;
    await page
        .locator("#assign-chain-dialog-4")
        .getByRole("button", { name: "Add chain", exact: true })
        .click();
    await page
        .locator("#toast-container")
        .getByText("Unable to assign the chain. Try again.", { exact: true })
        .waitFor();
    assert.equal(
        await page.locator("#assign-chain-dialog-4").isVisible(),
        true,
    );
    rejectWrite = false;
    await page
        .locator("#assign-chain-dialog-4")
        .getByRole("button", { name: "Add chain", exact: true })
        .click();
    await page.locator("#assign-chain-dialog-4").waitFor({ state: "hidden" });
    await page.locator("#chain-link-8").waitFor();
    await page.waitForFunction(
        () => document.activeElement?.id === "add-chain-button-4",
    );
    const deposit = page.getByRole("switch", {
        name: "Deposits on Test Bitcoin network",
        exact: true,
    });
    await deposit.uncheck();
    await page.waitForFunction(
        () =>
            document.querySelector<HTMLInputElement>(
                '[aria-label="Deposits on Test Bitcoin network"]',
            )?.disabled === false,
    );
    assert.equal(links[0]?.depositEnabled, false);
    rejectWrite = true;
    await deposit.check();
    await page.waitForFunction(
        () =>
            document.querySelector<HTMLInputElement>(
                '[aria-label="Deposits on Test Bitcoin network"]',
            )?.checked === false,
    );
    rejectWrite = false;

    // A symbol save must retain the expanded chain list and the new chain.
    await page
        .getByRole("button", {
            name: "Edit exchange symbol for Test exchange",
            exact: true,
        })
        .click();
    await page.locator("#exchange-symbol-4").fill("CHAINSAFE");
    await page
        .getByRole("button", { name: "Save symbol", exact: true })
        .click();
    await page.locator("#symbol-editor-4").waitFor({ state: "hidden" });
    assert.equal(await page.locator("#chain-link-8").isVisible(), true);
    assert.equal(
        await page
            .locator("#expand-chains-button-4")
            .getAttribute("aria-expanded"),
        "true",
    );

    await page.getByRole("link", { name: "All coins", exact: true }).click();
    await page
        .getByRole("button", {
            name: "More actions for Workspace Bitcoin",
            exact: true,
        })
        .click();
    await page
        .getByRole("button", { name: "Edit Workspace Bitcoin", exact: true })
        .click();
    await page
        .locator("#cryptocurrency_edit_modal input[name=name]")
        .fill("Mobile Bitcoin");
    await page
        .getByRole("button", { name: "Save changes", exact: true })
        .click();
    await page
        .locator("#cryptocurrency_edit_modal")
        .waitFor({ state: "hidden" });
    await page.waitForFunction(
        () =>
            document.activeElement?.getAttribute("popovertarget") ===
            "coin-actions-1",
    );
    assert.equal(coin.name, "Mobile Bitcoin");
    assert.deepEqual(errors, []);
    console.log(
        "Browser regressions passed: metadata focus, direct symbol Save/Cancel/Escape, protected-focus assignment dialogs at 1440/390/320px, picker search, failed/successful assignments, toggle rollback, and chain preservation.",
    );
} finally {
    await browser?.close();
    await app.stop(true);
    globalThis.fetch = originalFetch;
}
