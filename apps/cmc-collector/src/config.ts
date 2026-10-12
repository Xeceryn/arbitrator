/**
 * Scrape targets and shared constants for the CMC collector.
 *
 * Everything here targets CoinMarketCap's keyless public `data-api`, which is
 * what exposes the per-exchange market pairs (and therefore each exchange's own
 * ticker for a coin). No Pro API key is required.
 *
 * The quote currency is the filter applied to an exchange's market pairs: for
 * Indonesian venues we keep pairs quoted in IDR, for the global venues we keep
 * pairs quoted in USDT. `baseCurrency` is the lister exchange classification
 * (the currency the venue prices its books in).
 */

export const DATA_API_BASE = "https://api.coinmarketcap.com/data-api/v3";

/** Exchange market pairs (keyless). Returns each pair's exchange ticker. */
export const EXCHANGE_MARKET_PAIRS_URL = `${DATA_API_BASE}/exchange/market-pairs/latest`;

/** Full coin id/name/symbol/slug map (keyless), one request for every coin. */
export const COIN_MAP_URL = `${DATA_API_BASE}/map/all`;

export const QuoteCurrency = {
    USDT: 825,
    IDR: 2794,
} as const;
export type QuoteCurrency = (typeof QuoteCurrency)[keyof typeof QuoteCurrency];

/** Base currency classification used by the lister `exchange` table. */
export type ExchangeBaseCurrency = "usdt" | "idr";

export type ExchangeTarget = {
    /** CMC exchange slug used to look the exchange up. */
    slug: string;
    /** CMC id of the quote currency to keep. */
    quoteCurrencyId: QuoteCurrency;
    /** Currency the venue quotes in (lister exchange classification). */
    baseCurrency: ExchangeBaseCurrency;
};

export const EXCHANGE_TARGETS: ExchangeTarget[] = [
    {
        slug: "indodax",
        quoteCurrencyId: QuoteCurrency.IDR,
        baseCurrency: "idr",
    },
    {
        slug: "rekeningku-com",
        quoteCurrencyId: QuoteCurrency.IDR,
        baseCurrency: "idr",
    },

    {
        slug: "binance",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
    {
        slug: "kucoin",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
    {
        slug: "bybit",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
    {
        slug: "mexc",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
    {
        slug: "htx",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
    {
        slug: "gate-io",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
    {
        slug: "okx",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
    {
        slug: "bitget",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
    {
        slug: "bitmart",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
];

export const MARKET_PAIRS_PAGE_SIZE = 100;
export const MARKET_PAIRS_DELAY_MS = 1_000;

/** `listing_status` passed to the public coin map. */
export const COIN_MAP_LISTING_STATUS = "active";

/**
 * Placeholder chain the importer links fresh markets to when no real chain is
 * known yet, so every market starts with a withdraw/deposit edge.
 */
export const UNMAPPED_CHAIN = {
    name: "Unmapped Chain",
    code: "UNMPD",
} as const;
