import {
  createInsertSchema,
  createUpdateSchema,
  createSelectSchema,
} from "drizzle-zod";
import { exchangeTable } from "./exchange.sql";

export const exchangeInsertSchema = createInsertSchema(exchangeTable).omit({
  createdAt: true,
  updatedAt: true,
});
export const exchangeUpdateSchema = createUpdateSchema(exchangeTable).omit({
  createdAt: true,
  updatedAt: true,
});
export const exchangeSelectSchema = createSelectSchema(exchangeTable);
