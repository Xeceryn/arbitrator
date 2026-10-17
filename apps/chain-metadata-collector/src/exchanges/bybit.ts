/**
 * Bybit chain metadata.
 *
 * Bybit's keyless APIs only list tradable instruments, never their chains, so
 * this uses the private `GET /v5/asset/coin/query-info`. It needs an API key
 * plus Bybit's V5 HMAC-SHA256 signature over
 * `timestamp + apiKey + recvWindow + queryString`. Set `BYBIT_API_KEY` and
 * `BYBIT_API_SECRET` (read-only is enough) to crawl it; without them the
 * adapter throws `MissingCredentialsError`, which the scrape records as a skip
 * rather than failing the whole run.
 *
 * Each row is a coin with a `chains[]`; every chain carries the raw `chain`
 * label (e.g. `ETH`), a descriptive `chainType`, a `contractAddress`, and
 * string-encoded `chainDeposit`/`chainWithdraw` flags (`"1"` = enabled).
 */

import { createHmac } from "node:crypto";

import { env } from "@arbitrator/env-loader";

import { fetchJson } from "../http";
import type { RawCoinNetwork } from "../types";
import { type ExchangeAdapter, MissingCredentialsError } from "./types";

const BYBIT_COIN_INFO_URL = "https://api.bybit.com/v5/asset/coin/query-info";
const BYBIT_API_KEY_ENV = "BYBIT_API_KEY";
const BYBIT_API_SECRET_ENV = "BYBIT_API_SECRET";
/** Echoed in the `X-BAPI-RECV-WINDOW` header and part of the signature. */
const BYBIT_RECV_WINDOW = "5000";

type BybitChain = {
    chain?: string;
    chainType?: string;
    /** `"1"` = deposit normal, `"0"` = suspended. */
    chainDeposit?: string;
    /** `"1"` = withdraw normal, `"0"` = suspended. */
    chainWithdraw?: string;
    /** Empty string means the chain has no token contract. */
    contractAddress?: string;
};

type BybitCoin = {
    coin?: string;
    name?: string;
    chains?: BybitChain[];
};

type BybitResponse = {
    retCode?: number;
    retMsg?: string;
    result?: { rows?: BybitCoin[] };
};

export const bybitAdapter: ExchangeAdapter = {
    slug: "bybit",
    label: "Bybit",
    reportsChains: true,

    async fetchNetworks(): Promise<RawCoinNetwork[]> {
        const apiKey = env.BYBIT_API_KEY;
        const apiSecret = env.BYBIT_API_SECRET;

        if (!apiKey || !apiSecret) {
            throw new MissingCredentialsError(
                "Bybit",
                `${BYBIT_API_KEY_ENV} + ${BYBIT_API_SECRET_ENV}`,
            );
        }

        // No query parameters, so the queryString is empty: the signing
        // payload is just timestamp + apiKey + recvWindow.
        const timestamp = Date.now().toString();
        const signature = createHmac("sha256", apiSecret)
            .update(`${timestamp}${apiKey}${BYBIT_RECV_WINDOW}`)
            .digest("hex");

        const body = await fetchJson<BybitResponse>(BYBIT_COIN_INFO_URL, {
            headers: {
                "X-BAPI-API-KEY": apiKey,
                "X-BAPI-TIMESTAMP": timestamp,
                "X-BAPI-RECV-WINDOW": BYBIT_RECV_WINDOW,
                "X-BAPI-SIGN": signature,
            },
        });

        if (body.retCode !== 0) {
            throw new Error(
                `Bybit API error ${body.retCode ?? "unknown"}: ` +
                    `${body.retMsg ?? "unknown"}`,
            );
        }

        const networks: RawCoinNetwork[] = [];

        for (const coin of body.result?.rows ?? []) {
            const exchangeSymbol = coin.coin?.trim().toUpperCase();
            if (!exchangeSymbol) continue;

            for (const chain of coin.chains ?? []) {
                const label = chain.chain?.trim();
                if (!label) continue;

                networks.push({
                    exchangeSymbol,
                    coinName: coin.name?.trim() || undefined,
                    network: label,
                    depositEnabled: chain.chainDeposit === "1",
                    withdrawEnabled: chain.chainWithdraw === "1",
                    contractAddress: chain.contractAddress?.trim() || undefined,
                });
            }
        }

        return networks;
    },
};
