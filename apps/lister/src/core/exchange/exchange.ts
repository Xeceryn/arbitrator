import { count, eq } from "drizzle-orm";

import { paginate } from "../../common/pagination";
import { database } from "../../database/connection";
import { exchangeTable } from "./exchange.sql";
import type {
  ExchangeInsert,
  ListExchangeInput,
  PaginatedExchangeList,
} from "./exchange.type";

export namespace Exchange {
  export async function add(exchange: ExchangeInsert) {
    return await database
      .insert(exchangeTable)
      .values(exchange)
      .returning()
      .then((result) => result.at(0));
  }

  export async function list(
    input: ListExchangeInput,
  ): Promise<PaginatedExchangeList> {
    return await paginate({ table: exchangeTable, input });
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
