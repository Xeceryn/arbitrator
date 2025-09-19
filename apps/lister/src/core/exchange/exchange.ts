import { and, asc, count, desc, eq, ilike, or } from "drizzle-orm";

import { database } from "../../database/connection";
import { exchangeTable } from "./exchange.sql";
import type {
  ExchangeInsert,
  ListExchangeInput,
  PaginatedExchangeList,
} from "./exchange.type";
import { paginate } from "../../common/pagination.schema";

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
    const conditions = [
      and(
        or(ilike(exchangeTable.name, "%" + input.search.toLowerCase() + "%")),
      ),
    ];

    const items = await database
      .select({ count: count() })
      .from(exchangeTable)
      .where(conditions?.length ? and(...conditions) : undefined)
      .then((result) => result?.at(0)?.count || 0);

    const data = await database
      .select()
      .from(exchangeTable)
      .where(conditions?.length ? and(...conditions) : undefined)
      .limit(input.limit)
      .orderBy(
        input.order === "asc"
          ? asc(exchangeTable[input.orderBy])
          : desc(exchangeTable[input.orderBy]),
      )
      .offset(input.page);

    const result = paginate(data, items, input);
    return result;
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
