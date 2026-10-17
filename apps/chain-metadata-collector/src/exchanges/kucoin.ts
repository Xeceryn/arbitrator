/**
 * KuCoin chain metadata.
 *
 * `GET /api/v3/currencies` is keyless and returns every currency with a
 * `chains[]` array. Each chain has a human `chainName` (e.g. `ERC20`,
 * `BEP20(BSC)`) and a machine `chainId` (e.g. `eth`, `bsc`); the `chainId` is
 * passed as a resolution hint because it is the more stable of the two.
 */

import { KUCOIN_CURRENCIES_URL } from "../config";
import { fetchJson } from "../http";
import type { RawCoinNetwork } from "../types";
import type { ExchangeAdapter } from "./types";

type KucoinChain = {
    chainName?: string;
    chainId?: string;
    isDepositEnabled?: boolean;
    isWithdrawEnabled?: boolean;
    contractAddress?: string;
};

type KucoinCurrency = {
    currency?: string;
    name?: string;
    fullName?: string;
    chains?: KucoinChain[];
};

type KucoinResponse = {
    code?: string;
    data?: KucoinCurrency[];
};

export const kucoinAdapter: ExchangeAdapter = {
    slug: "kucoin",
    label: "KuCoin",
    reportsChains: true,

    async fetchNetworks(): Promise<RawCoinNetwork[]> {
        const body = await fetchJson<KucoinResponse>(KUCOIN_CURRENCIES_URL);
        const networks: RawCoinNetwork[] = [];

        for (const currency of body.data ?? []) {
            const exchangeSymbol = currency.currency?.trim().toUpperCase();
            if (!exchangeSymbol) continue;

            for (const chain of currency.chains ?? []) {
                const label = (chain.chainName ?? chain.chainId ?? "").trim();
                if (!label) continue;

                networks.push({
                    exchangeSymbol,
                    coinName:
                        (currency.fullName ?? currency.name)?.trim() ||
                        undefined,
                    network: label,
                    networkHint: chain.chainId?.trim() || undefined,
                    depositEnabled: chain.isDepositEnabled ?? false,
                    withdrawEnabled: chain.isWithdrawEnabled ?? false,
                    contractAddress: chain.contractAddress?.trim() || undefined,
                });
            }
        }

        return networks;
    },
};
