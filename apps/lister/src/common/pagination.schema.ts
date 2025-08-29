import z from "zod";

export const paginationInputSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(-1).max(100).default(20),
});

export const paginationOutputSchema = z.object({
  total: z.number(),
  totalPages: z.number(),
  currentPage: z.number(),
  limit: z.number(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export function createPaginatedOutputSchema<T extends z.ZodTypeAny>(
  itemSchema: T,
) {
  return z.object({
    data: z.array(itemSchema),
    pagination: paginationOutputSchema,
  });
}

export type PaginationInput = z.infer<typeof paginationInputSchema>;
export type PaginationOutput = z.infer<typeof paginationOutputSchema>;
