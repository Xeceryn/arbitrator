/**
 * Gate.io chain metadata.
 *
 * `GET /api/v4/spot/currencies` is keyless and returns each currency with a
 * `chains[]` array; the flags are **negative** (`deposit_disabled`,
 * `withdraw_disabled`), so enabled = `!disabled`.
 *
 * A few currencies only carry the legacy single `chain` string with no flags;
 * those are emitted with deposit/withdraw enabled, since Gate does not say
 * otherwise.
 */

import { GATE_CURRENCIES_URL } from "../config";
import { fetchJson } from "../http";
import type { RawCoinNetwork } from "../types";
import type { ExchangeAdapter } from "./types";

type GateChain = {
    name?: string;
    deposit_disabled?: boolean;
    withdraw_disabled?: boolean;
    addr?: string;
};

type GateCurrency = {
    currency?: string;
    name?: string;
    delisted?: boolean;
    chain?: string;
    chains?: GateChain[];
};

export const gateIoAdapter: ExchangeAdapter = {
    slug: "gate",
    label: "Gate.io",
    reportsChains: true,

    async fetchNetworks(): Promise<RawCoinNetwork[]> {
        const currencies = await fetchJson<GateCurrency[]>(GATE_CURRENCIES_URL);
        const networks: RawCoinNetwork[] = [];

        for (const currency of currencies) {
            const exchangeSymbol = currency.currency?.trim().toUpperCase();
            if (!exchangeSymbol) continue;
            if (currency.delisted) continue;

            const chains: GateChain[] =
                currency.chains && currency.chains.length > 0
                    ? currency.chains
                    : currency.chain
                      ? [{ name: currency.chain }]
                      : [];

            for (const chain of chains) {
                const label = chain.name?.trim();
                if (!label) continue;

                networks.push({
                    exchangeSymbol,
                    coinName: currency.name?.trim() || undefined,
                    network: label,
                    depositEnabled: !(chain.deposit_disabled ?? false),
                    withdrawEnabled: !(chain.withdraw_disabled ?? false),
                    contractAddress: chain.addr?.trim() || undefined,
                });
            }
        }

        return networks;
    },
};
