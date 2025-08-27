import { and, eq, count } from "drizzle-orm";
import { database } from "../../database/connection";
import { exchangeTable } from "./exchange.sql";
import { exchangeCryptocurrencyTable } from "../exchange-cryptocurrency/exchange-cryptocurrency.sql";

export namespace Exchange {
  export async function add(exchange: typeof exchangeTable.$inferInsert) {
    return await database
      .insert(exchangeTable)
      .values(exchange)
      .returning()
      .then((result) => result.at(0));
  }

  export type FindAllFilter = {
    cmcid?: number;
    hasCryptocurrencyWithId?: number;
  };
  export async function getAll(filter?: FindAllFilter) {
    const conditions = [];

    if (filter?.cmcid) {
      conditions.push(eq(exchangeTable.cmcId, filter.cmcid));
    }
    if (filter?.hasCryptocurrencyWithId) {
      conditions.push(
        eq(
          exchangeCryptocurrencyTable.cryptocurrencyId,
          filter.hasCryptocurrencyWithId,
        ),
      );
    }

    return await database
      .select()
      .from(exchangeTable)
      .where(conditions?.length ? and(...conditions) : undefined);
  }

  export async function cmcIdExists(cmcId: number) {
    return await database
      .select({ count: count() })
      .from(exchangeTable)
      .where(eq(exchangeTable.cmcId, cmcId))
      .then((result) => !!result.at(0)?.count);
  }

  export async function getById(id: number) {
    return await database
      .select()
      .from(exchangeTable)
      .where(eq(exchangeTable.id, id))
      .then((result) => result.at(0));
  }

  export async function getByCmcId(cmcId: number) {
    return await database
      .select()
      .from(exchangeTable)
      .where(eq(exchangeTable.cmcId, cmcId))
      .then((result) => result.at(0));
  }

  export async function update(
    id: number,
    exchange: Partial<typeof exchangeTable.$inferInsert>,
  ) {
    return await database
      .update(exchangeTable)
      .set(exchange)
      .where(eq(exchangeTable.id, id));
  }

  export async function remove(id: number) {
    return await database
      .delete(exchangeTable)
      .where(eq(exchangeTable.id, id))
      .returning()
      .then((result) => result.at(0));
  }
}
