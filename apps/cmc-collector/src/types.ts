import type { ExchangeBaseCurrency } from "./config";

/**
 * A lister `exchange` row, before it is imported.
 *
 * `slug` is the canonical CMC slug (taken from the response, never the request
 * slug) because lister treats the exchange slug as identity.
 */
export type ExchangeSnapshot = {
    cmcId: number;
    name: string;
    slug: string;
    logo: string;
    baseCurrency: ExchangeBaseCurrency;
};

/**
 * A lister `cryptocurrency` row, before it is imported. `cmcId` is the
 * cross-exchange identity; `symbol` is CMC's canonical ticker.
 */
export type CryptocurrencySnapshot = {
    cmcId: number;
    name: string;
    symbol: string;
    slug: string;
    logo: string;
};

/**
 * A lister `market` assignment (exchange x cryptocurrency), before it is
 * imported. `exchangeSymbol` is the ticker the *exchange* lists the coin under
 * (e.g. Binance `1000SATS`), not CMC's canonical ticker, and is what the
 * orderbook workers subscribe with.
 */
export type MarketSnapshot = {
    exchangeCmcId: number;
    exchangeSlug: string;
    cryptocurrencyCmcId: number;
    exchangeSymbol: string;
    quoteCurrencyId: number;
    tradeEnabled: boolean;
};

/** The full local snapshot written by `--scrape` and read by `--import`. */
export type Snapshot = {
    scrapedAt: string;
    source: "coinmarketcap-public";
    exchanges: ExchangeSnapshot[];
    cryptocurrencies: CryptocurrencySnapshot[];
    markets: MarketSnapshot[];
};

export type SnapshotManifest = {
    scrapedAt: string;
    source: "coinmarketcap-public";
    counts: {
        exchanges: number;
        cryptocurrencies: number;
        markets: number;
    };
};
