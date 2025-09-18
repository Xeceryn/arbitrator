import {
  createSelectSchema,
  createUpdateSchema,
  createInsertSchema,
} from "drizzle-zod";

import { cryptocurrencyTable } from "./cryptocurrency.sql";
import z from "zod";
import {
  createPaginationInputSchema as createPaginationInputSchema,
  createPaginatedOutputSchema,
} from "../../common/pagination.schema";

export const cryptocurrencySelectSchema =
  createSelectSchema(cryptocurrencyTable);
export const cryptocurrencyInsertSchema = createInsertSchema(
  cryptocurrencyTable,
).omit({
  createdAt: true,
  updatedAt: true,
});

export const cryptocurrencyUpdateSchema = createUpdateSchema(
  cryptocurrencyTable,
).omit({
  createdAt: true,
  updatedAt: true,
});

const searchByKeys = z.keyof(
  cryptocurrencySelectSchema.omit({
    createdAt: true,
    updatedAt: true,
    logo: true,
  }),
);
const orderByKeys = z.keyof(
  cryptocurrencySelectSchema.omit({
    logo: true,
  }),
);

export const listCryptocurrencySelectSchema = createPaginationInputSchema({
  searchByKeys,
  orderByKeys,
  defaultSearchBy: "symbol",
  defaultOrderBy: "cmcId",
});

export const paginatedCryptocurrencySelectSchema = createPaginatedOutputSchema(
  cryptocurrencySelectSchema,
);

export type CryptocurrencySelect = z.infer<typeof cryptocurrencySelectSchema>;
export type CryptocurrencyInsert = z.infer<typeof cryptocurrencyInsertSchema>;
export type CryptocurrencyUpdate = z.infer<typeof cryptocurrencyUpdateSchema>;
export type ListCryptocurrencyInput = z.infer<
  typeof listCryptocurrencySelectSchema
>;
export type PaginatedCryptocurrencyList = z.infer<
  typeof paginatedCryptocurrencySelectSchema
>;

export const cryptocurrencySearchByOptions = searchByKeys.options;
export const cryptocurrencyOrderByOptions = orderByKeys.options;
