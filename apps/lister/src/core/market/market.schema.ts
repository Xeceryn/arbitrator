import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import type z from "zod";

import { marketTable } from "./market.sql";

export const marketInsertSchema = createInsertSchema(marketTable).omit({
  createdAt: true,
  updatedAt: true,
});

export const marketUpdateSchema = createUpdateSchema(marketTable).omit({
  createdAt: true,
  updatedAt: true,
});

export const marketSelectSchema = createSelectSchema(marketTable);

export const marketFilterExistsSchema = marketSelectSchema.pick({
  exchangeId: true,
  cryptocurrencyId: true,
});

export type MarketInsert = z.infer<typeof marketInsertSchema>;

export type MarketUpdate = z.infer<typeof marketUpdateSchema>;

export type MarketSelect = z.infer<typeof marketSelectSchema>;

export type MarketFilterExists = z.infer<typeof marketFilterExistsSchema>;
