import type { z } from "zod";

import type {
  exchangeWithCryptocurrenciesSchema,
  listTransferableCoinsInputSchema,
  marketAssignSchema,
  marketUpdatePayloadSchema,
  marketWithRelationsSchema,
  transferableCoinsSchema,
  transferableExchangeSchema,
  transferableRouteSchema,
  transferableSubscriptionSchema,
} from "./market.schema";
import { market } from "./market.sql";

export type Market = typeof market.$inferSelect;
export type MarketWithRelations = z.infer<typeof marketWithRelationsSchema>;
export type MarketAssign = z.infer<typeof marketAssignSchema>;
export type MarketUpdatePayload = z.infer<typeof marketUpdatePayloadSchema>;
export type ExchangeWithCryptocurrencies = z.infer<
  typeof exchangeWithCryptocurrenciesSchema
>;
export type TransferableSubscription = z.infer<
  typeof transferableSubscriptionSchema
>;
export type TransferableRoute = z.infer<typeof transferableRouteSchema>;
export type TransferableExchange = z.infer<typeof transferableExchangeSchema>;
export type ListTransferableCoinsInput = z.infer<
  typeof listTransferableCoinsInputSchema
>;
export type TransferableCoins = z.infer<typeof transferableCoinsSchema>;
