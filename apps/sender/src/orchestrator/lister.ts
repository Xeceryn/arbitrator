import { listerClient } from "@arbitrator/sdk";

import type { ListerGateway, TransferableCoinsResult } from "./service";

export function createListerGateway(): ListerGateway {
  return {
    async resolveExchangeIds(slugs) {
      const [error, result] = await listerClient.exchange.list({ limit: -1 });
      if (error) throw error;
      if (!result) return new Map();

      const wanted = new Set(slugs);
      const map = new Map<string, number>();
      for (const row of result.data) {
        if (wanted.has(row.slug)) map.set(row.slug, row.id);
      }
      return map;
    },

    async listTransferableCoins(input) {
      const [error, result] =
        await listerClient.market.listTransferableCoins(input);
      if (error) throw error;
      if (!result) throw new Error("lister returned no transferable coins");

      return result as TransferableCoinsResult;
    },

    async syncOpportunities(exchangeIds) {
      const [error] = await listerClient.opportunity.sync({ exchangeIds });
      if (error) throw error;
    },
  };
}
