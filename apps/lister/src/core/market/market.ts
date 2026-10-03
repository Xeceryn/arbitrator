import { and, count, eq } from "drizzle-orm";

import { database } from "../../database/connection";
import type { MarketFilterExists, MarketSelect } from "./market.schema";
import { market } from "./market.sql";
import type { MarketUpdatePayload, MarketWithRelations } from "./market.type";

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
        conditions.push(eq(market.cryptocurrencyId, filter.cryptocurrencyId));
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

  export async function getById(id: number): Promise<MarketSelect | undefined> {
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
