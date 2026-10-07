import {
    createSelectSchema,
    createUpdateSchema,
    createInsertSchema,
} from "drizzle-zod";
import z from "zod";

import {
    createPaginatedOutputSchema,
    createPaginationInputSchema,
} from "../../common/pagination.schema";
import { chain } from "./chain.sql";

export const chainInsertSchema = createInsertSchema(chain).omit({
    createdAt: true,
    updatedAt: true,
});

export const chainUpdateSchema = createUpdateSchema(chain).omit({
    createdAt: true,
    updatedAt: true,
});

export const chainSelectSchema = createSelectSchema(chain);
export const chainSearchByKeysSchema = z.keyof(
    chainSelectSchema.omit({
        id: true,
        createdAt: true,
        updatedAt: true,
    }),
);
export const chainOrderByKeysSchema = z.keyof(chainSelectSchema);
export const listChainSelectSchema = createPaginationInputSchema({
    searchByKeys: chainSearchByKeysSchema,
    orderByKeys: chainOrderByKeysSchema,
    defaultSearchBy: "name",
    defaultOrderBy: "id",
});

export const paginatedChainSelectSChema =
    createPaginatedOutputSchema(chainSelectSchema);
