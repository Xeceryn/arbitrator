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
  deleted: z.number().int(),
});
export type OpportunitySyncOutput = z.infer<typeof opportunitySyncOutputSchema>;
