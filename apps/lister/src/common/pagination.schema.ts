import z from "zod";

export function createPaginationInputSchema<
  TSearchByKeys extends z.ZodEnum,
  TOrderByKeys extends z.ZodEnum,
>(filter: {
  searchByKeys: TSearchByKeys;
  orderByKeys: TOrderByKeys;
  defaultSearchBy: z.infer<TSearchByKeys>;
  defaultOrderBy: z.infer<TOrderByKeys>;
}) {
  return z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(-1).max(100).default(10),
    search: z.string().default(""),
    searchBy: filter.searchByKeys.default(filter.defaultSearchBy),
    orderBy: filter.orderByKeys.default(filter.defaultOrderBy),
    order: z.enum(["asc", "desc"]).default("asc"),
  });
}

const paginatedMetadataSchema = z.object({
  items: z.number(),
  pages: z.number(),
  page: z.number(),
  limit: z.number(),
  from: z.number(),
  to: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
  search: z.string(),
  searchBy: z.string(),
  order: z.string(),
  orderBy: z.string(),
});

export function createPaginatedOutputSchema<T extends z.ZodTypeAny>(
  itemSchema: T,
) {
  return z.object({
    data: z.array(itemSchema),
    meta: paginatedMetadataSchema,
  });
}

type PaginatedOutput<T> = {
  data: T;
  meta: z.infer<typeof paginatedMetadataSchema>;
};

type PaginateParam = z.infer<
  ReturnType<typeof createPaginationInputSchema<z.ZodEnum, z.ZodEnum>>
>;

export function paginate<T>(
  data: Array<T>,
  count: number,
  meta: PaginateParam,
): PaginatedOutput<T[]> {
  const { page, limit, search, searchBy, order, orderBy } = meta;
  if (meta.limit === -1) {
    return {
      data,
      meta: {
        items: data.length,
        pages: 1,
        page: meta.page,
        limit: meta.limit,
        from: data.length > 0 ? 1 : 0,
        to: data.length,
        hasNextPage: false,
        hasPreviousPage: false,
        search: meta.search,
        searchBy: meta.searchBy as string,
        order: meta.order,
        orderBy: meta.orderBy as string,
      },
    };
  }

  const pages = Math.ceil(count / limit);
  const from = count === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, count);

  return {
    data,
    meta: {
      items: count,
      pages,
      page,
      limit,
      from,
      to,
      hasNextPage: page < pages,
      hasPreviousPage: page > 1,
      search,
      searchBy: searchBy as string,
      order,
      orderBy: orderBy as string,
    },
  };
}

export type PaginationInput<T extends z.ZodEnum> = z.infer<
  ReturnType<typeof createPaginationInputSchema<T, T>>
>;
