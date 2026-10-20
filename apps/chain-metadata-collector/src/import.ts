import { lister } from "@arbitrator/sdk";

import { UNMAPPED_CHAIN } from "./config";
import { must } from "./lister";
import type { Snapshot } from "./types";

export type ImportOptions = {
    /** Log the diff without writing anything. */
    dryRun?: boolean;
    /**
     * Remove a market's placeholder `UNMPD` link once the snapshot gives it a
     * real chain link via `--replace-unmapped`. **Default false**: the
     * placeholder is the operator's "not yet verified" marker and is removed by
     * hand, because only they can decide whether two venues settle on the same
     * network (e.g. Indodax, which publishes no chain data).
     */
    replaceUnmapped?: boolean;
    /** Restrict the import to these exchange slugs. */
    only?: string[];
};

export type ImportSummary = {
    dryRun: boolean;
    chains: { created: number; reused: number };
    links: { created: number; updated: number; unchanged: number };
    unmappedRemoved: number;
    skipped: { exchange: number; market: number };
    warnings: string[];
};

/** Confirm the lister service is reachable before doing any work. */
/**
 * Reconcile a scraped snapshot into lister's chain + chain_link tables.
 *
 * For every `(exchange, coin, network)` row:
 * - the exchange is matched by slug and the market by `exchangeSymbol`
 *   (falling back to the coin's canonical symbol);
 * - the chain is matched by code, or created from the exchange's (possibly
 *   unmapped) label;
 * - the chain link is created, or its withdraw/deposit flags updated.
 *
 * Markets with no matching exchange/market row are counted and skipped — an
 * exchange lists far more coins than lister tracks. When a market gains a real
 * chain link and `replaceUnmapped` is on, its `UNMPD` placeholder link is
 * removed, completing the manual step the operator used to do by hand.
 *
 * Nothing is ever deleted except the `UNMPD` placeholder, so chains the operator
 * mapped manually are never clobbered.
 */
