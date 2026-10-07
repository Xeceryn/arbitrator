import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-zod";
import z from "zod";

import {
    createPaginatedOutputSchema,
    createPaginationInputSchema,
} from "../../common/pagination.schema";
import { exchange } from "./exchange.sql";

export const exchangeInsertSchema = createInsertSchema(exchange).omit({
    createdAt: true,
    updatedAt: true,
});
export const exchangeUpdateSchema = createUpdateSchema(exchange).omit({
    createdAt: true,
    updatedAt: true,
});
export const exchangeSelectSchema = createSelectSchema(exchange);
export const exchangeSearchByKeysSchema = z.keyof(
    exchangeSelectSchema.omit({
        createdAt: true,
        updatedAt: true,
        logo: true,
    }),
);
export const exchangeOrderByKeysSchema = z.keyof(
    exchangeSelectSchema.omit({
        logo: true,
    }),
);
export const listExchangeSelectSchema = createPaginationInputSchema({
    searchByKeys: exchangeSearchByKeysSchema,
    orderByKeys: exchangeOrderByKeysSchema,
    defaultSearchBy: "name",
    defaultOrderBy: "id",
});
export const paginatedExchangeSelectSchema =
    createPaginatedOutputSchema(exchangeSelectSchema);
