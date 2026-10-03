import type z from "zod";

import type {
  cryptocurrencyInsertSchema,
  cryptocurrencySelectSchema,
  cryptocurrencyUpdateSchema,
  listCryptocurrencySelectSchema,
  paginatedCryptocurrencySelectSchema,
} from "./cryptocurrency.schema";
import { cryptocurrency } from "./cryptocurrency.sql";

export type Cryptocurrency = typeof cryptocurrency.$inferSelect;
export type CryptocurrencySelect = z.infer<typeof cryptocurrencySelectSchema>;
export type CryptocurrencyInsert = z.infer<typeof cryptocurrencyInsertSchema>;
export type CryptocurrencyUpdate = z.infer<typeof cryptocurrencyUpdateSchema>;
export type ListCryptocurrencyInput = z.infer<
  typeof listCryptocurrencySelectSchema
>;
export type PaginatedCryptocurrencyList = z.infer<
  typeof paginatedCryptocurrencySelectSchema
>;
