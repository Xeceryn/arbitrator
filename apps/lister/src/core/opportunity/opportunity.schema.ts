import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { opportunity } from "./opportunity.sql";

export const opportunitySchema = createSelectSchema(opportunity);
export type Opportunity = z.infer<typeof opportunitySchema>;
export const opportunityInsertSchema = createInsertSchema(opportunity);
export type OpportunityInsert = z.infer<typeof opportunityInsertSchema>;
export const opportunityUpdateSchema = createInsertSchema(opportunity).omit({
    cmcId: true,
    buyExchangeId: true,
    sellExchangeId: true,
});
export type OpportunityUpdate = z.infer<typeof opportunityUpdateSchema>;

/**
 * Input for `opportunity.sync`: the currently started exchanges. The handler
 * derives every directed transferable leg from them and reconciles the table.
 */
export const opportunitySyncInputSchema = z.object({
    exchangeIds: z.array(z.number().int()),
});
export type OpportunitySyncInput = z.infer<typeof opportunitySyncInputSchema>;

export const opportunitySyncOutputSchema = z.object({
    created: z.number().int(),
    updated: z.number().int(),
    deleted: z.number().int(),
});
export type OpportunitySyncOutput = z.infer<typeof opportunitySyncOutputSchema>;

/* -------------------------------------------------------------------------- */
/* Signal read-model (UI signal board)                                         */
/* -------------------------------------------------------------------------- */

export const opportunitySignalExchangeSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    slug: z.string(),
    logo: z.string(),
    baseCurrency: z.enum(["usdt", "idr"]),
});
export type OpportunitySignalExchange = z.infer<
    typeof opportunitySignalExchangeSchema
>;

export const opportunitySignalCoinSchema = z.object({
    cmcId: z.number().int(),
    name: z.string(),
    symbol: z.string(),
    logo: z.string(),
});
export type OpportunitySignalCoin = z.infer<typeof opportunitySignalCoinSchema>;

export const opportunitySignalSchema = z.object({
    id: z.number().int(),
    cmcId: z.number().int(),
    buyExchangeId: z.number().int(),
    sellExchangeId: z.number().int(),
    buyExchangeSymbol: z.string(),
    sellExchangeSymbol: z.string(),
    buyPrice: z.number(),
    sellPrice: z.number(),
    buyVolume: z.number(),
    sellVolume: z.number(),
    profitPercentage: z.number(),
    profitVolume: z.number(),
    buyExchange: opportunitySignalExchangeSchema,
    sellExchange: opportunitySignalExchangeSchema,
    coin: opportunitySignalCoinSchema,
});
export type OpportunitySignal = z.infer<typeof opportunitySignalSchema>;

export const opportunityListInputSchema = z.object({
    orderBy: z
        .enum(["profitPercentage", "profitVolume"])
        .default("profitPercentage"),
    order: z.enum(["asc", "desc"]).default("desc"),
});
export type OpportunityListInput = z.infer<typeof opportunityListInputSchema>;

export const opportunityListOutputSchema = z.array(opportunitySignalSchema);
export type OpportunityListOutput = z.infer<typeof opportunityListOutputSchema>;
