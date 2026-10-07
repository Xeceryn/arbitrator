import { and, count, eq } from "drizzle-orm";

import { database } from "../../database/connection";
import { chainLink } from "./chain-link.sql";
import type {
    ChainLinkFilterExists,
    ChainLinkInsert,
    ChainLinkUpdate,
    ChainLinkWithChain,
} from "./chain-link.type";

export namespace ChainLink {
    export type FindAllFilter = {
        marketId?: number;
        chainId?: number;
    };

    export async function getAll(filter?: FindAllFilter) {
        const conditions = [];
        if (filter?.marketId) {
            conditions.push(eq(chainLink.marketId, filter.marketId));
        }
        if (filter?.chainId) {
            conditions.push(eq(chainLink.chainId, filter.chainId));
        }

        return await database
            .select()
            .from(chainLink)
            .where(conditions?.length ? and(...conditions) : undefined);
    }

    /** Chain links with their chain embedded, for the market expand panel. */
    export async function getAllWithChain(
        filter: FindAllFilter = {},
    ): Promise<ChainLinkWithChain[]> {
        const where: { marketId?: number; chainId?: number } = {};
        if (filter.marketId) where.marketId = filter.marketId;
        if (filter.chainId) where.chainId = filter.chainId;

        const rows = await database.query.chainLink.findMany({
            where: Object.keys(where).length > 0 ? where : undefined,
            with: { chain: true },
            orderBy: { id: "asc" },
        });

        return rows.map((row) => ({
            ...row,
            chain: row.chain!,
        }));
    }

    export async function getById(id: number) {
        return await database
            .select()
            .from(chainLink)
            .where(eq(chainLink.id, id))
            .then((result) => result.at(0));
    }

    export async function exists(
        filter: ChainLinkFilterExists,
    ): Promise<boolean> {
        const result = await database
            .select({ count: count() })
            .from(chainLink)
            .where(
                and(
                    eq(chainLink.marketId, filter.marketId),
                    eq(chainLink.chainId, filter.chainId),
                ),
            )
            .execute();

        return !!result[0]?.count;
    }

    export async function add(input: ChainLinkInsert) {
        return await database
            .insert(chainLink)
            .values(input)
            .returning()
            .then((result) => result[0]);
    }

    export async function update(id: number, input: ChainLinkUpdate) {
        return await database
            .update(chainLink)
            .set(input)
            .where(eq(chainLink.id, id))
            .returning()
            .then((result) => result[0]);
    }

    export async function remove(id: number) {
        return await database
            .delete(chainLink)
            .where(eq(chainLink.id, id))
            .returning()
            .then((result) => result[0]);
    }
}
