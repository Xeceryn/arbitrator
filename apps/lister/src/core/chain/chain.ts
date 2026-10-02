import { eq, count, or, ilike, and, SQL } from "drizzle-orm";

import { database } from "../../database/connection";
import { SortOrder } from "../utility/sqlsort";
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
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (input?.search) {
      conditions.push(
        or(
          ilike(
            chainTable[input.searchBy],
            "%" + input.search.toLowerCase() + "%",
          ),
        ),
      );
    }

    const totalItems = await database
      .select({ count: count() })
      .from(chainTable)
      .where(conditions?.length ? and(...conditions) : undefined)
      .then((result) => result?.at(0)?.count || 0);

    const limit = input.limit === -1 ? totalItems : input.limit;
    const offset = input.limit === -1 ? 0 : (input.page - 1) * input.limit;
    const from = input.limit === -1 ? 0 : (input.page - 1) * input.limit + 1;
    const to = input.limit === -1 ? totalItems : input.page * input.limit;

    const result = await database
      .select()
      .from(chainTable)
      .where(conditions?.length ? and(...conditions) : undefined)
      .orderBy(SortOrder(input.order, chainTable[input.orderBy]))
      .limit(limit)
      .offset(offset);

    const data = {
      data: result,
      meta: {
        items: totalItems,
        pages: Math.ceil(totalItems / input.limit),
        page: input.page,
        limit,
        from,
        to,
        hasNextPage: input.page < Math.ceil(totalItems / input.limit),
        hasPreviousPage: input.page > 1,
        order: input.order,
        orderBy: input.orderBy,
        search: input.search,
        searchBy: input.searchBy,
      },
    };

    return data;
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
