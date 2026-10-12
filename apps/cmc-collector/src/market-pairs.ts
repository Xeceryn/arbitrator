import { sleep } from "bun";

import {
    EXCHANGE_MARKET_PAIRS_URL,
    MARKET_PAIRS_DELAY_MS,
    MARKET_PAIRS_PAGE_SIZE,
} from "./config";

/**
 * Exchange market pairs from CMC's keyless public data-api.
 *
 * `exchangeSymbol` is the exchange-reported ticker (e.g. Binance `1000SATS`,
 * which is `SATS` on CMC). This is what a lister market assignment stores,
 * because the same coin can be listed under a different ticker per exchange.
 */
export type NormalizedMarketPair = {
    category: string;
    baseCurrencyId: number;
    baseCurrencyName?: string;
    baseCurrencySlug?: string;
    /** Exchange-reported ticker. */
    exchangeSymbol: string;
    quoteCurrencyId: number;
};

export type MarketPairsPage = {
    exchangeId: number;
    exchangeName: string;
    exchangeSlug: string;
    pairs: NormalizedMarketPair[];
};

/**
 * Shape returned by the public data-api. Only the fields we consume are
 * declared; this endpoint is not part of the Pro SDK spec.
 */
type DataApiMarketPair = {
    category: string;
    baseCurrencyId: number;
    baseSymbol: string;
    baseCurrencyName?: string;
    baseCurrencySlug?: string;
    quoteCurrencyId: number;
};

type DataApiResponse = {
    data: {
        id: number;
        name: string;
        slug: string;
        numMarketPairs: number;
        marketPairs: DataApiMarketPair[];
    };
    status?: {
        error_code?: string;
        error_message?: string;
    };
};

/**
 * Walk every page of an exchange's spot market pairs and keep only the pairs
 * quoted in `quoteCurrencyId`. The endpoint already filters by quote via
 * `quoteCurrencyId`, so it returns the exchange's own ticker per pair.
 */
export async function fetchMarketPairs(
    slug: string,
    quoteCurrencyId: number,
): Promise<MarketPairsPage> {
    const pairs: NormalizedMarketPair[] = [];
    let exchangeId: number | undefined;
    let exchangeName: string | undefined;
    let exchangeSlug: string | undefined;
    let start = 1;

    while (true) {
        const url = new URL(EXCHANGE_MARKET_PAIRS_URL);
        url.searchParams.set("slug", slug);
        url.searchParams.set("category", "spot");
        url.searchParams.set("start", String(start));
        url.searchParams.set("quoteCurrencyId", String(quoteCurrencyId));
        url.searchParams.set("limit", String(MARKET_PAIRS_PAGE_SIZE));

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(
                `market pairs failed for ${slug}: HTTP ${response.status}`,
            );
        }

        const body = (await response.json()) as DataApiResponse;
        if (body.status?.error_code && body.status.error_code !== "0") {
            throw new Error(
                `market pairs error for ${slug}: ${body.status.error_message ?? body.status.error_code}`,
            );
        }

        const result = body.data;
        exchangeId ??= result.id;
        exchangeName ??= result.name;
        exchangeSlug ??= result.slug;

        const page = result.marketPairs ?? [];
        for (const pair of page) {
            if (pair.category !== "spot") continue;
            if (pair.quoteCurrencyId !== quoteCurrencyId) continue;

            pairs.push({
                category: pair.category,
                baseCurrencyId: pair.baseCurrencyId,
                baseCurrencyName: pair.baseCurrencyName,
                baseCurrencySlug: pair.baseCurrencySlug,
                exchangeSymbol: pair.baseSymbol,
                quoteCurrencyId: pair.quoteCurrencyId,
            });
        }

        if (page.length < MARKET_PAIRS_PAGE_SIZE) break;
        start += MARKET_PAIRS_PAGE_SIZE;
        await sleep(MARKET_PAIRS_DELAY_MS);
    }

    if (exchangeId === undefined || !exchangeName || !exchangeSlug) {
        throw new Error(`market pairs response was empty for ${slug}`);
    }

    return { exchangeId, exchangeName, exchangeSlug, pairs };
}
