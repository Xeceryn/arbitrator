import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { t } from "elysia";
import type { Static } from "typebox";

import { fromDrizzle, typedSchema } from "../../common/typebox";
import { opportunity } from "./opportunity.sql";

/**
 * Static shapes of the drizzle-generated schemas. Drizzle stays the source of
 * truth: these are attached to the TypeBox values so `Static<typeof schema>`
 * agrees with the columns the repository reads and writes.
 */
type OpportunityRow = typeof opportunity.$inferSelect;
type OpportunityInsertRow = typeof opportunity.$inferInsert;
type OpportunityUpdateRow = Omit<
    OpportunityInsertRow,
    "cmcId" | "buyExchangeId" | "sellExchangeId"
>;

const opportunityInsertColumns = fromDrizzle(createInsertSchema(opportunity));

export const opportunitySchema = fromDrizzle<OpportunityRow>(
    createSelectSchema(opportunity),
);
export type Opportunity = Static<typeof opportunitySchema>;

export const opportunityInsertSchema = typedSchema<OpportunityInsertRow>(
    opportunityInsertColumns,
);
export type OpportunityInsert = Static<typeof opportunityInsertSchema>;

export const opportunityUpdateSchema = typedSchema<OpportunityUpdateRow>(
    t.Omit(opportunityInsertColumns, [
        "cmcId",
        "buyExchangeId",
        "sellExchangeId",
    ]),
);
export type OpportunityUpdate = Static<typeof opportunityUpdateSchema>;

/**
 * Input for `opportunity.sync`: the currently started exchanges. The handler
 * derives every directed transferable leg from them and reconciles the table.
 */
export const opportunitySyncInputSchema = t.Object({
    exchangeIds: t.Array(t.Integer()),
});
export type OpportunitySyncInput = Static<typeof opportunitySyncInputSchema>;

export const opportunitySyncOutputSchema = t.Object({
    created: t.Integer(),
    updated: t.Integer(),
    deleted: t.Integer(),
});
export type OpportunitySyncOutput = Static<typeof opportunitySyncOutputSchema>;

/* -------------------------------------------------------------------------- */
/* Signal read-model (UI signal board)                                         */
/* -------------------------------------------------------------------------- */

export const opportunitySignalExchangeSchema = t.Object({
    id: t.Integer(),
    name: t.String(),
    slug: t.String(),
    logo: t.String(),
    baseCurrency: t.UnionEnum(["usdt", "idr"]),
});
export type OpportunitySignalExchange = Static<
    typeof opportunitySignalExchangeSchema
>;

export const opportunitySignalCoinSchema = t.Object({
    cmcId: t.Integer(),
    name: t.String(),
    symbol: t.String(),
    logo: t.String(),
});
export type OpportunitySignalCoin = Static<typeof opportunitySignalCoinSchema>;

export const opportunitySignalSchema = t.Object({
    id: t.Integer(),
    cmcId: t.Integer(),
    buyExchangeId: t.Integer(),
    sellExchangeId: t.Integer(),
    buyExchangeSymbol: t.String(),
    sellExchangeSymbol: t.String(),
    buyPrice: t.Number(),
    sellPrice: t.Number(),
    buyVolume: t.Number(),
    sellVolume: t.Number(),
    profitPercentage: t.Number(),
    profitVolume: t.Number(),
    buyExchange: opportunitySignalExchangeSchema,
    sellExchange: opportunitySignalExchangeSchema,
    coin: opportunitySignalCoinSchema,
});
export type OpportunitySignal = Static<typeof opportunitySignalSchema>;

export const opportunityListInputSchema = t.Object({
    orderBy: t.UnionEnum(["profitPercentage", "profitVolume"], {
        default: "profitPercentage",
    }),
    order: t.UnionEnum(["asc", "desc"], { default: "desc" }),
});
export type OpportunityListInput = Static<typeof opportunityListInputSchema>;

export const opportunityListOutputSchema = t.Array(opportunitySignalSchema);
export type OpportunityListOutput = Static<typeof opportunityListOutputSchema>;
