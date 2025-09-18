import { and, desc, asc, count, eq, like, or, ilike } from "drizzle-orm";
import { cryptocurrencyTable } from "./cryptocurrency.sql";
import { database } from "../../database/connection";
import type z from "zod";
import {
  cryptocurrencyInsertSchema,
  cryptocurrencyUpdateSchema,
  type ListCryptocurrencyInput,
  type PaginatedCryptocurrencyList,
} from "./cryptocurrency.schema";

export namespace Cryptocurrency {
  export type FindAllFilter = {
    id?: number;
    hasExchangeWithId?: number;
  };
  export async function list(
    input: ListCryptocurrencyInput,
  ): Promise<PaginatedCryptocurrencyList> {
    const conditions = [];
    // if (filter?.id) {
    //   conditions.push(eq(cryptocurrencyTable.cmcId, filter.id));
    // }
    // if (filter?.hasExchangeWithId) {
    //   conditions.push(
    //     eq(exchangeCryptocurrencyTable.exchangeId, filter.hasExchangeWithId),
    //   );
    // }
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

    const { page: currentPage, limit } = input;
    if (limit === -1) {
      // if it's -1, no limit but still return the pagination info
      const totalResult = await database
        .select({ count: count() })
        .from(cryptocurrencyTable)
        .where(conditions?.length ? and(...conditions) : undefined);

      const items = totalResult[0]?.count || 0;
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
          currentPage,
          limit,
          hasNextPage: currentPage < pages,
          hasPreviousPage: currentPage > 1,
        },
      };
    }
    const offset = (currentPage - 1) * limit;

    // Get total count
    const totalResult = await database
      .select({ count: count() })
      .from(cryptocurrencyTable)
      .where(conditions?.length ? and(...conditions) : undefined);

    const total = totalResult[0]?.count || 0;
    const pages = Math.ceil(total / limit);
    const from = (currentPage - 1) * limit + 1;
    const to = currentPage * limit;

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
        currentPage: currentPage,
        limit,
        from,
        to,
        hasNextPage: currentPage < pages,
        hasPreviousPage: currentPage > 1,
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
