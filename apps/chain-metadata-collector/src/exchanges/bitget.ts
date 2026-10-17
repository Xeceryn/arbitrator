/**
 * Bitget chain metadata.
 *
 * `GET /api/v2/spot/public/coins` is keyless (no API key, no signature) and
 * returns every coin with a `chains[]` array. Each chain entry carries the raw
 * network label, a hex `contractAddress` (null on native chains) and the
 * deposit/withdraw switches as **strings** (`"true"`/`"false"`).
 */

import { fetchJson } from "../http";
import type { RawCoinNetwork } from "../types";
import type { ExchangeAdapter } from "./types";

const BITGET_COINS_URL = "https://api.bitget.com/api/v2/spot/public/coins";

type BitgetChain = {
    chain?: string;
    withdrawable?: string;
    rechargeable?: string;
    contractAddress?: string | null;
};

type BitgetCoin = {
    coin?: string;
    chains?: BitgetChain[];
};

type BitgetResponse = {
    code?: string;
    msg?: string;
    data?: BitgetCoin[];
};

export const bitgetAdapter: ExchangeAdapter = {
    slug: "bitget",
    label: "Bitget",
    reportsChains: true,

    async fetchNetworks(): Promise<RawCoinNetwork[]> {
        const body = await fetchJson<BitgetResponse>(BITGET_COINS_URL);

        if (body.code && body.code !== "00000") {
            throw new Error(
                `Bitget error: ${body.msg ?? body.code ?? "request failed"}`,
            );
        }

        const networks: RawCoinNetwork[] = [];

        for (const coin of body.data ?? []) {
            const exchangeSymbol = coin.coin?.trim().toUpperCase();
            if (!exchangeSymbol) continue;

            for (const chain of coin.chains ?? []) {
                const label = chain.chain?.trim();
                if (!label) continue;

                networks.push({
                    exchangeSymbol,
                    network: label,
                    depositEnabled: chain.rechargeable === "true",
                    withdrawEnabled: chain.withdrawable === "true",
                    contractAddress: chain.contractAddress?.trim() || undefined,
                });
            }
        }

        return networks;
    },
};
