import z from "zod";

export function createPaginationInputSchema<
    TSearchByKeys extends z.ZodEnum<any>,
    TOrderByKeys extends z.ZodEnum<any>,
>(filter: {
    searchByKeys: TSearchByKeys;
    orderByKeys: TOrderByKeys;
    defaultSearchBy: z.infer<TSearchByKeys>;
    defaultOrderBy: z.infer<TOrderByKeys>;
}) {
    return z.object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce
            .number()
            .int()
            .min(-1)
            .max(100)
            .refine((limit) => limit !== 0, {
                message: "limit must be -1 (all) or between 1 and 100",
            })
            .default(10),
        search: z.string().default(""),
        searchBy: filter.searchByKeys.default(filter.defaultSearchBy),
        orderBy: filter.orderByKeys.default(filter.defaultOrderBy),
        order: z.enum(["asc", "desc"]).default("asc"),
    });
}

/**
 * Output-only pagination metadata (`data`/`meta` envelope of list endpoints).
 *
 * Plain `z.number()`, never `z.coerce`: Elysia types a standard-schema response
 * from its **input** side, and `z.coerce.number()` has an `unknown` input, so
 * coercing here would surface `meta.items: unknown` to every Eden client.
 */
export const paginationMetadataSchema = z.object({
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

export type PaginationMetadata = z.infer<typeof paginationMetadataSchema>;

export function createPaginatedOutputSchema<T extends z.ZodType>(
    itemSchema: T,
) {
    return z.object({
        data: z.array(itemSchema),
        meta: paginationMetadataSchema,
    });
}
