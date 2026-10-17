import type { ExchangeSlug, SOURCE } from "./config";

/**
 * One coin-on-a-chain as reported by an exchange, before canonicalization.
 * Produced by the adapters in `src/exchanges/`.
 */
export type RawCoinNetwork = {
    /** Exchange-reported coin ticker, e.g. Binance `1000SATS`. */
    exchangeSymbol: string;
    /** Exchange-reported coin name, when the venue provides one. */
    coinName?: string;
    /** Raw network label exactly as the exchange spells it. `""` = unknown. */
    network: string;
    /** A second, machine-friendly hint (e.g. KuCoin `chainId`). */
    networkHint?: string;
    depositEnabled: boolean;
    withdrawEnabled: boolean;
    contractAddress?: string;
};

/** Manifest row: per-exchange outcome of one scrape. */
export type ExchangeScrapeResult = {
    slug: string;
    label: string;
    status: "ok" | "skipped" | "error";
    coins: number;
    networks: number;
    message?: string;
};

/**
 * A normalized coin-chain entry ready to be written to lister as a chain link.
 *
 * `chainCode`/`chainName` are what the importer will create if the chain does
 * not already exist. When the exchange label matched the canonical alias map,
 * `unmapped` is false; otherwise the raw label is kept as-is and `unmapped`
 * is true so the operator can merge/rename it later.
 */
export type NetworkSnapshot = {
    exchangeSlug: ExchangeSlug;
    exchangeSymbol: string;
    coinName?: string;
    /** Raw exchange network label (`""` when the exchange reports none). */
    network: string;
    /** Machine-friendly companion id from the adapter (e.g. KuCoin `chainId`). */
    networkHint?: string;
    chainCode: string;
    chainName: string;
    depositEnabled: boolean;
    withdrawEnabled: boolean;
    contractAddress?: string;
    /** True when the label did not resolve through the canonical alias map. */
    unmapped: boolean;
    /** True when the exchange cannot report chains at all (e.g. Indodax). */
    unknown: boolean;
};

/** The full local snapshot written by `--scrape` and read by `--import`. */
export type Snapshot = {
    scrapedAt: string;
    source: typeof SOURCE;
    exchanges: ExchangeScrapeResult[];
    networks: NetworkSnapshot[];
};
