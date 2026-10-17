import { resolveChain } from "./chains";
import { DEFAULT_EXCHANGES, type ExchangeSlug, SOURCE } from "./config";
import { getAdapter } from "./exchanges";
import { MissingCredentialsError } from "./exchanges/types";
import { formatError } from "./http";
import type { ExchangeScrapeResult, NetworkSnapshot, Snapshot } from "./types";

export type ScrapeOptions = {
    /** Restrict the crawl to these venues. Defaults to `DEFAULT_EXCHANGES`. */
    only?: ExchangeSlug[];
    /**
     * Resolve exchange labels through the canonical alias map. On by default;
     * `false` keeps each venue's raw naming untouched (all rows `unmapped`).
     */
    canonicalize?: boolean;
};

/**
 * Crawl every target exchange's own API and normalize the result into one
 * snapshot of `(exchange, coin, network, flags)` rows.
 *
 * A venue that errors or needs credentials is recorded in `exchanges` with a
 * `skipped`/`error` status and its rows are omitted; a single broken venue never
 * fails the whole scrape.
 */
export async function scrape(options: ScrapeOptions = {}): Promise<Snapshot> {
    const canonicalize = options.canonicalize ?? true;
    const slugs = options.only?.length ? options.only : DEFAULT_EXCHANGES;

    const networks: NetworkSnapshot[] = [];
    const exchanges: ExchangeScrapeResult[] = [];

    for (const slug of slugs) {
        const adapter = getAdapter(slug);
        process.stdout.write(`scraping ${adapter.label}... `);

        try {
            const raw = await adapter.fetchNetworks();
            const coins = new Set<string>();

            for (const entry of raw) {
                coins.add(entry.exchangeSymbol);
                const resolved = resolveChain(
                    entry.network,
                    entry.networkHint,
                    canonicalize,
                );

                networks.push({
                    exchangeSlug: slug,
                    exchangeSymbol: entry.exchangeSymbol,
                    coinName: entry.coinName,
                    network: entry.network,
                    networkHint: entry.networkHint,
                    chainCode: resolved.code,
                    chainName: resolved.name,
                    depositEnabled: entry.depositEnabled,
                    withdrawEnabled: entry.withdrawEnabled,
                    contractAddress: entry.contractAddress,
                    unmapped: !resolved.canonical,
                    unknown: !adapter.reportsChains,
                });
            }

            exchanges.push({
                slug,
                label: adapter.label,
                status: "ok",
                coins: coins.size,
                networks: raw.length,
            });

            console.log(`${coins.size} coins, ${raw.length} networks`);
        } catch (error) {
            const skipped = error instanceof MissingCredentialsError;
            const message = formatError(error);

            exchanges.push({
                slug,
                label: adapter.label,
                status: skipped ? "skipped" : "error",
                coins: 0,
                networks: 0,
                message,
            });

            console.log(
                skipped ? `skipped (${message})` : `failed (${message})`,
            );
        }
    }

    return {
        scrapedAt: new Date().toISOString(),
        source: SOURCE,
        exchanges,
        networks,
    };
}
