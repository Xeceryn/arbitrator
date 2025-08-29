import { and, count, eq } from "drizzle-orm";
import { cryptocurrencyTable } from "./cryptocurrency.sql";
import { exchangeCryptocurrencyTable } from "../exchange-cryptocurrency/exchange-cryptocurrency.sql";
import { database } from "../../database/connection";
import type {
  PaginationInput,
  PaginationOutput,
} from "../../common/pagination.schema";
import type z from "zod";
import {
  cryptocurrencyInsertSchema,
  cryptocurrencyUpdateSchema,
  type PaginatedCryptocurrencySelect,
} from "./cryptocurrency.schema";

export namespace Cryptocurrency {
  export type FindAllFilter = {
    id?: number;
    hasExchangeWithId?: number;
  };
  export async function getAll(
    pagination: PaginationInput,
    filter?: FindAllFilter,
  ): Promise<PaginatedCryptocurrencySelect> {
    const conditions = [];
    if (filter?.id) {
      conditions.push(eq(cryptocurrencyTable.cmcId, filter.id));
    }
    if (filter?.hasExchangeWithId) {
      conditions.push(
        eq(exchangeCryptocurrencyTable.exchangeId, filter.hasExchangeWithId),
      );
    }

    const { page, limit } = pagination;
    console.log("page", page);
    console.log("limit", limit);
    if (limit === -1) {
      // if it's -1, no limit but still return the pagination info
      const totalResult = await database
        .select({ count: count() })
        .from(cryptocurrencyTable)
        .where(conditions?.length ? and(...conditions) : undefined);

      const total = totalResult[0]?.count || 0;
      const totalPages = 1;

      return {
        data: await database
          .select()
          .from(cryptocurrencyTable)
          .where(conditions?.length ? and(...conditions) : undefined),
        pagination: {
          total,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      };
    }
    const offset = (page - 1) * limit;

    // Get total count
    const totalResult = await database
      .select({ count: count() })
      .from(cryptocurrencyTable)
      .where(conditions?.length ? and(...conditions) : undefined);

    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    // Get paginated data
    const data = await database
      .select()
      .from(cryptocurrencyTable)
      .where(conditions?.length ? and(...conditions) : undefined)
      .limit(limit)
      .offset(offset);

    const paginationInfo: PaginationOutput = {
      total,
      totalPages,
      currentPage: page,
      limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return {
      data,
      pagination: paginationInfo,
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
