import {
  createSelectSchema,
  createUpdateSchema,
  createInsertSchema,
} from "drizzle-zod";
import z from "zod";

import {
  createPaginationInputSchema,
  createPaginatedOutputSchema,
} from "../../common/pagination.schema";
import { cryptocurrency } from "./cryptocurrency.sql";

export const cryptocurrencySelectSchema = createSelectSchema(cryptocurrency);
export const cryptocurrencyInsertSchema = createInsertSchema(
  cryptocurrency,
).omit({
  createdAt: true,
  updatedAt: true,
});

export const cryptocurrencyUpdateSchema = createUpdateSchema(cryptocurrency, {
  cmcId: z.coerce.number().optional(),
}).omit({
  logo: true,
  createdAt: true,
  updatedAt: true,
});
export const cryptocurrencySearchByKeysSchema = z.keyof(
  cryptocurrencySelectSchema.omit({
    createdAt: true,
    updatedAt: true,
    logo: true,
  }),
);
export const cryptocurrencyOrderByKeysSchema = z.keyof(
  cryptocurrencySelectSchema.omit({
    logo: true,
  }),
);
export const listCryptocurrencySelectSchema = createPaginationInputSchema({
  searchByKeys: cryptocurrencySearchByKeysSchema,
  orderByKeys: cryptocurrencyOrderByKeysSchema,
  defaultSearchBy: "symbol",
  defaultOrderBy: "cmcId",
});
export const paginatedCryptocurrencySelectSchema = createPaginatedOutputSchema(
  cryptocurrencySelectSchema,
);
