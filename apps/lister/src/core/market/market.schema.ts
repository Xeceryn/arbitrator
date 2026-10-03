import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import type z from "zod";

import { market } from "./market.sql";

export const marketInsertSchema = createInsertSchema(market).omit({
  createdAt: true,
  updatedAt: true,
});

export const marketUpdateSchema = createUpdateSchema(market).omit({
  createdAt: true,
  updatedAt: true,
});

export const marketSelectSchema = createSelectSchema(market);

export const marketFilterExistsSchema = marketSelectSchema.pick({
  exchangeId: true,
  cryptocurrencyId: true,
});

export type MarketInsert = z.infer<typeof marketInsertSchema>;

export type MarketUpdate = z.infer<typeof marketUpdateSchema>;

export type MarketSelect = z.infer<typeof marketSelectSchema>;

export type MarketFilterExists = z.infer<typeof marketFilterExistsSchema>;
