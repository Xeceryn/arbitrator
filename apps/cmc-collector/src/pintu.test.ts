import { describe, expect, test } from "bun:test";

import { PINTU_EXCHANGE_CMC_ID, QuoteCurrency } from "./config";
import {
    allocatePintuSyntheticCmcId,
    buildPintuReport,
    buildPintuSnapshot,
    normalizePintuCoins,
    PINTU_SYNTHETIC_CMC_ID_RANGE,
    PINTU_SYNTHETIC_CMC_ID_START,
    resolvePintuCoins,
    type PintuCoin,
    type PintuCurrency,
    type PintuDbCoin,
    type PintuMarket,
    type PintuResolution,
    type PintuSymbolReference,
} from "./pintu";

function reference(
    overrides: Partial<PintuSymbolReference> = {},
): PintuSymbolReference {
    return {
        symbol: "BTC-IDR",
        quote_asset: "IDR",
        base_asset: "BTC",
        is_tokenized: false,
        ...overrides,
    };
}

function market(overrides: Partial<PintuMarket> = {}): PintuMarket {
    return {
        currency_group: "BTC",
        currency_symbol: "BTC",
        name: "Bitcoin",
        logo: "https://assets.pintu.co.id/btc.png",
        is_trading_enabled: true,
        is_market_visible: true,
        is_upcoming: false,
        market_detail_url: "https://pintu.co.id/market/btc",
        ...overrides,
    };
}

function currency(overrides: Partial<PintuCurrency> = {}): PintuCurrency {
    return {
        currencyGroup: "BTC",
        currencySymbol: "BTC",
        name: "Bitcoin",
        logo: "https://assets.pintu.co.id/btc.png",
        is_tokenized: false,
        category_type: "crypto",
        ...overrides,
    };
}

function pintuCoin(overrides: Partial<PintuCoin> = {}): PintuCoin {
    return {
        symbol: "BTC",
        name: "Bitcoin",
        slug: "btc",
        logo: "https://assets.pintu.co.id/btc.png",
        tradeEnabled: true,
        ...overrides,
    };
}

function dbCoin(overrides: Partial<PintuDbCoin> = {}): PintuDbCoin {
    return {
        cmcId: 1,
        symbol: "BTC",
        name: "Bitcoin",
        slug: "bitcoin",
        ...overrides,
    };
}

describe("normalizePintuCoins", () => {
    test("keeps Pro spot IDR pairs and skips tokenized stocks", () => {
        const { coins, skipped } = normalizePintuCoins(
            [
                reference(),
                reference({
                    symbol: "TSLAX-IDR",
                    base_asset: "TSLAX",
                    is_tokenized: true,
                }),
                reference({
                    symbol: "ETH-USDT",
                    quote_asset: "USDT",
                    base_asset: "ETH",
                }),
            ],
            [market()],
        );

        expect(coins.map((coin) => coin.symbol)).toEqual(["BTC"]);
        expect(skipped).toEqual([
            { symbol: "TSLAX", reason: "tokenized stock" },
            { symbol: "ETH", reason: "quote USDT" },
        ]);
    });

    test("joins the retail market list for name, logo and slug", () => {
        const { coins } = normalizePintuCoins(
            [reference()],
            [market()],
            [currency()],
        );

        expect(coins[0]).toEqual({
            symbol: "BTC",
            name: "Bitcoin",
            slug: "btc",
            logo: "https://assets.pintu.co.id/btc.png",
            tradeEnabled: true,
        });
    });

    test("falls back to the wallet catalogue, then the ticker", () => {
        const fromCurrency = normalizePintuCoins(
            [reference({ base_asset: "HYPE" })],
            [],
            [
                currency({
                    currencyGroup: "HYPE",
                    currencySymbol: "HYPE",
                    name: "Hyperliquid",
                    logo: "https://assets.pintu.co.id/hype.png",
                }),
            ],
        ).coins[0];

        expect(fromCurrency?.name).toBe("Hyperliquid");
        expect(fromCurrency?.logo).toBe("https://assets.pintu.co.id/hype.png");

        const unknown = normalizePintuCoins(
            [reference({ base_asset: "NEW" })],
            [],
            [],
        ).coins[0];

        expect(unknown).toMatchObject({
            symbol: "NEW",
            name: "NEW",
            slug: "new",
            logo: "",
        });
    });

    test("uses the MKR fallback for a Pro-only symbol", () => {
        const { coins } = normalizePintuCoins(
            [reference({ symbol: "MKR-IDR", base_asset: "MKR" })],
            [],
            [],
        );

        expect(coins[0]).toMatchObject({
            symbol: "MKR",
            name: "Maker",
            slug: "maker",
        });
        expect(coins[0]?.logo).toContain("circle_MKR.svg");
    });

    test("maps trading state and skips duplicate base assets", () => {
        const { coins, skipped } = normalizePintuCoins(
            [
                reference(),
                reference(),
                reference({ symbol: "ETH-IDR", base_asset: "ETH" }),
            ],
            [
                market({ is_trading_enabled: false }),
                market({
                    currency_group: "ETH",
                    currency_symbol: "ETH",
                    name: "Ethereum",
                    is_market_visible: false,
                }),
            ],
        );

        expect(coins).toHaveLength(2);
        expect(coins.find((coin) => coin.symbol === "BTC")?.tradeEnabled).toBe(
            false,
        );
        expect(coins.find((coin) => coin.symbol === "ETH")?.tradeEnabled).toBe(
            false,
        );
        expect(skipped).toEqual([
            { symbol: "BTC", reason: "duplicate base asset" },
        ]);
    });
});

