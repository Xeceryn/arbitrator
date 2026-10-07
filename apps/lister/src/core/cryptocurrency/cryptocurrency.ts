import { count, eq } from "drizzle-orm";

import { paginate } from "../../common/pagination";
import { database } from "../../database/connection";
import { cryptocurrency } from "./cryptocurrency.sql";
import type {
    CryptocurrencySelect,
    CryptocurrencyInsert,
    CryptocurrencyUpdate,
    CryptocurrencyRoute,
    CryptocurrencyRoutes,
    ListCryptocurrencyInput,
    PaginatedCryptocurrencyList,
} from "./cryptocurrency.type";
import { logger } from "@arbitrator/logger";

export namespace Cryptocurrency {
    export async function list(
        input: ListCryptocurrencyInput,
    ): Promise<PaginatedCryptocurrencyList> {
        return paginate({ table: cryptocurrency, input });
    }

    /**
     * Transfer routes for one coin, as a matrix-friendly read-model. A directed
     * route exists when the same chain is withdraw-enabled on one of the coin's
     * markets and deposit-enabled on another, i.e. the coin can move between
     * those exchanges on that chain.
     */
    export async function listRoutes(
        cryptocurrencyId: number,
    ): Promise<CryptocurrencyRoutes> {
        const markets = await database.query.market.findMany({
            where: { cryptocurrencyId },
            with: { exchange: true, chainLinks: { with: { chain: true } } },
            orderBy: { id: "asc" },
        });

        type CoinMarket = (typeof markets)[number];

        const exchanges = markets.flatMap((market) =>
            market.exchange
                ? [
                      {
                          marketId: market.id,
                          exchange: market.exchange,
                          tradeEnabled: market.tradeEnabled,
                      },
                  ]
                : [],
        );

        // For each chain, the markets that can move this coin in or out on it.
        const withdrawers = new Map<number, CoinMarket[]>();
        const depositors = new Map<number, CoinMarket[]>();

        for (const market of markets) {
            for (const link of market.chainLinks) {
                if (link.withdrawEnabled) {
                    const bucket = withdrawers.get(link.chainId) ?? [];
                    bucket.push(market);
                    withdrawers.set(link.chainId, bucket);
                }
                if (link.depositEnabled) {
                    const bucket = depositors.get(link.chainId) ?? [];
                    bucket.push(market);
                    depositors.set(link.chainId, bucket);
                }
            }
        }

        const routes: CryptocurrencyRoute[] = [];
        for (const [chainId, fromMarkets] of withdrawers) {
            for (const from of fromMarkets) {
                const link = from.chainLinks.find((l) => l.chainId === chainId);
                if (!link?.chain || !from.exchange) continue;

                for (const to of depositors.get(chainId) ?? []) {
                    if (to.id === from.id || !to.exchange) continue;

                    routes.push({
                        chain: link.chain,
                        from: {
                            marketId: from.id,
                            exchange: from.exchange,
                            tradeEnabled: from.tradeEnabled,
                        },
                        to: {
                            marketId: to.id,
                            exchange: to.exchange,
                            tradeEnabled: to.tradeEnabled,
                        },
                    });
                }
            }
        }

        return { exchanges, routes };
    }

    export async function getById(id: number) {
        return await database
            .select()
            .from(cryptocurrency)
            .where(eq(cryptocurrency.id, id))
            .then((result) => result.at(0));
    }
    Array.from(
        ''
    )

    export async function getByCmcId(cmcId: number) {
        return await database
            .select()
            .from(cryptocurrency)
            .where(eq(cryptocurrency.cmcId, cmcId))
            .then((result) => result[0]);
    }

    export async function cmcIdExists(cmcId: number) {
        return await database
            .select({ count: count() })
            .from(cryptocurrency)
            .where(eq(cryptocurrency.cmcId, cmcId))
            .then((result) => !!result.at(0)?.count);
    }

    export async function add(
        input: CryptocurrencyInsert,
    ): Promise<CryptocurrencySelect | undefined> {
        const result = await database
            .insert(cryptocurrency)
            .values(input)
            .returning()
            .then((x) => x?.at(0));

        return result;
    }

    export async function update(id: number, payload: CryptocurrencyUpdate) {
        return await database
            .update(cryptocurrency)
            .set(payload)
            .where(eq(cryptocurrency.id, id))
            .returning()
            .then((result) => result?.at(0));
    }

    export async function remove(id: number) {
        return await database
            .delete(cryptocurrency)
            .where(eq(cryptocurrency.id, id))
            .returning()
            .then((result) => result[0]);
    }
}
