import { COIN_MAP_LISTING_STATUS, COIN_MAP_URL } from "./config";

/** Canonical CMC identity for a coin, independent of any exchange. */
export type CoinMapEntry = {
    id: number;
    name: string;
    symbol: string;
    slug: string;
};

type CoinMapResponse = {
    data?: {
        cryptoCurrencyMap?: Array<{
            id: number;
            name: string;
            symbol: string;
            slug: string;
        }>;
    };
    status?: {
        error_code?: string;
        error_message?: string;
    };
};

/**
 * Fetch the keyless coin map once and keep only the requested ids.
 *
 * The map is the canonical source for a coin's `name`/`symbol`/`slug`; the
 * per-exchange ticker comes from the market-pairs response instead.
 */
export async function fetchCoinMap(
    ids: ReadonlySet<number>,
): Promise<Map<number, CoinMapEntry>> {
    const url = new URL(COIN_MAP_URL);
    url.searchParams.set("listing_status", COIN_MAP_LISTING_STATUS);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`coin map failed: HTTP ${response.status}`);
    }

    const body = (await response.json()) as CoinMapResponse;
    if (body.status?.error_code && body.status.error_code !== "0") {
        throw new Error(
            `coin map error: ${body.status.error_message ?? body.status.error_code}`,
        );
    }

    const result = new Map<number, CoinMapEntry>();
    for (const coin of body.data?.cryptoCurrencyMap ?? []) {
        if (!ids.has(coin.id)) continue;
        result.set(coin.id, {
            id: coin.id,
            name: coin.name,
            symbol: coin.symbol,
            slug: coin.slug,
        });
    }

    return result;
}
