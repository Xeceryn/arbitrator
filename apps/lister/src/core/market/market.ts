import { and, count, eq, inArray } from "drizzle-orm";

import { database } from "../../database/connection";
import { chainLink } from "../chain-link/chain-link.sql";
import { cryptocurrency } from "../cryptocurrency/cryptocurrency.sql";
import { exchange } from "../exchange/exchange.sql";
import type { MarketFilterExists, MarketSelect } from "./market.schema";
import { market } from "./market.sql";
import type {
    MarketUpdatePayload,
    MarketWithRelations,
    TransferableCoins,
    TransferableRoute,
    TransferableSubscription,
} from "./market.type";

/**
 * Return the first chain on which `a` can withdraw into `b` and/or `b` can
 * withdraw into `a`. One direction is enough; same chain is required.
 */
function findTransferableChain(
    aLinks: ReadonlyArray<{
        chainId: number;
        withdrawEnabled: boolean;
        depositEnabled: boolean;
    }>,
    bLinks: ReadonlyArray<{
        chainId: number;
        withdrawEnabled: boolean;
        depositEnabled: boolean;
    }>,
): number | undefined {
    const aByChain = new Map(aLinks.map((link) => [link.chainId, link]));

    for (const b of bLinks) {
        const a = aByChain.get(b.chainId);
        if (!a) continue;

        const aToB = a.withdrawEnabled && b.depositEnabled;
        const bToA = b.withdrawEnabled && a.depositEnabled;
        if (aToB || bToA) return b.chainId;
    }

    return undefined;
}

function addSubscription(
    map: Map<string, TransferableSubscription>,
    exchangeId: number,
    cmcId: number,
    symbol: string,
) {
    const key = `${exchangeId}:${cmcId}`;
    if (!map.has(key)) {
        map.set(key, { exchangeId, cmcId, symbol });
    }
}

export namespace Market {
    export async function exists(filter: MarketFilterExists): Promise<boolean> {
        const result = await database
            .select({ count: count() })
            .from(market)
            .where(
                and(
                    eq(market.exchangeId, filter.exchangeId),
                    eq(market.cryptocurrencyId, filter.cryptocurrencyId),
                ),
            )
            .execute();

        return !!result[0]?.count;
    }

    export async function getAll(filter?: {
        exchangeId?: number;
        cryptocurrencyId?: number;
    }): Promise<MarketSelect[]> {
        if (filter) {
            const conditions = [];
            if (filter.exchangeId) {
                conditions.push(eq(market.exchangeId, filter.exchangeId));
            }
            if (filter.cryptocurrencyId) {
                conditions.push(
                    eq(market.cryptocurrencyId, filter.cryptocurrencyId),
                );
            }
            if (conditions.length > 0) {
                return await database
                    .select()
                    .from(market)
                    .where(and(...conditions))
                    .execute();
            }
        }

        return await database.select().from(market).execute();
    }

    /**
     * Markets with their exchange and cryptocurrency embedded. This is the
     * assignment read-model for both directions (filter by either side).
     */
    export async function getAllWithRelations(filter?: {
        exchangeId?: number;
        cryptocurrencyId?: number;
    }): Promise<MarketWithRelations[]> {
        const where: { exchangeId?: number; cryptocurrencyId?: number } = {};
        if (filter?.exchangeId) where.exchangeId = filter.exchangeId;
        if (filter?.cryptocurrencyId) {
            where.cryptocurrencyId = filter.cryptocurrencyId;
        }

        const rows = await database.query.market.findMany({
            where: Object.keys(where).length > 0 ? where : undefined,
            with: { exchange: true, cryptocurrency: true },
            orderBy: { id: "asc" },
        });

        return rows.map((row) => ({
            ...row,
            exchange: row.exchange!,
            cryptocurrency: row.cryptocurrency!,
        }));
    }

    /** Update the editable fields of a (exchange, coin) assignment. */
    export async function update(
        filter: MarketFilterExists,
        payload: Partial<MarketUpdatePayload>,
    ): Promise<MarketSelect | undefined> {
        const values: Partial<
            Pick<MarketSelect, "tradeEnabled" | "exchangeSymbol">
        > = {};
        if (payload.tradeEnabled !== undefined) {
            values.tradeEnabled = payload.tradeEnabled;
        }
        if (payload.exchangeSymbol !== undefined) {
            values.exchangeSymbol = payload.exchangeSymbol;
        }

        const where = and(
            eq(market.exchangeId, filter.exchangeId),
            eq(market.cryptocurrencyId, filter.cryptocurrencyId),
        );

        // Nothing to change: return the current row rather than an empty UPDATE.
        if (Object.keys(values).length === 0) {
            return await database
                .select()
                .from(market)
                .where(where)
                .limit(1)
                .then((result) => result.at(0));
        }

        return await database
            .update(market)
            .set(values)
            .where(where)
            .returning()
            .then((result) => result.at(0));
    }

