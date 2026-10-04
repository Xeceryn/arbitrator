import { os } from "@orpc/server";

import { Opportunity } from "./opportunity";
import {
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

export const opportunityRouter = {
  sync,
};
