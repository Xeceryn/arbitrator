import type { Static } from "typebox";

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
export type MarketWithRelations = Static<typeof marketWithRelationsSchema>;
export type MarketAssign = Static<typeof marketAssignSchema>;
export type MarketUpdatePayload = Static<typeof marketUpdatePayloadSchema>;
export type ExchangeWithCryptocurrencies = Static<
    typeof exchangeWithCryptocurrenciesSchema
>;
export type TransferableSubscription = Static<
    typeof transferableSubscriptionSchema
>;
export type TransferableRoute = Static<typeof transferableRouteSchema>;
export type TransferableExchange = Static<typeof transferableExchangeSchema>;
export type ListTransferableCoinsInput = Static<
    typeof listTransferableCoinsInputSchema
>;
export type TransferableCoins = Static<typeof transferableCoinsSchema>;
