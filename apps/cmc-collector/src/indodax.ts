import { INDODAX_PAIRS_URL } from "./config";

/**
 * Indodax's own keyless pair listing (`https://indodax.com/api/pairs`).
 *
 * Indodax publishes two different tickers per market:
 *
 * - `traded_currency_unit` is what the venue displays and what lister stores as
 *   `market.exchangeSymbol` (e.g. `T` for Threshold, `POL` for Polygon).
 * - `id` / `traded_currency` is what its orderbook websocket subscribes with
 *   (e.g. `thresholdidr`, not `tidr`), unless Indodax renamed the market: then
 *   the book keeps streaming under `old_ticker_id` (AAVE is `aaveidr` but only
 *   `lendidr` publishes).
 *
 * That divergence is why this collector cannot use CMC's `baseSymbol` for
 * Indodax. The websocket side is mapped by CMC id in the sender's worker
 * (`apps/sender/src/workers/orderbooks/indodax-symbols.ts`), which this app
 * regenerates from the live pair list (`indodax-symbols.ts` here).
 */

/** The subset of Indodax's pair payload this collector consumes. */
export type IndodaxPair = {
    id: string;
    symbol: string;
    base_currency: string;
    traded_currency: string;
    traded_currency_unit: string;
    /**
     * Pre-rename ticker id (`lend_idr` for AAVE) that the websocket still
     * publishes the book under. Absent for markets that were never renamed.
     */
    old_ticker_id?: string;
    description?: string;
    url_logo?: string;
    url_logo_png?: string;
    coingecko_id?: string;
    is_maintenance?: unknown;
    is_market_suspended?: unknown;
    disable_deposit?: unknown;
    cmc_id?: number | null;
};

/** A coin listed on Indodax, normalized for the snapshot. */
export type IndodaxCoin = {
    /** Canonical CMC id (after `INDODAX_CMC_ID_ALIASES` is applied). */
    cmcId: number;
    /** Display ticker stored as `market.exchangeSymbol` (`traded_currency_unit`). */
    exchangeSymbol: string;
    /** Pair id the orderbook websocket publishes under (see `indodaxSubscriptionPairId`). */
    subscribeSymbol: string;
    name: string;
    slug: string;
    logo: string;
    /** False when Indodax suspended the market (`is_market_suspended`). */
    tradeEnabled: boolean;
    /** True when the coin network is in maintenance (`is_maintenance`). */
    chainSuspended: boolean;
    /** False when Indodax disabled deposits for the coin (`disable_deposit`). */
    depositEnabled: boolean;
};

export type IndodaxSkippedPair = {
    id: string;
    reason: string;
};

export type NormalizedIndodaxPairs = {
    coins: IndodaxCoin[];
    skipped: IndodaxSkippedPair[];
};

/**
 * Indodax still reports a few coins under their pre-migration CMC id, while
 * lister keys coins by the current one.
 *
 * - `3890` (MATIC) -> `28321` (POL). Indodax tags its `polidr` pair with the old
 *   MATIC id; the lister `cryptocurrency` row is the current POL id.
 */
export const INDODAX_CMC_ID_ALIASES: ReadonlyMap<number, number> = new Map([
    [3890, 28321],
]);

/** Fold an Indodax-reported CMC id onto the id lister uses. */
export function canonicalIndodaxCmcId(cmcId: number): number {
    return INDODAX_CMC_ID_ALIASES.get(cmcId) ?? cmcId;
}

/**
 * The pair id Indodax's orderbook websocket actually streams on.
 *
 * Renamed markets keep their original channel: AAVE is listed as `aaveidr` but
 * only `lendidr` publishes (`old_ticker_id: "lend_idr"`), and subscribing the
 * current `id` yields an ack with no data. So the old ticker wins whenever the
 * pair exposes one, falling back to `id` and then `<traded>idr`.
 */
export function indodaxSubscriptionPairId(pair: IndodaxPair): string {
    const oldTicker = pair.old_ticker_id?.trim();
    const currentId = pair.id?.trim();
    const traded = pair.traded_currency?.trim();
    const candidate = oldTicker || currentId || (traded ? `${traded}idr` : "");

    if (!candidate) return "";

    const normalized = candidate.replace(/_/g, "").toLowerCase();
    const quote = (pair.base_currency ?? "").trim().toLowerCase();

    // `old_ticker_id` carries the quote (`lend_idr`), but stay defensive.
    return quote && !normalized.endsWith(quote)
        ? `${normalized}${quote}`
        : normalized;
}

/** Fetch the full pair list. Indodax returns a bare JSON array. */
export async function fetchIndodaxPairs(): Promise<IndodaxPair[]> {
    const response = await fetch(INDODAX_PAIRS_URL, {
        headers: { accept: "application/json" },
    });

    if (!response.ok) {
        throw new Error(`indodax pairs failed: HTTP ${response.status}`);
    }

    const body: unknown = await response.json();
    if (!Array.isArray(body)) {
        throw new Error("indodax pairs: expected a JSON array");
    }

    return body as IndodaxPair[];
}

/**
 * Normalize the pair list into one entry per coin.
 *
 * Only IDR pairs are kept: lister models Indodax as an IDR venue and the worker
 * subscribes `<pair>idr` channels. Indodax also lists a handful of USDT books
 * (BTC, ETH, …) for coins that already have an IDR pair, so dropping them loses
 * no coins.
 */
export function normalizeIndodaxPairs(
    pairs: readonly IndodaxPair[],
): NormalizedIndodaxPairs {
    const coins = new Map<number, IndodaxCoin>();
    const skipped: IndodaxSkippedPair[] = [];

    for (const pair of pairs) {
        if ((pair.base_currency ?? "").toLowerCase() !== "idr") continue;

        const rawCmcId = pair.cmc_id;
        if (
            typeof rawCmcId !== "number" ||
            !Number.isFinite(rawCmcId) ||
            rawCmcId <= 0
        ) {
            skipped.push({ id: pair.id, reason: "missing cmc_id" });
            continue;
        }

        const cmcId = canonicalIndodaxCmcId(rawCmcId);
        if (coins.has(cmcId)) {
            skipped.push({
                id: pair.id,
                reason: `duplicate cmc id ${cmcId}`,
            });
            continue;
        }

        const traded = pair.traded_currency?.trim();
        const unit =
            pair.traded_currency_unit?.trim() || traded || pair.symbol?.trim();
        const pairId = indodaxSubscriptionPairId(pair);

        if (!traded || !unit || !pairId) {
            skipped.push({ id: pair.id, reason: "missing ticker" });
            continue;
        }

        coins.set(cmcId, {
            cmcId,
            exchangeSymbol: unit.toUpperCase(),
            subscribeSymbol: pairId,
            name: pair.description?.split("/")[0]?.trim() || unit.toUpperCase(),
            slug: traded.toLowerCase(),
            logo: pair.url_logo_png?.trim() || pair.url_logo?.trim() || "",
            tradeEnabled: !isFlagSet(pair.is_market_suspended),
            chainSuspended: isFlagSet(pair.is_maintenance),
            depositEnabled: !isFlagSet(pair.disable_deposit),
        });
    }

    return { coins: [...coins.values()], skipped };
}

/** Indodax serializes booleans as `0`/`1`; accept both shapes. */
function isFlagSet(value: unknown): boolean {
    return value === true || value === 1 || value === "1";
}
