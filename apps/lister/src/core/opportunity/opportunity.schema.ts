import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

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
