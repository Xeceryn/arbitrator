/**
 * Constants and scrape targets for the chain-metadata collector.
 *
 * Unlike `apps/cmc-collector` (which reads CMC's keyless public API), this
 * collector talks to each exchange's *own* API to learn which chains a coin is
 * listed under, and whether withdraw/deposit is enabled on each chain. That is
 * the finer-grained data the arbitrage operator otherwise has to look up by
 * hand on every venue.
 *
 * Adapters live in `src/exchanges/`; each is keyed by the lister `exchange.slug`
 * so an imported snapshot can be matched back to the market rows.
 */

/** lister `exchange.slug` values this collector knows how to crawl. */
export type ExchangeSlug =
    | "binance"
    | "gate"
    | "kucoin"
    | "okx"
    | "bybit"
    | "bitget"
    | "mexc"
    | "indodax";

/** Adapters crawled by default, in a stable order. */
export const DEFAULT_EXCHANGES: ExchangeSlug[] = [
    "binance",
    "gate",
    "kucoin",
    "okx",
    "bybit",
    "bitget",
    "mexc",
    "indodax",
];

export const ALL_EXCHANGE_SLUGS: ExchangeSlug[] = [
    "binance",
    "gate",
    "kucoin",
    "okx",
    "bybit",
    "bitget",
    "mexc",
    "indodax",
];

/**
 * Alternate spellings accepted on the CLI, mapped to the lister slug. Gate's
 * CMC slug is `gate-io` but lister stores it as `gate`, so both work.
 */
const EXCHANGE_SLUG_ALIASES: Record<string, ExchangeSlug> = {
    "gate-io": "gate",
    "gate.io": "gate",
};

export function isExchangeSlug(value: string): value is ExchangeSlug {
    return (ALL_EXCHANGE_SLUGS as string[]).includes(value);
}

export function normalizeExchangeSlug(value: string): ExchangeSlug | undefined {
    const key = value.trim().toLowerCase();
    if (isExchangeSlug(key)) return key;
    return EXCHANGE_SLUG_ALIASES[key];
}

/**
 * Placeholder chain used when an exchange reports no usable network (Indodax)
 * or reports an empty label. Matches the placeholder `apps/cmc-collector`
 * links fresh markets to, so the two collectors agree on its identity.
 */
export const UNMAPPED_CHAIN = {
    name: "Unmapped Chain",
    code: "UNMPD",
} as const;

/* -------------------------------------------------------------------------- */
/* Exchange endpoints                                                         */
/* -------------------------------------------------------------------------- */

/** Binance's keyless web asset endpoint; returns every coin's `networkList`. */
export const BINANCE_NETWORK_URL =
    "https://www.binance.com/bapi/capital/v1/public/capital/getNetworkCoinAll";

/** Gate.io spot currency catalog, including each currency's `chains`. */
export const GATE_CURRENCIES_URL =
    "https://api.gateio.ws/api/v4/spot/currencies";

/** KuCoin currency catalog (keyless), each currency carries `chains`. */
export const KUCOIN_CURRENCIES_URL = "https://api.kucoin.com/api/v3/currencies";

/** MEXC wallet config — signed request; requires an API key pair. */
export const MEXC_WALLET_CONFIG_URL =
    "https://api.mexc.com/api/v3/capital/config/getall";

/** Indodax public pairs. Lists coins only, never their chains. */
export const INDODAX_PAIRS_URL = "https://indodax.com/api/pairs";

/* -------------------------------------------------------------------------- */
/* Environment + transport                                                    */
/* -------------------------------------------------------------------------- */

export const MEXC_API_KEY_ENV = "MEXC_API_KEY";
export const MEXC_API_SECRET_ENV = "MEXC_API_SECRET";

export const HTTP_TIMEOUT_MS = 30_000;

export const USER_AGENT =
    "arbitrator-chain-metadata-collector/0.1 (+https://github.com/arbitrator)";

export const SOURCE = "exchange-public-api" as const;
