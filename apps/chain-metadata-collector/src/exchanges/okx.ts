/**
 * OKX chain metadata.
 *
 * OKX's keyless web endpoints (e.g. `/v2/asset/withdraw/fee-amount-infos`)
 * publish withdrawal network labels only: no contract address and no
 * deposit/withdraw switches. The full per-chain state lives behind the signed
 * `GET /api/v5/asset/currencies` endpoint, so this adapter signs the request
 * with OKX's HMAC scheme. Set `OKX_API_KEY`, `OKX_API_SECRET` and
 * `OKX_API_PASSPHRASE` (read-only access is enough). Without them the adapter
 * throws `MissingCredentialsError`, which the scrape records as a skip rather
 * than failing the whole run.
 */

import { createHmac } from "node:crypto";

import { env } from "@arbitrator/env-loader";

import { fetchJson } from "../http";
import type { RawCoinNetwork } from "../types";
import { type ExchangeAdapter, MissingCredentialsError } from "./types";

const OKX_CURRENCIES_URL = "https://www.okx.com/api/v5/asset/currencies";

/** requestPath signed over — must include the query string, if any. */
const OKX_CURRENCIES_PATH = "/api/v5/asset/currencies";

const OKX_API_KEY_ENV = "OKX_API_KEY";
const OKX_API_SECRET_ENV = "OKX_API_SECRET";
const OKX_API_PASSPHRASE_ENV = "OKX_API_PASSPHRASE";

type OkxCurrency = {
    ccy?: string;
    name?: string;
    chain?: string;
    ctAddr?: string;
    canDep?: boolean;
    canWd?: boolean;
};

type OkxResponse = {
    code?: string;
    msg?: string;
    data?: OkxCurrency[];
};

/**
 * Base64 HMAC-SHA256 signature: `timestamp + method + requestPath + body`.
 * GET has no body, so it is omitted from the pre-hash string.
 */
function okxSignature(
    secret: string,
    timestamp: string,
    requestPath: string,
): string {
    return createHmac("sha256", secret)
        .update(`${timestamp}GET${requestPath}`)
        .digest("base64");
}

/**
 * OKX spells each chain as `<ccy>-<chainName>` (e.g. `USDT-ERC20`,
 * `BTC-Bitcoin`). Strip the redundant coin prefix so one network resolves to a
 * single label across coins; keep the label untouched when it has no prefix.
 */
function chainLabel(chain: string, ccy: string): string {
    const prefix = `${ccy}-`;
    const trimmed = chain.trim();
    if (trimmed.toUpperCase().startsWith(prefix.toUpperCase())) {
        return trimmed.slice(prefix.length).trim();
    }
    return trimmed;
}

export const okxAdapter: ExchangeAdapter = {
    slug: "okx",
    label: "OKX",
    reportsChains: true,

    async fetchNetworks(): Promise<RawCoinNetwork[]> {
        const apiKey = env.OKX_API_KEY;
        const apiSecret = env.OKX_API_SECRET;
        const passphrase = env.OKX_API_PASSPHRASE;

        if (!apiKey || !apiSecret || !passphrase) {
            throw new MissingCredentialsError(
                "OKX",
                `${OKX_API_KEY_ENV} + ${OKX_API_SECRET_ENV} + ${OKX_API_PASSPHRASE_ENV}`,
            );
        }

        const timestamp = new Date().toISOString();
        const body = await fetchJson<OkxResponse>(OKX_CURRENCIES_URL, {
            headers: {
                "OK-ACCESS-KEY": apiKey,
                "OK-ACCESS-SIGN": okxSignature(
                    apiSecret,
                    timestamp,
                    OKX_CURRENCIES_PATH,
                ),
                "OK-ACCESS-TIMESTAMP": timestamp,
                "OK-ACCESS-PASSPHRASE": passphrase,
            },
        });

        if (body.code && body.code !== "0") {
            throw new Error(
                `OKX error: ${body.msg ?? body.code ?? "request failed"}`,
            );
        }

        const networks: RawCoinNetwork[] = [];

        for (const currency of body.data ?? []) {
            const exchangeSymbol = currency.ccy?.trim().toUpperCase();
            if (!exchangeSymbol) continue;

            const rawChain = currency.chain?.trim();
            if (!rawChain) continue;

            const label = chainLabel(rawChain, exchangeSymbol);
            if (!label) continue;

            networks.push({
                exchangeSymbol,
                coinName: currency.name?.trim() || undefined,
                network: label,
                depositEnabled: currency.canDep ?? false,
                withdrawEnabled: currency.canWd ?? false,
                contractAddress: currency.ctAddr?.trim() || undefined,
            });
        }

        return networks;
    },
};
