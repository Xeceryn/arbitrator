/**
 * Binance chain metadata.
 *
 * Binance's `/api/v3` has no keyless per-coin network list; the endpoint the
 * web deposit page uses is the keyless `bapi/capital/v1/public/capital/...`
 * asset endpoint. Each coin carries a `networkList` with per-network
 * `depositEnable` / `withdrawEnable` flags.
 */

import { BINANCE_NETWORK_URL } from "../config";
import { fetchJson } from "../http";
import type { RawCoinNetwork } from "../types";
import type { ExchangeAdapter } from "./types";

type BinanceNetwork = {
    network?: string;
    name?: string;
    depositEnable?: boolean;
    withdrawEnable?: boolean;
    contractAddress?: string;
};

type BinanceCoin = {
    coin?: string;
    name?: string;
    networkList?: BinanceNetwork[];
};

type BinanceResponse = {
    code?: string;
    message?: string;
    success?: boolean;
    data?: BinanceCoin[];
};

export const binanceAdapter: ExchangeAdapter = {
    slug: "binance",
    label: "Binance",
    reportsChains: true,

    async fetchNetworks(): Promise<RawCoinNetwork[]> {
        const body = await fetchJson<BinanceResponse>(BINANCE_NETWORK_URL);

        if (body.success === false) {
            throw new Error(
                `Binance error: ${body.message ?? body.code ?? "request failed"}`,
            );
        }

        const networks: RawCoinNetwork[] = [];

        for (const coin of body.data ?? []) {
            const exchangeSymbol = coin.coin?.trim().toUpperCase();
            if (!exchangeSymbol) continue;

            for (const network of coin.networkList ?? []) {
                const label = network.network?.trim();
                if (!label) continue;

                networks.push({
                    exchangeSymbol,
                    coinName: coin.name?.trim() || undefined,
                    network: label,
                    depositEnabled: network.depositEnable ?? false,
                    withdrawEnabled: network.withdrawEnable ?? false,
                    contractAddress:
                        network.contractAddress?.trim() || undefined,
                });
            }
        }

        return networks;
    },
};