    /**
     * Directed transferability read-model for the sender orchestrator. For each
     * unordered pair of the given exchanges that shares a coin and can move it on
     * some chain in at least one direction, both legs are returned as
     * subscriptions.
     */
    export async function listTransferableCoins(
        exchangeIds: number[],
    ): Promise<TransferableCoins> {
        if (exchangeIds.length < 2) {
            return { exchanges: [], subscriptions: [], routes: [] };
        }

        const markets = await database
            .select()
            .from(market)
            .where(inArray(market.exchangeId, exchangeIds))
            .orderBy(market.id);

        if (markets.length === 0) {
            return { exchanges: [], subscriptions: [], routes: [] };
        }

        const marketIds = markets.map((item) => item.id);
        const links = await database
            .select()
            .from(chainLink)
            .where(inArray(chainLink.marketId, marketIds));

        const exchangeRows = await database
            .select()
            .from(exchange)
            .where(inArray(exchange.id, exchangeIds));

        const cryptocurrencyIds = [
            ...new Set(markets.map((item) => item.cryptocurrencyId)),
        ];
        const cryptocurrencyRows = await database
            .select()
            .from(cryptocurrency)
            .where(inArray(cryptocurrency.id, cryptocurrencyIds));

        const exchangeById = new Map(exchangeRows.map((row) => [row.id, row]));
        const cryptocurrencyById = new Map(
            cryptocurrencyRows.map((row) => [row.id, row]),
        );

        const linksByMarket = new Map<number, typeof links>();
        for (const link of links) {
            const bucket = linksByMarket.get(link.marketId) ?? [];
            bucket.push(link);
            linksByMarket.set(link.marketId, bucket);
        }

        const byCryptocurrency = new Map<number, typeof markets>();
        for (const item of markets) {
            const bucket = byCryptocurrency.get(item.cryptocurrencyId) ?? [];
            bucket.push(item);
            byCryptocurrency.set(item.cryptocurrencyId, bucket);
        }

        const subscriptions = new Map<string, TransferableSubscription>();
        const routes: TransferableRoute[] = [];

        for (const [cryptocurrencyId, group] of byCryptocurrency) {
            const coin = cryptocurrencyById.get(cryptocurrencyId);
            if (!coin) continue;

            for (let i = 0; i < group.length; i += 1) {
                for (let j = i + 1; j < group.length; j += 1) {
                    const a = group[i]!;
                    const b = group[j]!;

                    if (a.exchangeId === b.exchangeId) continue;
                    if (!a.tradeEnabled || !b.tradeEnabled) continue;

                    const chainId = findTransferableChain(
                        linksByMarket.get(a.id) ?? [],
                        linksByMarket.get(b.id) ?? [],
                    );
                    if (chainId === undefined) continue;

                    addSubscription(
                        subscriptions,
                        a.exchangeId,
                        coin.cmcId,
                        a.exchangeSymbol,
                    );
                    addSubscription(
                        subscriptions,
                        b.exchangeId,
                        coin.cmcId,
                        b.exchangeSymbol,
                    );

                    routes.push({
                        aExchangeId: a.exchangeId,
                        bExchangeId: b.exchangeId,
                        cmcId: coin.cmcId,
                        chainId,
                    });
                }
            }
        }

        const presentExchangeIds = new Set(
            markets.map((item) => item.exchangeId),
        );
        const exchanges = [...presentExchangeIds].flatMap((id) => {
            const row = exchangeById.get(id);
            return row
                ? [
                      {
                          id: row.id,
                          slug: row.slug,
                          baseCurrency: row.baseCurrency,
                      },
                  ]
                : [];
        });

        return {
            exchanges,
            subscriptions: [...subscriptions.values()],
            routes,
        };
    }

    export async function getById(
        id: number,
    ): Promise<MarketSelect | undefined> {
        const result = await database
            .select()
            .from(market)
            .where(eq(market.id, id))
            .limit(1)
            .execute();

        return result[0];
    }

    export async function countExchangeCryptocurrencies(exchangeId: number) {
        const result = await database
            .select({ count: count() })
            .from(market)
            .where(eq(market.exchangeId, exchangeId))
            .execute();

        return result[0]!.count;
    }
}
