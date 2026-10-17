/**
 * Indodax chain metadata.
 *
 * Indodax's public API (`/api/pairs`) lists tradable coins but never their
 * chains — the withdraw/deposit network is only exposed through the signed
 * Trade API per coin. So this adapter reports the coin universe with an empty
 * network; the scrape marks those rows `unknown` and the importer keeps them on
 * the `UNMPD` placeholder. When Indodax ever exposes networks, only this file
 * needs to change.
 */

import { INDODAX_PAIRS_URL } from "../config";
import { fetchJson } from "../http";
import type { RawCoinNetwork } from "../types";
import type { ExchangeAdapter } from "./types";

type IndodaxPair = {
    traded_currency?: string;
    traded_currency_unit?: string;
    disable_deposit?: boolean;
    is_maintenance?: number;
    is_market_suspended?: number;
};

export const indodaxAdapter: ExchangeAdapter = {
    slug: "indodax",
    label: "Indodax",
    reportsChains: false,

    async fetchNetworks(): Promise<RawCoinNetwork[]> {
        const pairs = await fetchJson<IndodaxPair[]>(INDODAX_PAIRS_URL);
        const seen = new Set<string>();
        const networks: RawCoinNetwork[] = [];

        for (const pair of pairs) {
            const exchangeSymbol = (
                pair.traded_currency_unit ??
                pair.traded_currency ??
                ""
            )
                .trim()
                .toUpperCase();

            if (!exchangeSymbol || seen.has(exchangeSymbol)) continue;
            seen.add(exchangeSymbol);

            networks.push({
                exchangeSymbol,
                network: "",
                depositEnabled: !(pair.disable_deposit ?? false),
                // Indodax does not report per-network withdraw state.
                withdrawEnabled: true,
            });
        }

        return networks;
    },
};
