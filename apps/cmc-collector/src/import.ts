import { lister } from "@arbitrator/sdk";

import { UNMAPPED_CHAIN } from "./config";
import type { Snapshot } from "./types";

/** Eden reports a failure as `{ status, value }`; render it readably. */
function formatEdenError(error: unknown): string {
    if (error && typeof error === "object" && "value" in error) {
        const value = (error as { value?: unknown }).value;
        if (value !== undefined && value !== null) {
            if (
                typeof value === "object" &&
                "message" in value &&
                typeof (value as { message?: unknown }).message === "string"
            ) {
                return (value as { message: string }).message;
            }
            return typeof value === "string" ? value : JSON.stringify(value);
        }
    }
    return String(error);
}

/**
 * Every lister call resolves to Eden's `{ data, error }` result. `must` unwraps
 * it and turns a failed call into a thrown error.
 */
type Outcome<T> = { data: T | null; error: unknown };

function must<T>(label: string, result: Outcome<T>): T {
    if (result.error) {
        throw new Error(`${label}: ${formatEdenError(result.error)}`);
    }
    if (result.data === null) {
        throw new Error(`${label}: lister returned no data`);
    }
    return result.data;
}

type ExchangeUpdatePayload = NonNullable<
    Parameters<ReturnType<typeof lister.exchange>["patch"]>[0]
>;
type CryptocurrencyUpdatePayload = NonNullable<
    Parameters<ReturnType<typeof lister.cryptocurrency>["patch"]>[0]
>;

export type ImportOptions = {
    /**
     * Delete markets that are no longer listed instead of merely disabling
     * trading. Off by default because deleting a market cascades its chain
     * links (withdraw/deposit assignments).
     */
    prune?: boolean;
    /** Log the diff without writing anything. */
    dryRun?: boolean;
    /**
     * Link imported markets that have no chain yet to the placeholder
     * `UNMPD` chain. Default true; markets that already have a real chain are
     * left alone.
     */
    unmappedChain?: boolean;
};

export type ImportSummary = {
    dryRun: boolean;
    exchanges: { created: number; updated: number };
    cryptocurrencies: { created: number; updated: number };
    markets: {
        created: number;
        updated: number;
        disabled: number;
        removed: number;
    };
    chainLinks: { created: number };
    warnings: string[];
};

const marketKey = (exchangeId: number, cryptocurrencyId: number) =>
    `${exchangeId}:${cryptocurrencyId}`;

function warn(summary: ImportSummary, message: string): void {
    summary.warnings.push(message);
    console.warn(`warn: ${message}`);
}

/** Confirm the lister service is reachable before doing any work. */
export async function pingLister(): Promise<void> {
    must("ping lister", await lister.utility.ping.get());
}

/**
 * Reconcile a locally scraped snapshot into the lister through its HTTP API.
 *
 * The snapshot is the source of truth for the exchanges it covers:
 * - missing exchanges/coins are created;
 * - renamed exchanges, changed logos and changed CMC ids are updated;
 * - market assignments are created, and their `exchangeSymbol` is corrected
 *   when the exchange renamed a ticker;
 * - markets that disappeared from the exchange are marked `tradeEnabled:false`
 *   (the collector's interpretation of "delisted"), or deleted with `--prune`;
 * - markets with no chain link get the placeholder `UNMPD` chain so routes can
 *   be built before real chains are mapped.
 *
 * Exchanges absent from the snapshot are left untouched, so manually managed
 * venues (and their coins) are never removed by an import.
 */
