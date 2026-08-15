import { eq, count, or, ilike, and, asc, desc, SQL } from "drizzle-orm";
import { database } from "../../database/connection";
import { chainTable } from "./chain.sql";
import type { ListChainInput } from "./chain.type";
import { paginate } from "../../common/pagination.util";

export namespace Chain {
  export async function add(chain: typeof chainTable.$inferInsert) {
    return await database
      .insert(chainTable)
      .values(chain)
      .returning()
      .then((result) => result.at(0));
  }

  export async function list(input: ListChainInput) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (input?.search) {
      conditions.push(
        or(
          ilike(
            chainTable[input.searchBy],
            "%" + input.search.toLowerCase() + "%",
          ),
        ),
      )
    }
    const result = await paginate(
      () => database.select().from(chainTable).where(conditions?.length ? and(...conditions) : undefined),
      input.page,
      input.limit,
      await database
        .select({ count: count() })
        .from(chainTable)
        .where(conditions?.length ? and(...conditions) : undefined)
        .then((result) => result?.at(0)?.count || 0),
    );

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
