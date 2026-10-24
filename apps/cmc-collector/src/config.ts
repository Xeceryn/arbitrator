/**
 * Scrape targets and shared constants for the CMC collector.
 *
 * Most targets use CoinMarketCap's keyless public `data-api`, which is what
 * exposes the per-exchange market pairs (and therefore each exchange's own
 * ticker for a coin). No Pro API key is required.
 *
 * Indodax is the exception: CMC's pair list does not carry the tickers Indodax
 * uses on its orderbook websocket, so that venue is scraped from its own public
 * `https://indodax.com/api/pairs` endpoint instead (see `src/indodax.ts`).
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

/** Indodax's own keyless pair listing (all IDR/USDT markets). */
export const INDODAX_PAIRS_URL = "https://indodax.com/api/pairs";

/** CMC id of the Indodax exchange itself (lister `exchange.cmcId`). */
export const INDODAX_EXCHANGE_CMC_ID = 68;

export const QuoteCurrency = {
    USDT: 825,
    IDR: 2794,
} as const;
export type QuoteCurrency = (typeof QuoteCurrency)[keyof typeof QuoteCurrency];

/** Base currency classification used by the lister `exchange` table. */
export type ExchangeBaseCurrency = "usdt" | "idr";

/** Where a target's market pairs come from. */
export type ExchangeSource = "cmc" | "indodax";

export type CmcExchangeTarget = {
    source: "cmc";
    /** CMC exchange slug used to look the exchange up. */
    slug: string;
    /** CMC id of the quote currency to keep. */
    quoteCurrencyId: QuoteCurrency;
    /** Currency the venue quotes in (lister exchange classification). */
    baseCurrency: ExchangeBaseCurrency;
};

/**
 * Indodax is scraped from its own public API because CMC's `baseSymbol` is not
 * the ticker Indodax uses on its websocket (e.g. CMC says `THRESHOLD`, Indodax
 * subscribes with `thresholdidr` while displaying `T`).
 */
export type IndodaxExchangeTarget = {
    source: "indodax";
    slug: "indodax";
    name: string;
    /** CMC id of the exchange row (lister identity for Indodax). */
    exchangeCmcId: number;
    baseCurrency: "idr";
};

export type ExchangeTarget = CmcExchangeTarget | IndodaxExchangeTarget;

/** The single non-CMC target, reused by the dedicated `--indodax` scan. */
export const INDODAX_TARGET: IndodaxExchangeTarget = {
    source: "indodax",
    slug: "indodax",
    name: "Indodax",
    exchangeCmcId: INDODAX_EXCHANGE_CMC_ID,
    baseCurrency: "idr",
};

export const EXCHANGE_TARGETS: ExchangeTarget[] = [
    INDODAX_TARGET,
    {
        source: "cmc",
        slug: "rekeningku-com",
        quoteCurrencyId: QuoteCurrency.IDR,
        baseCurrency: "idr",
    },

    {
        source: "cmc",
        slug: "binance",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
    {
        source: "cmc",
        slug: "kucoin",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
    {
        source: "cmc",
        slug: "bybit",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
    {
        source: "cmc",
        slug: "mexc",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
    {
        source: "cmc",
        slug: "htx",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
    {
        source: "cmc",
        slug: "gate-io",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
    {
        source: "cmc",
        slug: "okx",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
    {
        source: "cmc",
        slug: "bitget",
        quoteCurrencyId: QuoteCurrency.USDT,
        baseCurrency: "usdt",
    },
    {
        source: "cmc",
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
