import { count, eq } from "drizzle-orm";

import { paginate } from "../../common/pagination";
import { database } from "../../database/connection";
import { cryptocurrency } from "./cryptocurrency.sql";
import type {
  CryptocurrencySelect,
  CryptocurrencyInsert,
  CryptocurrencyUpdate,
  ListCryptocurrencyInput,
  PaginatedCryptocurrencyList,
} from "./cryptocurrency.type";

export namespace Cryptocurrency {
  export async function list(
    input: ListCryptocurrencyInput,
  ): Promise<PaginatedCryptocurrencyList> {
    return paginate({ table: cryptocurrency, input });
  }

  export async function getById(id: number) {
    return await database
      .select()
      .from(cryptocurrency)
      .where(eq(cryptocurrency.id, id))
      .then((result) => result.at(0));
  }

  export async function getByCmcId(cmcId: number) {
    return await database
      .select()
      .from(cryptocurrency)
      .where(eq(cryptocurrency.cmcId, cmcId))
      .then((result) => result[0]);
  }

  export async function cmcIdExists(cmcId: number) {
    return await database
      .select({ count: count() })
      .from(cryptocurrency)
      .where(eq(cryptocurrency.cmcId, cmcId))
      .then((result) => !!result.at(0)?.count);
  }

  export async function add(
    input: CryptocurrencyInsert,
  ): Promise<CryptocurrencySelect | undefined> {
    const result = await database
      .insert(cryptocurrency)
      .values(input)
      .returning()
      .then((x) => x?.at(0));

    return result;
  }

  export async function update(id: number, payload: CryptocurrencyUpdate) {
    return await database
      .update(cryptocurrency)
      .set(payload)
      .where(eq(cryptocurrency.id, id))
      .returning()
      .then((result) => result?.at(0));
  }

  export async function remove(id: number) {
    return await database
      .delete(cryptocurrency)
      .where(eq(cryptocurrency.id, id))
      .returning()
      .then((result) => result[0]);
  }
}
