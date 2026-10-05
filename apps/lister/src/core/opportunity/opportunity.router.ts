import { os } from "@orpc/server";

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
const sync = os
  .input(opportunitySyncInputSchema)
  .output(opportunitySyncOutputSchema)
  .handler(async ({ input }) => {
    return await Opportunity.sync(input.exchangeIds);
  });

/** Profitable signals (`profitPercentage > 0`) for the signal board. */
const list = os
  .input(opportunityListInputSchema)
  .output(opportunityListOutputSchema)
  .handler(async ({ input }) => {
    return await Opportunity.list(input);
  });

export const opportunityRouter = {
  sync,
  list,
};
