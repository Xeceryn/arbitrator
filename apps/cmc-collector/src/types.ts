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
    /**
     * False for venues with no CoinMarketCap identity (Pintu). Omitted means
     * true, so CMC/Indodax snapshots stay unchanged.
     */
    registeredOnCmc?: boolean;
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
 * (e.g. Binance `1000SATS`), not CMC's canonical ticker. For Indodax that is
 * `traded_currency_unit` (`T` for Threshold), which is what the UI shows; the
 * orderbook websocket subscribes with a different pair id.
 */
export type MarketSnapshot = {
    exchangeCmcId: number;
    exchangeSlug: string;
    cryptocurrencyCmcId: number;
    exchangeSymbol: string;
    quoteCurrencyId: number;
    tradeEnabled: boolean;
    /**
     * Indodax only: the coin's network is in maintenance (`is_maintenance`), so
     * every chain link for this market must be suspended. Absent elsewhere.
     */
    chainSuspended?: boolean;
    /**
     * Indodax only: the coin-level deposit flag (`disable_deposit` inverted).
     * Applied together with `chainSuspended` to every chain link of the market.
     */
    depositEnabled?: boolean;
};

/** Where a snapshot's rows came from. Indodax and Pintu use their own APIs. */
export type SnapshotSource =
    | "coinmarketcap-public"
    | "indodax-public"
    | "pintu-public"
    | "coinmarketcap-public+indodax-public";

/** The full local snapshot written by `--scrape` and read by `--import`. */
export type Snapshot = {
    scrapedAt: string;
    source: SnapshotSource;
    exchanges: ExchangeSnapshot[];
    cryptocurrencies: CryptocurrencySnapshot[];
    markets: MarketSnapshot[];
};

export type SnapshotManifest = {
    scrapedAt: string;
    source: SnapshotSource;
    counts: {
        exchanges: number;
        cryptocurrencies: number;
        markets: number;
    };
};
