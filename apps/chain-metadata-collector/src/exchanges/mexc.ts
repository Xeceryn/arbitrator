/**
 * MEXC chain metadata.
 *
 * Unlike the other venues, MEXC's `GET /api/v3/capital/config/getall` is a
 * private endpoint: it requires an API key, a millisecond `timestamp` and an
 * HMAC-SHA256 `signature` over the querystring. Set `MEXC_API_KEY` and
 * `MEXC_API_SECRET` (read-only access is enough) to crawl it. Without them the
 * adapter throws `MissingCredentialsError`, which the scrape records as a skip
 * rather than failing the whole run.
 */

import { createHmac } from "node:crypto";

import { env } from "@arbitrator/env-loader";

import {
    MEXC_API_KEY_ENV,
    MEXC_API_SECRET_ENV,
    MEXC_WALLET_CONFIG_URL,
} from "../config";
import { fetchJson } from "../http";
import type { RawCoinNetwork } from "../types";
import { type ExchangeAdapter, MissingCredentialsError } from "./types";

type MexcNetwork = {
    network?: string;
    depositEnable?: boolean;
    withdrawEnable?: boolean;
    contractAddress?: string;
};

type MexcCoin = {
    coin?: string;
    name?: string;
    networkList?: MexcNetwork[];
};

export const mexcAdapter: ExchangeAdapter = {
    slug: "mexc",
    label: "MEXC",
    reportsChains: true,

    async fetchNetworks(): Promise<RawCoinNetwork[]> {
        const apiKey = env.MEXC_API_KEY;
        const apiSecret = env.MEXC_API_SECRET;

        if (!apiKey || !apiSecret) {
            throw new MissingCredentialsError(
                "MEXC",
                `${MEXC_API_KEY_ENV} + ${MEXC_API_SECRET_ENV}`,
            );
        }

        const query = `timestamp=${Date.now()}`;
        const signature = createHmac("sha256", apiSecret)
            .update(query)
            .digest("hex");
        const url = `${MEXC_WALLET_CONFIG_URL}?${query}&signature=${signature}`;

        const body = await fetchJson<MexcCoin[] | { data?: MexcCoin[] }>(url, {
            headers: { "X-MEXC-APIKEY": apiKey },
        });
        const coins = Array.isArray(body) ? body : (body.data ?? []);
        const networks: RawCoinNetwork[] = [];

        for (const coin of coins) {
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
