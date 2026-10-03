import { eq, count } from "drizzle-orm";

import { paginate } from "../../common/pagination";
import { database } from "../../database/connection";
import { chainTable } from "./chain.sql";
import type { ListChainInput, PaginatedChainList } from "./chain.type";

export namespace Chain {
  export async function add(chain: typeof chainTable.$inferInsert) {
    return await database
      .insert(chainTable)
      .values(chain)
      .returning()
      .then((result) => result.at(0));
  }

  export async function list(
    input: ListChainInput,
  ): Promise<PaginatedChainList> {
    const result = await paginate({ table: chainTable, input });
    return result;
  }

  export async function codeExists(code: string) {
    return await database
      .select({ count: count() })
      .from(chainTable)
      .where(eq(chainTable.code, code))
      .then((result) => !!result.at(0)?.count);
  }

  export async function getById(id: number) {
    return await database
      .select()
      .from(chainTable)
      .where(eq(chainTable.id, id))
      .then((result) => result.at(0));
  }

  export async function getByCode(code: string) {
    return await database
      .select()
      .from(chainTable)
      .where(eq(chainTable.code, code))
      .then((result) => result.at(0));
  }

  export async function update(
    id: number,
    chain: Partial<typeof chainTable.$inferInsert>,
  ) {
    return await database
      .update(chainTable)
      .set(chain)
      .where(eq(chainTable.id, id))
      .returning()
      .then((result) => result.at(0));
  }

  export async function remove(id: number) {
    return await database
      .delete(chainTable)
      .where(eq(chainTable.id, id))
      .returning()
      .then((result) => result.at(0));
  }
}
