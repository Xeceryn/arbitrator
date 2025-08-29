import {
  createSelectSchema,
  createUpdateSchema,
  createInsertSchema,
} from "drizzle-zod";

import { cryptocurrencyTable } from "./cryptocurrency.sql";
import type z from "zod";
import { createPaginatedOutputSchema } from "../../common/pagination.schema";

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

export const paginatedCryptocurrencySelectSchema = createPaginatedOutputSchema(
  cryptocurrencySelectSchema,
);

export type CryptocurrencySelect = z.infer<typeof cryptocurrencySelectSchema>;
export type CryptocurrencyInsert = z.infer<typeof cryptocurrencyInsertSchema>;
export type CryptocurrencyUpdate = z.infer<typeof cryptocurrencyUpdateSchema>;
export type PaginatedCryptocurrencySelect = z.infer<
  typeof paginatedCryptocurrencySelectSchema
>;
