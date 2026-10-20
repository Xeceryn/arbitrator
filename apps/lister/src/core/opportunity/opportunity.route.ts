import { Elysia } from "elysia";

import { Opportunity } from "./opportunity";
import {
    opportunityListInputSchema,
    opportunityListOutputSchema,
    opportunitySyncInputSchema,
    opportunitySyncOutputSchema,
} from "./opportunity.schema";

/**
 * Opportunity lifecycle. The sender owns creation/deletion: it calls `sync`
 * with the currently started exchanges whenever start/stop or metadata changes,
 * and we reconcile the table against the derived directed transferable legs.
 * The receiver updates prices/volumes directly in the database.
 */
export const opportunityRoutes = new Elysia({
    name: "opportunity",
    prefix: "/opportunity",
    tags: ["opportunity"],
})
    /** Profitable signals (`profitPercentage > 0`) for the signal board. */
    .get(
        "",
        {
            query: opportunityListInputSchema,
            response: { 200: opportunityListOutputSchema },
            detail: { summary: "List profitable opportunities" },
        },
        async ({ query }) => await Opportunity.list(query),
    )
    .post(
        "/sync",
        {
            body: opportunitySyncInputSchema,
            response: { 200: opportunitySyncOutputSchema },
            detail: {
                summary: "Reconcile opportunities for started exchanges",
            },
        },
        async ({ body }) => await Opportunity.sync(body.exchangeIds),
    );
