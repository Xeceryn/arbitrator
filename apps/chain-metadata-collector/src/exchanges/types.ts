import type { ExchangeSlug } from "../config";
import type { RawCoinNetwork } from "../types";

/**
 * A per-exchange crawler for coin → chain metadata.
 *
 * `reportsChains` is false for venues whose public API only lists tradable
 * coins (Indodax). Those adapters still emit one entry per coin but with an
 * empty network; the scrape marks them `unknown` and the importer keeps them on
 * the `UNMPD` placeholder chain.
 */
export type ExchangeAdapter = {
    slug: ExchangeSlug;
    label: string;
    reportsChains: boolean;
    fetchNetworks(): Promise<RawCoinNetwork[]>;
};

/** Thrown when an adapter needs credentials that were not provided. */
export class MissingCredentialsError extends Error {
    constructor(exchange: string, keys: string) {
        super(`${exchange}: requires ${keys}`);
        this.name = "MissingCredentialsError";
    }
}
