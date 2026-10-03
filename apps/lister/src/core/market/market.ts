import { and, count, eq } from "drizzle-orm";

import { database } from "../../database/connection";
import type { MarketFilterExists, MarketSelect } from "./market.schema";
import { marketTable } from "./market.sql";

export namespace Market {
  export async function exists(filter: MarketFilterExists): Promise<boolean> {
    const result = await database
      .select({ count: count() })
      .from(marketTable)
      .where(
        and(
          eq(marketTable.exchangeId, filter.exchangeId),
          eq(marketTable.cryptocurrencyId, filter.cryptocurrencyId),
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
        conditions.push(eq(marketTable.exchangeId, filter.exchangeId));
      }
      if (filter.cryptocurrencyId) {
        conditions.push(
          eq(marketTable.cryptocurrencyId, filter.cryptocurrencyId),
        );
      }
      if (conditions.length > 0) {
        return await database
          .select()
          .from(marketTable)
          .where(and(...conditions))
          .execute();
      }
    }

    return await database.select().from(marketTable).execute();
  }

  export async function getById(id: number): Promise<MarketSelect | undefined> {
    const result = await database
      .select()
      .from(marketTable)
      .where(eq(marketTable.id, id))
      .limit(1)
      .execute();

    return result[0];
  }

  export async function countExchangeCryptocurrencies(exchangeId: number) {
    const result = await database
      .select({ count: count() })
      .from(marketTable)
      .where(eq(marketTable.exchangeId, exchangeId))
      .execute();

    return result[0]!.count;
  }
}
