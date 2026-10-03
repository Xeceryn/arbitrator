import { count, eq } from "drizzle-orm";
import type z from "zod";

import { paginate } from "../../common/pagination";
import { database } from "../../database/connection";
import {
  cryptocurrencyInsertSchema,
  cryptocurrencyUpdateSchema,
} from "./cryptocurrency.schema";
import { cryptocurrencyTable } from "./cryptocurrency.sql";
import type {
  ListCryptocurrencyInput,
  PaginatedCryptocurrencyList,
} from "./cryptocurrency.type";

export namespace Cryptocurrency {
  export async function list(
    input: ListCryptocurrencyInput,
  ): Promise<PaginatedCryptocurrencyList> {
    return paginate({ table: cryptocurrencyTable, input });
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
