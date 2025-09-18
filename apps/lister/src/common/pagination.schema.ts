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

export function createPaginatedOutputSchema<T extends z.ZodTypeAny>(
  itemSchema: T,
) {
  return z.object({
    data: z.array(itemSchema),
    meta: z.object({
      items: z.number(),
      pages: z.number(),
      currentPage: z.number(),
      limit: z.number(),
      from: z.number(),
      to: z.number(),
      hasNextPage: z.boolean(),
      hasPreviousPage: z.boolean(),
      orderBy: z.string(),
      order: z.string(),
      search: z.string(),
      searchBy: z.string(),
    }),
  });
}

export const paginationOutputSchema = z.object({
  total: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  limit: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export type PaginationInput<T extends z.ZodEnum> = z.infer<
  ReturnType<typeof createPaginationInputSchema<T, T>>
>;