export async function importSnapshot(
    snapshot: Snapshot,
    options: ImportOptions = {},
): Promise<ImportSummary> {
    const { dryRun = false, replaceUnmapped = false } = options;
    const only =
        options.only && options.only.length > 0
            ? new Set(options.only)
            : undefined;

    const summary: ImportSummary = {
        dryRun,
        chains: { created: 0, reused: 0 },
        links: { created: 0, updated: 0, unchanged: 0 },
        unmappedRemoved: 0,
        skipped: { exchange: 0, market: 0 },
        warnings: [],
    };

    let warningBudget = 25;
    const warn = (message: string): void => {
        summary.warnings.push(message);
        if (warningBudget > 0) {
            warningBudget -= 1;
            console.warn(`warn: ${message}`);
        }
    };

    const exchanges = must(
        "list exchanges",
        await lister.exchange.get({ query: { limit: -1 } }),
    ).data;
    const exchangeBySlug = new Map(exchanges.map((e) => [e.slug, e]));

    const cryptocurrencies = must(
        "list cryptocurrencies",
        await lister.cryptocurrency.get({ query: { limit: -1 } }),
    ).data;
    const coinById = new Map(cryptocurrencies.map((c) => [c.id, c]));

    const markets = must(
        "list markets",
        await lister.market.get({ query: {} }),
    );
    const marketByExchangeSymbol = new Map<string, (typeof markets)[number]>();
    const marketByCoinSymbol = new Map<string, (typeof markets)[number]>();
    for (const market of markets) {
        marketByExchangeSymbol.set(
            `${market.exchangeId}:${market.exchangeSymbol.toUpperCase()}`,
            market,
        );
        const coin = coinById.get(market.cryptocurrencyId);
        if (coin) {
            marketByCoinSymbol.set(
                `${market.exchangeId}:${coin.symbol.toUpperCase()}`,
                market,
            );
        }
    }

    const chains = must(
        "list chains",
        await lister.chain.get({ query: { limit: -1 } }),
    ).data;
    const chainIdByCode = new Map<string, number>(
        chains.map((chain) => [chain.code.toUpperCase(), chain.id]),
    );
    const unmappedChainId = chainIdByCode.get(
        UNMAPPED_CHAIN.code.toUpperCase(),
    );

    const links = must(
        "list chain links",
        await lister["chain-link"].get({ query: {} }),
    );
    const linkByMarketChain = new Map<string, (typeof links)[number]>();
    const unmappedLinksByMarket = new Map<
        number,
        Array<(typeof links)[number]>
    >();
    for (const link of links) {
        linkByMarketChain.set(`${link.marketId}:${link.chainId}`, link);
        if (unmappedChainId !== undefined && link.chainId === unmappedChainId) {
            const bucket = unmappedLinksByMarket.get(link.marketId) ?? [];
            bucket.push(link);
            unmappedLinksByMarket.set(link.marketId, bucket);
        }
    }

    const createdChainCodes = new Set<string>();
    const referencedChainCodes = new Set<string>();
    let syntheticId = -1;

    const ensureChain = async (code: string, name: string): Promise<number> => {
        const key = code.toUpperCase();
        referencedChainCodes.add(key);

        const existing = chainIdByCode.get(key);
        if (existing !== undefined) return existing;

        createdChainCodes.add(key);

        if (dryRun) {
            const id = syntheticId--;
            chainIdByCode.set(key, id);
            console.log(`+ chain ${code} (${name})`);
            return id;
        }

        const created = must(
            `add chain ${code}`,
            await lister.chain.post({ name, code }),
        );
        chainIdByCode.set(created.code.toUpperCase(), created.id);
        console.log(`+ chain ${created.code} (${created.name})`);
        return created.id;
    };

    const realLinkedMarketIds = new Set<number>();

    for (const row of snapshot.networks) {
        if (only && !only.has(row.exchangeSlug)) continue;

        const exchange = exchangeBySlug.get(row.exchangeSlug);
        if (!exchange) {
            summary.skipped.exchange += 1;
            warn(
                `exchange not in lister: ${row.exchangeSlug} (${row.exchangeSymbol} ${row.chainCode})`,
            );
            continue;
        }

        const lookupKey = `${exchange.id}:${row.exchangeSymbol.toUpperCase()}`;
        const market =
            marketByExchangeSymbol.get(lookupKey) ??
            marketByCoinSymbol.get(lookupKey);
        if (!market) {
            summary.skipped.market += 1;
            continue;
        }

        const chainId = await ensureChain(row.chainCode, row.chainName);
        const linkKey = `${market.id}:${chainId}`;
        const existing = linkByMarketChain.get(linkKey);

        if (!existing) {
            console.log(
                `+ link ${row.exchangeSlug} ${row.exchangeSymbol} -> ${row.chainCode} (dep:${row.depositEnabled} wd:${row.withdrawEnabled})`,
            );
            if (!dryRun) {
                const created = must(
                    `add chain link ${row.exchangeSlug} ${row.exchangeSymbol} ${row.chainCode}`,
                    await lister["chain-link"].post({
                        marketId: market.id,
                        chainId,
                        withdrawEnabled: row.withdrawEnabled,
                        depositEnabled: row.depositEnabled,
                    }),
                );
                linkByMarketChain.set(linkKey, created);
            }
            summary.links.created += 1;
        } else {
            const changes: {
                withdrawEnabled?: boolean;
                depositEnabled?: boolean;
            } = {};
            if (existing.withdrawEnabled !== row.withdrawEnabled) {
                changes.withdrawEnabled = row.withdrawEnabled;
            }
            if (existing.depositEnabled !== row.depositEnabled) {
                changes.depositEnabled = row.depositEnabled;
            }

            if (Object.keys(changes).length > 0) {
                console.log(
                    `~ link ${row.exchangeSlug} ${row.exchangeSymbol} -> ${row.chainCode} (${Object.keys(changes).join(", ")})`,
                );
                if (!dryRun) {
                    must(
                        `update chain link ${existing.id}`,
                        await lister["chain-link"]({ id: existing.id }).patch(
                            changes,
                        ),
                    );
                }
                summary.links.updated += 1;
            } else {
                summary.links.unchanged += 1;
            }
        }

        if (row.chainCode.toUpperCase() !== UNMAPPED_CHAIN.code.toUpperCase()) {
            realLinkedMarketIds.add(market.id);
        }
    }

    if (replaceUnmapped && unmappedChainId !== undefined) {
        for (const marketId of realLinkedMarketIds) {
            for (const link of unmappedLinksByMarket.get(marketId) ?? []) {
                console.log(
                    `- unlink ${UNMAPPED_CHAIN.code} from market ${marketId}`,
                );
                if (!dryRun) {
                    must(
                        `remove chain link ${link.id}`,
                        await lister["chain-link"]({ id: link.id }).delete(),
                    );
                }
                summary.unmappedRemoved += 1;
            }
        }
    }

    summary.chains.created = createdChainCodes.size;
    summary.chains.reused = referencedChainCodes.size - createdChainCodes.size;

    return summary;
}
