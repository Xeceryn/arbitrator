import { and, count, eq } from "drizzle-orm";

import { database } from "../../database/connection";
import { chainLinkTable } from "./chain-link.sql";
import type {
  ChainLinkFilterExists,
  ChainLinkInsert,
  ChainLinkUpdate,
} from "./chain-link.type";

export namespace ChainLink {
  export type FindAllFilter = {
    marketId?: number;
    chainId?: number;
  };

  export async function getAll(filter?: FindAllFilter) {
    const conditions = [];
    if (filter?.marketId) {
      conditions.push(eq(chainLinkTable.marketId, filter.marketId));
    }
    if (filter?.chainId) {
      conditions.push(eq(chainLinkTable.chainId, filter.chainId));
    }

    return await database
      .select()
      .from(chainLinkTable)
      .where(conditions?.length ? and(...conditions) : undefined);
  }

  export async function getById(id: number) {
    return await database
      .select()
      .from(chainLinkTable)
      .where(eq(chainLinkTable.id, id))
      .then((result) => result.at(0));
  }

  export async function exists(
    filter: ChainLinkFilterExists,
  ): Promise<boolean> {
    const result = await database
      .select({ count: count() })
      .from(chainLinkTable)
      .where(
        and(
          eq(chainLinkTable.marketId, filter.marketId),
          eq(chainLinkTable.chainId, filter.chainId),
        ),
      )
      .execute();

    return !!result[0]?.count;
  }

  export async function add(chainLink: ChainLinkInsert) {
    return await database
      .insert(chainLinkTable)
      .values(chainLink)
      .returning()
      .then((result) => result[0]);
  }

  export async function update(id: number, chainLink: ChainLinkUpdate) {
    return await database
      .update(chainLinkTable)
      .set(chainLink)
      .where(eq(chainLinkTable.id, id))
      .returning()
      .then((result) => result[0]);
  }

  export async function remove(id: number) {
    return await database
      .delete(chainLinkTable)
      .where(eq(chainLinkTable.id, id))
      .returning()
      .then((result) => result[0]);
  }
}
