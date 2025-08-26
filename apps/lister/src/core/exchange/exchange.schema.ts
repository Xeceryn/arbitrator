import {
  createInsertSchema,
  createUpdateSchema,
  createSelectSchema,
} from "drizzle-zod";
import { exchangeTable } from "./exchange.sql";

export const exchangeInsertSchema = createInsertSchema(exchangeTable);
export const exchangeUpdateSchema = createUpdateSchema(exchangeTable);
export const exchangeSelectSchema = createSelectSchema(exchangeTable);