export async function importSnapshot(
    snapshot: Snapshot,
    options: ImportOptions = {},
): Promise<ImportSummary> {
    const { prune = false, dryRun = false, unmappedChain = true } = options;

    const summary: ImportSummary = {
        dryRun,
        exchanges: { created: 0, updated: 0 },
        cryptocurrencies: { created: 0, updated: 0 },
        markets: { created: 0, updated: 0, disabled: 0, removed: 0 },
        chainLinks: { created: 0 },
        warnings: [],
    };

    const affectedExchangeIds = new Set<number>();

    // Dry-runs never insert rows, so newly planned rows get negative synthetic
    // ids to keep the rest of the reconciliation coherent.
    let syntheticId = -1;

    // ---------------------------------------------------------------- exchange
    const existingExchanges = must(
        "list exchanges",
        await lister.exchange.get({ query: { limit: -1 } }),
    ).data;
    const exchangeByCmcId = new Map(existingExchanges.map((e) => [e.cmcId, e]));
    const exchangeBySlug = new Map(existingExchanges.map((e) => [e.slug, e]));
    const exchangeIdBySlug = new Map<string, number>();

    for (const record of snapshot.exchanges) {
        const existing =
            exchangeByCmcId.get(record.cmcId) ??
            exchangeBySlug.get(record.slug);

        if (!existing) {
            console.log(`+ exchange ${record.slug} (cmc:${record.cmcId})`);
            if (dryRun) {
                exchangeIdBySlug.set(record.slug, syntheticId--);
            } else {
                const created = must(
                    `add exchange ${record.slug}`,
                    await lister.exchange.post({
                        cmcId: record.cmcId,
                        name: record.name,
                        slug: record.slug,
                        logo: record.logo,
                        registeredOnCmc: true,
                        baseCurrency: record.baseCurrency,
                    }),
                );
                exchangeIdBySlug.set(created.slug, created.id);
                affectedExchangeIds.add(created.id);
            }
            summary.exchanges.created += 1;
            continue;
        }

        exchangeIdBySlug.set(record.slug, existing.id);
        affectedExchangeIds.add(existing.id);

        const changes: ExchangeUpdatePayload = {};
        if (existing.name !== record.name) changes.name = record.name;
        if (existing.slug !== record.slug) changes.slug = record.slug;
        if (existing.logo !== record.logo) changes.logo = record.logo;
        if (existing.cmcId !== record.cmcId) changes.cmcId = record.cmcId;
        if (existing.baseCurrency !== record.baseCurrency) {
            changes.baseCurrency = record.baseCurrency;
        }

        if (Object.keys(changes).length > 0) {
            console.log(
                `~ exchange ${record.slug} (${Object.keys(changes).join(", ")})`,
            );
            if (!dryRun) {
                must(
                    `update exchange ${record.slug}`,
                    await lister.exchange({ id: existing.id }).patch(changes),
                );
            }
            summary.exchanges.updated += 1;
        }
    }

    // --------------------------------------------------------- cryptocurrency
    const existingCoins = must(
        "list cryptocurrencies",
        await lister.cryptocurrency.get({ query: { limit: -1 } }),
    ).data;
    const coinByCmcId = new Map(
        existingCoins.map((coin) => [coin.cmcId, coin]),
    );
    const coinBySlug = new Map(existingCoins.map((coin) => [coin.slug, coin]));
    const coinIdByCmcId = new Map<number, number>();

    for (const record of snapshot.cryptocurrencies) {
        const existing =
            coinByCmcId.get(record.cmcId) ?? coinBySlug.get(record.slug);

        if (!existing) {
            console.log(
                `+ cryptocurrency ${record.slug} (cmc:${record.cmcId})`,
            );
            if (dryRun) {
                coinIdByCmcId.set(record.cmcId, syntheticId--);
            } else {
                const created = must(
                    `add cryptocurrency ${record.slug}`,
                    await lister.cryptocurrency.post({
                        cmcId: record.cmcId,
                        name: record.name,
                        symbol: record.symbol,
                        slug: record.slug,
                        logo: record.logo,
                    }),
                );
                coinIdByCmcId.set(created.cmcId, created.id);
            }
            summary.cryptocurrencies.created += 1;
            continue;
        }

        coinIdByCmcId.set(record.cmcId, existing.id);

        const changes: CryptocurrencyUpdatePayload = {};
        if (existing.name !== record.name) changes.name = record.name;
        if (existing.symbol !== record.symbol) changes.symbol = record.symbol;
        if (existing.slug !== record.slug) changes.slug = record.slug;
        if (existing.cmcId !== record.cmcId) changes.cmcId = record.cmcId;

        if (Object.keys(changes).length > 0) {
            console.log(
                `~ cryptocurrency ${record.slug} (${Object.keys(changes).join(", ")})`,
            );
            if (!dryRun) {
                must(
                    `update cryptocurrency ${record.slug}`,
                    await lister
                        .cryptocurrency({ id: existing.id })
                        .patch(changes),
                );
            }
            summary.cryptocurrencies.updated += 1;
        }
    }

    // ----------------------------------------------------------------- market
    const managedExchangeIds = new Set(exchangeIdBySlug.values());
    const allMarkets = must(
        "list markets",
        await lister.market.get({ query: {} }),
    );
    const dbMarketByKey = new Map(
        allMarkets
            .filter((row) => managedExchangeIds.has(row.exchangeId))
            .map((row) => [
                marketKey(row.exchangeId, row.cryptocurrencyId),
                row,
            ]),
    );

    const wanted = new Set<string>();
    const marketIdByKey = new Map<string, number>();

    for (const record of snapshot.markets) {
        const exchangeId = exchangeIdBySlug.get(record.exchangeSlug);
        if (!exchangeId) {
            warn(summary, `unknown exchange ${record.exchangeSlug}`);
            continue;
        }

        const cryptocurrencyId = coinIdByCmcId.get(record.cryptocurrencyCmcId);
        if (!cryptocurrencyId) {
            warn(
                summary,
                `unknown cryptocurrency cmc:${record.cryptocurrencyCmcId} for ${record.exchangeSlug}`,
            );
            continue;
        }

        const key = marketKey(exchangeId, cryptocurrencyId);
        wanted.add(key);

        const existing = dbMarketByKey.get(key);
        if (!existing) {
            console.log(
                `+ market ${record.exchangeSlug} ${record.exchangeSymbol} (cmc:${record.cryptocurrencyCmcId})`,
            );
            if (dryRun) {
                marketIdByKey.set(key, syntheticId--);
            } else {
                const created = must(
                    `assign market ${record.exchangeSlug} ${record.exchangeSymbol}`,
                    await lister.market.assign.post({
                        exchangeId,
                        cryptocurrencyId,
                        exchangeSymbol: record.exchangeSymbol,
                        tradeEnabled: record.tradeEnabled,
                    }),
                );
                marketIdByKey.set(key, created.id);
            }
            summary.markets.created += 1;
            continue;
        }

        marketIdByKey.set(key, existing.id);

        const changes: {
            exchangeSymbol?: string;
            tradeEnabled?: boolean;
        } = {};
        if (existing.exchangeSymbol !== record.exchangeSymbol) {
            changes.exchangeSymbol = record.exchangeSymbol;
        }
        if (existing.tradeEnabled !== record.tradeEnabled) {
            changes.tradeEnabled = record.tradeEnabled;
        }

        if (Object.keys(changes).length > 0) {
            console.log(
                `~ market ${record.exchangeSlug} ${existing.exchangeSymbol} -> ${record.exchangeSymbol}`,
            );
            if (!dryRun) {
                must(
                    `update market ${record.exchangeSlug} ${record.exchangeSymbol}`,
                    await lister.market.patch({
                        exchangeId,
                        cryptocurrencyId,
                        ...changes,
                    }),
                );
            }
            summary.markets.updated += 1;
        }
    }

    // Markets present in lister but gone from the exchange's snapshot.
    for (const [key, row] of dbMarketByKey) {
        if (wanted.has(key)) continue;

        if (prune) {
            console.log(
                `- market ${row.exchangeId}/${row.cryptocurrencyId} (${row.exchangeSymbol})`,
            );
            if (!dryRun) {
                must(
                    `unassign market ${row.exchangeId}/${row.cryptocurrencyId}`,
                    await lister.market.unassign.post({
                        exchangeId: row.exchangeId,
                        cryptocurrencyId: row.cryptocurrencyId,
                    }),
                );
            }
            summary.markets.removed += 1;
            continue;
        }

        if (row.tradeEnabled) {
            console.log(
                `x market ${row.exchangeId}/${row.cryptocurrencyId} (${row.exchangeSymbol}) delisted`,
            );
            if (!dryRun) {
                must(
                    `disable market ${row.exchangeId}/${row.cryptocurrencyId}`,
                    await lister.market.patch({
                        exchangeId: row.exchangeId,
                        cryptocurrencyId: row.cryptocurrencyId,
                        tradeEnabled: false,
                    }),
                );
            }
            summary.markets.disabled += 1;
        }
    }

    // -------------------------------------------------------------- chain link
    if (unmappedChain && wanted.size > 0) {
        const unmappedChainId = await ensureUnmappedChain(dryRun);

        if (unmappedChainId !== undefined) {
            const existingLinks = must(
                "list chain links",
                await lister["chain-link"].get({ query: {} }),
            );
            const linkedMarketIds = new Set(
                existingLinks.map((link) => link.marketId),
            );

            for (const key of wanted) {
                const marketId = marketIdByKey.get(key);
                if (marketId === undefined) continue;
                if (linkedMarketIds.has(marketId)) continue;

                console.log(
                    `+ chain link ${UNMAPPED_CHAIN.code} -> market ${marketId}`,
                );
                if (!dryRun) {
                    must(
                        `add chain link for market ${marketId}`,
                        await lister["chain-link"].post({
                            marketId,
                            chainId: unmappedChainId,
                            withdrawEnabled: true,
                            depositEnabled: true,
                        }),
                    );
                }
                summary.chainLinks.created += 1;
            }
        }
    }

    return summary;
}

/**
 * Return the placeholder chain's id, creating it if needed. In a dry-run the
 * chain is not created; a synthetic id is returned instead.
 */
async function ensureUnmappedChain(
    dryRun: boolean,
): Promise<number | undefined> {
    const chains = must(
        "list chains",
        await lister.chain.get({ query: { limit: -1 } }),
    ).data;
    const existing = chains.find((chain) => chain.code === UNMAPPED_CHAIN.code);
    if (existing) return existing.id;
    if (dryRun) return -1;

    const created = must(
        `add chain ${UNMAPPED_CHAIN.code}`,
        await lister.chain.post({
            name: UNMAPPED_CHAIN.name,
            code: UNMAPPED_CHAIN.code,
        }),
    );
    return created.id;
}
