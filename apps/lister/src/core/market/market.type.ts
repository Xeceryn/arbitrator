import type { z } from "zod";

import type {
  exchangeWithCryptocurrenciesSchema,
  marketAssignSchema,
  marketUpdatePayloadSchema,
  marketWithRelationsSchema,
} from "./market.schema";
import { market } from "./market.sql";

export type Market = typeof market.$inferSelect;
export type MarketWithRelations = z.infer<typeof marketWithRelationsSchema>;
export type MarketAssign = z.infer<typeof marketAssignSchema>;
export type MarketUpdatePayload = z.infer<typeof marketUpdatePayloadSchema>;
export type ExchangeWithCryptocurrencies = z.infer<
  typeof exchangeWithCryptocurrenciesSchema
>;