describe("allocatePintuSyntheticCmcId", () => {
    test("is stable, in range, and skips used ids", () => {
        const first = allocatePintuSyntheticCmcId("PTU", new Set());
        const second = allocatePintuSyntheticCmcId("PTU", new Set());

        expect(first).toBe(second);
        expect(first).toBeGreaterThanOrEqual(PINTU_SYNTHETIC_CMC_ID_START);
        expect(first).toBeLessThan(
            PINTU_SYNTHETIC_CMC_ID_START + PINTU_SYNTHETIC_CMC_ID_RANGE,
        );

        const collided = allocatePintuSyntheticCmcId("PTU", new Set([first]));
        expect(collided).not.toBe(first);
    });
});

describe("resolvePintuCoins", () => {
    test("uses the single lister coin with the same ticker", () => {
        const resolution = resolvePintuCoins(
            [pintuCoin()],
            [dbCoin()],
            new Map(),
        );

        expect(resolution.resolved).toHaveLength(1);
        expect(resolution.resolved[0]).toMatchObject({
            cmcId: 1,
            source: "db",
            dbCoin: { cmcId: 1 },
        });
        expect(resolution.conflicts).toEqual([]);
        expect(resolution.synthetic).toEqual([]);
    });

    test("matches tickers case-insensitively", () => {
        const resolution = resolvePintuCoins(
            [pintuCoin({ symbol: "btc" })],
            [dbCoin({ symbol: "BTC" })],
            new Map(),
        );

        expect(resolution.resolved[0]).toMatchObject({
            cmcId: 1,
            source: "db",
        });
        expect(resolution.resolved[0]?.coin.symbol).toBe("BTC");
    });

    test("reports an ambiguous ticker instead of guessing", () => {
        const candidates = [
            dbCoin({
                cmcId: 74,
                symbol: "DOGE",
                name: "Dogecoin",
                slug: "dogecoin",
            }),
            dbCoin({
                cmcId: 32778,
                symbol: "DOGE",
                name: "Department Of Government Efficiency",
                slug: "department-of-government-efficiency-token",
            }),
        ];

        const resolution = resolvePintuCoins(
            [pintuCoin({ symbol: "DOGE", name: "Dogecoin" })],
            candidates,
            new Map(),
        );

        expect(resolution.resolved).toEqual([]);
        expect(resolution.conflicts).toEqual([{ symbol: "DOGE", candidates }]);
    });

    test("lets an explicit alias break the tie", () => {
        const candidates = [
            dbCoin({
                cmcId: 74,
                symbol: "DOGE",
                name: "Dogecoin",
                slug: "dogecoin",
            }),
            dbCoin({
                cmcId: 32778,
                symbol: "DOGE",
                name: "DOGE gov",
                slug: "doge-gov",
            }),
        ];
        const resolution = resolvePintuCoins(
            [pintuCoin({ symbol: "DOGE", name: "Dogecoin" })],
            candidates,
            new Map([["DOGE", 74]]),
        );

        expect(resolution.resolved[0]).toMatchObject({
            cmcId: 74,
            source: "alias",
        });
        expect(resolution.aliases).toEqual([
            { symbol: "DOGE", cmcId: 74, candidates },
        ]);
        expect(resolution.conflicts).toEqual([]);
    });

    test("creates a stable synthetic id for an unknown ticker", () => {
        const resolution = resolvePintuCoins(
            [pintuCoin({ symbol: "PTU", name: "Pintu Token" })],
            [dbCoin()],
            new Map(),
        );

        const entry = resolution.resolved[0]!;
        expect(entry.source).toBe("synthetic");
        expect(entry.dbCoin).toBeUndefined();
        expect(entry.cmcId).not.toBe(1);
        expect(entry.cmcId).toBeGreaterThanOrEqual(
            PINTU_SYNTHETIC_CMC_ID_START,
        );
        expect(resolution.synthetic).toEqual([entry]);

        const again = resolvePintuCoins(
            [pintuCoin({ symbol: "PTU", name: "Pintu Token" })],
            [dbCoin()],
            new Map(),
        );
        expect(again.resolved[0]?.cmcId).toBe(entry.cmcId);
    });

    test("does not let two tickers share one CMC id", () => {
        const resolution = resolvePintuCoins(
            [
                pintuCoin({ symbol: "BTC" }),
                pintuCoin({ symbol: "WBTC", name: "Wrapped Bitcoin" }),
            ],
            [dbCoin()],
            new Map([["WBTC", 1]]),
        );

        expect(resolution.resolved).toHaveLength(1);
        expect(resolution.conflicts).toHaveLength(1);
        expect(resolution.conflicts[0]?.symbol).toBe("WBTC");
    });
});

