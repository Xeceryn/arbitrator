import { and, desc, asc, count, eq, or, ilike } from "drizzle-orm";
import { cryptocurrencyTable } from "./cryptocurrency.sql";
import { database } from "../../database/connection";
import type z from "zod";
import {
  cryptocurrencyInsertSchema,
  cryptocurrencyUpdateSchema,
} from "./cryptocurrency.schema";
import type {
  ListCryptocurrencyInput,
  PaginatedCryptocurrencyList,
} from "./cryptocurrency.type";

export namespace Cryptocurrency {
  export async function list(
    input: ListCryptocurrencyInput,
  ): Promise<PaginatedCryptocurrencyList> {
    const conditions = [];
    if (input?.search) {
      conditions.push(
        or(
          ilike(
            cryptocurrencyTable[input.searchBy],
            "%" + input.search.toLowerCase() + "%",
          ),
        ),
      );
    }

    const { page, limit } = input;
    if (limit === -1) {
      const items = await database
        .select({ count: count() })
        .from(cryptocurrencyTable)
        .where(conditions?.length ? and(...conditions) : undefined)
        .then((result) => result?.at(0)?.count || 0);

      const pages = 1;
      const from = 1;
      const to = items;

      return {
        data: await database
          .select()
          .from(cryptocurrencyTable)
          .where(conditions?.length ? and(...conditions) : undefined),
        meta: {
          order: input.order,
          orderBy: input.orderBy,
          search: input.search,
          searchBy: input.searchBy,
          from,
          to,
          items,
          pages,
          page,
          limit,
          hasNextPage: page < pages,
          hasPreviousPage: page > 1,
        },
      };
    }

    // Get total count
    const totalResult = await database
      .select({ count: count() })
      .from(cryptocurrencyTable)
      .where(conditions?.length ? and(...conditions) : undefined);

    const offset = (page - 1) * limit;
    const total = totalResult[0]?.count || 0;
    const pages = Math.ceil(total / limit);
    const from = (page - 1) * limit + 1;
    const to = page * limit;

    // Get paginated data
    const data = await database
      .select()
      .from(cryptocurrencyTable)
      .where(conditions?.length ? and(...conditions) : undefined)
      .limit(limit)
      .orderBy(
        input.order === "asc"
          ? asc(cryptocurrencyTable[input.orderBy])
          : desc(cryptocurrencyTable[input.orderBy]),
      )
      .offset(offset);

    return {
      data,
      meta: {
        items: total,
        pages: pages,
        page: page,
        limit,
        from,
        to,
        hasNextPage: page < pages,
        hasPreviousPage: page > 1,
        order: input.order,
        orderBy: input.orderBy,
        search: input.search,
        searchBy: input.searchBy,
      },
    };
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
