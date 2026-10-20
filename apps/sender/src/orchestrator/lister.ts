import { lister } from "@arbitrator/sdk";

import type { ListerGateway, TransferableCoinsResult } from "./service";

export function createListerGateway(): ListerGateway {
    return {
        async resolveExchangeIds(slugs) {
            const { data, error } = await lister.exchange.get({
                query: { limit: -1 },
            });
            if (error) throw error;
            if (!data) return new Map();

            const wanted = new Set(slugs);
            const map = new Map<string, number>();
            for (const row of data.data) {
                if (wanted.has(row.slug)) map.set(row.slug, row.id);
            }
            return map;
        },

        async listTransferableCoins(input) {
            const { data, error } = await lister.market[
                "transferable-coins"
            ].post({
                exchangeIds: input.exchangeIds,
            });
            if (error) throw error;
            if (!data) throw new Error("lister returned no transferable coins");

            return data as TransferableCoinsResult;
        },

        async syncOpportunities(exchangeIds) {
            const { error } = await lister.opportunity.sync.post({
                exchangeIds,
            });
            if (error) throw error;
        },
    };
}
