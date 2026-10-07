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

export const paginationMetadataSchema = z.object({
    items: z.coerce.number(),
    pages: z.coerce.number(),
    page: z.coerce.number(),
    limit: z.coerce.number(),
    from: z.coerce.number(),
    to: z.coerce.number(),
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