describe("buildPintuSnapshot", () => {
    test("marks the exchange unregistered and resolves only new coins", () => {
        const resolution: PintuResolution = {
            resolved: [
                {
                    coin: pintuCoin(),
                    cmcId: 1,
                    source: "db",
                    dbCoin: dbCoin(),
                },
                {
                    coin: pintuCoin({
                        symbol: "PTU",
                        name: "Pintu Token",
                        slug: "pintu-token",
                        logo: "https://assets.pintu.co.id/ptu.png",
                    }),
                    cmcId: 1_999_123,
                    source: "synthetic",
                },
            ],
            conflicts: [],
            synthetic: [],
            aliases: [],
        };

        const snapshot = buildPintuSnapshot(resolution);

        expect(snapshot.source).toBe("pintu-public");
        expect(snapshot.exchanges).toEqual([
            {
                cmcId: PINTU_EXCHANGE_CMC_ID,
                name: "Pintu",
                slug: "pintu",
                logo: "https://pintu.co.id/static/images/shared/pintu-logo.svg",
                baseCurrency: "idr",
                registeredOnCmc: false,
            },
        ]);
        expect(snapshot.markets).toEqual([
            {
                exchangeCmcId: PINTU_EXCHANGE_CMC_ID,
                exchangeSlug: "pintu",
                cryptocurrencyCmcId: 1,
                exchangeSymbol: "BTC",
                quoteCurrencyId: QuoteCurrency.IDR,
                tradeEnabled: true,
            },
            {
                exchangeCmcId: PINTU_EXCHANGE_CMC_ID,
                exchangeSlug: "pintu",
                cryptocurrencyCmcId: 1_999_123,
                exchangeSymbol: "PTU",
                quoteCurrencyId: QuoteCurrency.IDR,
                tradeEnabled: true,
            },
        ]);
        expect(snapshot.cryptocurrencies).toEqual([
            {
                cmcId: 1_999_123,
                name: "Pintu Token",
                symbol: "PTU",
                slug: "pintu-token",
                logo: "https://assets.pintu.co.id/ptu.png",
            },
        ]);
    });
});

describe("buildPintuReport", () => {
    test("summarizes aliases, conflicts, skipped and synthetic ids", () => {
        const normalized = {
            coins: [
                pintuCoin(),
                pintuCoin({ symbol: "DOGE", name: "Dogecoin" }),
                pintuCoin({ symbol: "PTU", name: "Pintu Token" }),
            ],
            skipped: [{ symbol: "TSLAX", reason: "tokenized stock" }],
        };
        const resolution: PintuResolution = {
            resolved: [
                {
                    coin: pintuCoin(),
                    cmcId: 1,
                    source: "db",
                    dbCoin: dbCoin(),
                },
                {
                    coin: pintuCoin({ symbol: "DOGE", name: "Dogecoin" }),
                    cmcId: 74,
                    source: "alias",
                    dbCoin: dbCoin({ cmcId: 74, symbol: "DOGE" }),
                },
            ],
            conflicts: [{ symbol: "MEME", candidates: [dbCoin()] }],
            synthetic: [],
            aliases: [
                {
                    symbol: "DOGE",
                    cmcId: 74,
                    candidates: [
                        dbCoin({ cmcId: 74, symbol: "DOGE" }),
                        dbCoin({ cmcId: 32778, symbol: "DOGE" }),
                    ],
                },
            ],
        };

        const report = buildPintuReport(
            normalized,
            resolution,
            new Date("2026-11-11T00:00:00Z"),
        );

        expect(report.totals).toMatchObject({
            proCoins: 4,
            resolved: 2,
            fromDb: 1,
            fromAlias: 1,
            synthetic: 0,
            conflicts: 1,
            skipped: 1,
        });
        expect(report.exchange).toMatchObject({
            slug: "pintu",
            cmcId: PINTU_EXCHANGE_CMC_ID,
        });
        expect(report.aliases).toEqual([
            {
                symbol: "DOGE",
                cmcId: 74,
                candidates: [
                    dbCoin({ cmcId: 74, symbol: "DOGE" }),
                    dbCoin({ cmcId: 32778, symbol: "DOGE" }),
                ],
            },
        ]);
    });
});
