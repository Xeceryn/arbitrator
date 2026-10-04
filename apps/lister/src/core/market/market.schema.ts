import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import z from "zod";

import { cryptocurrencySelectSchema } from "../cryptocurrency/cryptocurrency.schema";
import { exchangeSelectSchema } from "../exchange/exchange.schema";
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

/** A market row with its exchange and cryptocurrency embedded. */
export const marketWithRelationsSchema = marketSelectSchema.extend({
  exchange: exchangeSelectSchema,
  cryptocurrency: cryptocurrencySelectSchema,
});

/**
 * Input for `market.assign`. `exchangeSymbol` is optional and defaults to the
 * coin's symbol; `tradeEnabled` defaults to enabled.
 */
export const marketAssignSchema = marketInsertSchema
  .pick({ exchangeId: true, cryptocurrencyId: true })
  .extend({
    exchangeSymbol: marketInsertSchema.shape.exchangeSymbol.optional(),
    tradeEnabled: marketInsertSchema.shape.tradeEnabled.default(true),
  });

/** Editable fields of an assignment, keyed by the (exchange, coin) pair. */
export const marketUpdatePayloadSchema = marketSelectSchema
  .pick({ exchangeId: true, cryptocurrencyId: true })
  .extend({
    tradeEnabled: marketInsertSchema.shape.tradeEnabled.optional(),
    exchangeSymbol: marketInsertSchema.shape.exchangeSymbol.optional(),
  });

/** A coin plus the market metadata for one exchange. */
export const cryptocurrencyWithMarketSchema = cryptocurrencySelectSchema.extend(
  {
    marketId: z.number(),
    tradeEnabled: z.boolean(),
    exchangeSymbol: z.string(),
  },
);

export const exchangeWithCryptocurrenciesSchema = exchangeSelectSchema.extend({
  cryptocurrencies: z.array(cryptocurrencyWithMarketSchema),
});

export const listExchangeWithMetadataSchema = exchangeSelectSchema.extend({
  cryptocurrencies: z.array(cryptocurrencySelectSchema),
});

export type MarketInsert = z.infer<typeof marketInsertSchema>;

export type MarketUpdate = z.infer<typeof marketUpdateSchema>;

export type MarketSelect = z.infer<typeof marketSelectSchema>;

export type MarketFilterExists = z.infer<typeof marketFilterExistsSchema>;

/* -------------------------------------------------------------------------- */
/* Transferable-coin read-model (sender orchestrator)                          */
/* -------------------------------------------------------------------------- */

/** A coin an exchange's worker must subscribe to. */
export const transferableSubscriptionSchema = z.object({
  exchangeId: z.number(),
  cmcId: z.number(),
  symbol: z.string(),
});

/** Provenance for why a pair is included: which chain, one direction. */
export const transferableRouteSchema = z.object({
  aExchangeId: z.number(),
  bExchangeId: z.number(),
  cmcId: z.number(),
  chainId: z.number(),
});

export const transferableExchangeSchema = exchangeSelectSchema.pick({
  id: true,
  slug: true,
  baseCurrency: true,
});

export const listTransferableCoinsInputSchema = z.object({
  exchangeIds: z.array(z.number()).min(2),
});

export const transferableCoinsSchema = z.object({
  exchanges: z.array(transferableExchangeSchema),
  subscriptions: z.array(transferableSubscriptionSchema),
  routes: z.array(transferableRouteSchema),
});
