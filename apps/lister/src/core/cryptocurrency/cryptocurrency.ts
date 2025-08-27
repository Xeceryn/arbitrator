import { and, count, eq } from "drizzle-orm";
import { cryptocurrencyTable } from "./cryptocurrency.sql";
import { exchangeCryptocurrencyTable } from "../exchange-cryptocurrency/exchange-cryptocurrency.sql";
import { database } from "../../database/connection";
import type z from "zod";
import {
  cryptocurrencyInsertSchema,
  cryptocurrencyUpdateSchema,
} from "./cryptocurrency.schema";

export namespace Cryptocurrency {
  export type FindAllFilter = {
    id?: number;
    hasExchangeWithId?: number;
  };
  export async function getAll(filter?: FindAllFilter) {
    const conditions = [];
    if (filter?.id) {
      conditions.push(eq(cryptocurrencyTable.cmcId, filter.id));
    }
    if (filter?.hasExchangeWithId) {
      conditions.push(
        eq(exchangeCryptocurrencyTable.exchangeId, filter.hasExchangeWithId),
      );
    }

    return await database
      .select()
      .from(cryptocurrencyTable)
      .where(conditions?.length ? and(...conditions) : undefined);
  }

  export async function getById(id: number) {
    return await database
      .select()
      .from(cryptocurrencyTable)
      .where(eq(cryptocurrencyTable.id, id))
      .then((result) => result.at(0));
  }

  export async function getByCmcId(cmcId: number) {
    return await database
      .select()
      .from(cryptocurrencyTable)
      .where(eq(cryptocurrencyTable.cmcId, cmcId))
      .then((result) => result[0]);
  }

  export async function cmcIdExists(cmcId: number) {
    return await database
      .select({ count: count() })
      .from(cryptocurrencyTable)
      .where(eq(cryptocurrencyTable.cmcId, cmcId))
      .then((result) => !!result.at(0)?.count);
  }

  export async function add(
    cryptocurrency: z.infer<typeof cryptocurrencyInsertSchema>,
  ) {
    return await database.insert(cryptocurrencyTable).values(cryptocurrency);
  }

  export async function update(
    id: number,
    cryptocurrency: z.infer<typeof cryptocurrencyUpdateSchema>,
  ) {
    return await database
      .update(cryptocurrencyTable)
      .set(cryptocurrency)
      .where(eq(cryptocurrencyTable.id, id));
  }

  export async function remove(id: number) {
    return await database
      .delete(cryptocurrencyTable)
      .where(eq(cryptocurrencyTable.id, id))
      .returning()
      .then((result) => result[0]);
  }
}
