import {
  createSelectSchema,
  createUpdateSchema,
  createInsertSchema,
} from "drizzle-zod";

import { cryptocurrencyTable } from "./cryptocurrency.sql";

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
