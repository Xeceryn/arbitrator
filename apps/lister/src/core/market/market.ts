import { and, count, eq } from "drizzle-orm";

import { database } from "../../database/connection";
import type { MarketFilterExists, MarketSelect } from "./market.schema";
import { market } from "./market.sql";

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
