import { describe, expect, test } from "bun:test";

import { resolveChain } from "./chains";

/**
 * Guards the deterministic chain normalization. The bug that motivated these
 * cases: treating every distinct exchange label as a new chain fragmented one
 * network into many (9 separate Bitcoin chains).
 */
describe("resolveChain", () => {
    test("folds Bitcoin spellings onto one BTC chain", () => {
        for (const label of [
            "BTC",
            "BTC-Segwit",
            "SEGWITBTC",
            "BTCBRC",
            "BTCRUNES",
            "BTCTAP",
            "ORDIBTC",
        ]) {
            expect(resolveChain(label).code).toBe("BTC");
        }
    });

    test("does not fold genuinely distinct Bitcoin-adjacent chains", () => {
        for (const label of ["RBTC", "LBTC", "MERLBTC", "SOVRBTC", "BTRBTC"]) {
            expect(resolveChain(label).canonical).toBe(false);
        }
    });

    test("strips network qualifiers", () => {
        const cases: Array<[string, string]> = [
            ["LINEAETH", "LINEA"],
            ["SCROLLETH", "SCROLL"],
            ["MANTAETH", "MANTA"],
            ["BLASTETH", "BLAST"],
            ["STRKETH", "STARKNET"],
            ["ZKLETH", "ZKL"],
            ["KAVAEVM", "KAVA"],
            ["XTZEVM", "XTZ"],
            ["ZILEVM", "ZIL"],
            ["ZILLIQA 2", "ZIL"],
            ["HYPEEVM", "HYPE"],
            ["FILEVM", "FIL"],
            ["XDB CHAIN", "XDC"],
            ["Kava EVM Co-Chain", "KAVA"],
            ["LIGHTNING_NETWORK", "LIGHTNING"],
            ["ZETACHAIN", "ZETA"],
            ["AB Core", "ABCORE"],
        ];
        for (const [label, expected] of cases) {
            expect(resolveChain(label).code).toBe(expected);
        }
    });

    test("keeps chains that merely resemble another", () => {
        const distinct = [
            "OPBNB", // not Optimism
            "ARBNOVA", // not Arbitrum One
            "ETHW", // not Ethereum
            "MEGAETH",
            "FRAXTAL", // not FRAX
            "MOVEMENT", // not MOVE
        ];
        for (const label of distinct) {
            expect(resolveChain(label).canonical).toBe(false);
            expect(resolveChain(label).code).toBe(label.toUpperCase());
        }
    });

    test("uses the adapter hint and falls back to UNMPD", () => {
        expect(resolveChain("BEP20(BSC)", "bsc").code).toBe("BSC");
        expect(resolveChain("ERC20").code).toBe("ETH");
        expect(resolveChain("").code).toBe("UNMPD");
    });

    test("no-canonicalize keeps the raw label", () => {
        expect(resolveChain("BTC-Segwit", undefined, false).code).toBe(
            "BTC_SEGWIT",
        );
    });
});
