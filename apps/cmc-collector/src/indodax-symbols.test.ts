import { describe, expect, test } from "bun:test";

import {
    indodaxSubscriptionPairId,
    type IndodaxPair,
    normalizeIndodaxPairs,
} from "./indodax";
import {
    buildIndodaxSubscriptionTable,
    renderIndodaxSymbolsModule,
} from "./indodax-symbols";

function pair(overrides: Partial<IndodaxPair>): IndodaxPair {
    return {
        id: "btcidr",
        symbol: "BTCIDR",
        base_currency: "idr",
        traded_currency: "btc",
        traded_currency_unit: "BTC",
        cmc_id: 1,
        ...overrides,
    };
}

describe("indodaxSubscriptionPairId", () => {
    test("prefers old_ticker_id for renamed markets", () => {
        const aave = pair({
            id: "aaveidr",
            traded_currency: "aave",
            traded_currency_unit: "AAVE",
            old_ticker_id: "lend_idr",
            cmc_id: 7278,
        });

        expect(indodaxSubscriptionPairId(aave)).toBe("lendidr");
    });

    test("falls back to the current id", () => {
        expect(indodaxSubscriptionPairId(pair({}))).toBe("btcidr");
    });

    test("falls back to <traded>idr when id is missing", () => {
        const missingId = pair({ id: "", traded_currency: "eth" });
        expect(indodaxSubscriptionPairId(missingId)).toBe("ethidr");
    });
});

describe("buildIndodaxSubscriptionTable", () => {
    test("keys by canonical CMC id and keeps IDR pairs only", () => {
        const table = buildIndodaxSubscriptionTable([
            pair({}),
            pair({
                id: "aaveidr",
                traded_currency: "aave",
                traded_currency_unit: "AAVE",
                old_ticker_id: "lend_idr",
                cmc_id: 7278,
            }),
            pair({
                id: "bttusdt",
                symbol: "BTTUSDT",
                base_currency: "usdt",
                traded_currency: "btt",
                traded_currency_unit: "BTT",
                cmc_id: 16086,
            }),
            pair({
                id: "polidr",
                traded_currency: "pol",
                traded_currency_unit: "POL",
                cmc_id: 28321,
            }),
        ]);

        expect([...table]).toEqual([
            [1, "btcidr"],
            [7278, "lendidr"],
            [28321, "polidr"],
        ]);
    });

    test("folds the MATIC alias onto POL", () => {
        const table = buildIndodaxSubscriptionTable([
            pair({
                id: "polidr",
                traded_currency: "pol",
                traded_currency_unit: "POL",
                cmc_id: 3890,
            }),
        ]);

        expect([...table]).toEqual([[28321, "polidr"]]);
    });
});

describe("renderIndodaxSymbolsModule", () => {
    test("renders a sorted, typed table", () => {
        const rendered = renderIndodaxSymbolsModule(
            new Map([
                [7278, "lendidr"],
                [1, "btcidr"],
            ]),
            new Date("2026-11-03T00:00:00Z"),
        );

        expect(rendered).toContain("on 2026-11-03");
        expect(rendered).toContain('    1: "btcidr",\n    7278: "lendidr",');
        expect(rendered).toContain(
            "export const INDODAX_SUBSCRIBE_PAIR_ID_BY_CMC_ID",
        );
    });

    test("normalizes pairs the same way the importer does", () => {
        const { coins } = normalizeIndodaxPairs([
            pair({ old_ticker_id: "lend_idr", traded_currency: "aave" }),
        ]);

        expect(coins[0]?.subscribeSymbol).toBe("lendidr");
    });
});
