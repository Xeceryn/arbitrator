import {
    createSelectSchema,
    createUpdateSchema,
    createInsertSchema,
} from "drizzle-zod";
import z from "zod";

import {
    createPaginationInputSchema,
    createPaginatedOutputSchema,
} from "../../common/pagination.schema";
import { chainSelectSchema } from "../chain/chain.schema";
import { exchangeSelectSchema } from "../exchange/exchange.schema";
import { cryptocurrency } from "./cryptocurrency.sql";

export const cryptocurrencySelectSchema = createSelectSchema(cryptocurrency);
export const cryptocurrencyInsertSchema = createInsertSchema(
    cryptocurrency,
).omit({
    createdAt: true,
    updatedAt: true,
});

export const cryptocurrencyUpdateSchema = createUpdateSchema(cryptocurrency, {
    cmcId: z.coerce.number().optional(),
}).omit({
    logo: true,
    createdAt: true,
    updatedAt: true,
});
export const cryptocurrencySearchByKeysSchema = z.keyof(
    cryptocurrencySelectSchema.omit({
        createdAt: true,
        updatedAt: true,
        logo: true,
    }),
);
export const cryptocurrencyOrderByKeysSchema = z.keyof(
    cryptocurrencySelectSchema.omit({
        logo: true,
    }),
);
export const listCryptocurrencySelectSchema = createPaginationInputSchema({
    searchByKeys: cryptocurrencySearchByKeysSchema,
    orderByKeys: cryptocurrencyOrderByKeysSchema,
    defaultSearchBy: "symbol",
    defaultOrderBy: "cmcId",
});
export const paginatedCryptocurrencySelectSchema = createPaginatedOutputSchema(
    cryptocurrencySelectSchema,
);

/**
 * One side of a transfer route: the coin's market on an exchange, plus whether
 * trading is enabled for that market.
 */
export const cryptocurrencyRouteEndpointSchema = z.object({
    marketId: z.number(),
    exchange: exchangeSelectSchema,
    tradeEnabled: z.boolean(),
});

/**
 * A directed transfer route for one coin: `from` can withdraw the coin on
 * `chain` and `to` can deposit it on the same chain.
 */
export const cryptocurrencyRouteSchema = z.object({
    chain: chainSelectSchema,
    from: cryptocurrencyRouteEndpointSchema,
    to: cryptocurrencyRouteEndpointSchema,
});

/**
 * Transfer routes for one coin, as a matrix-friendly read-model: every market
 * the coin is assigned to (`exchanges`) plus the directed pairs that can move
 * it between them (`routes`).
 */
export const cryptocurrencyRoutesSchema = z.object({
    exchanges: z.array(cryptocurrencyRouteEndpointSchema),
    routes: z.array(cryptocurrencyRouteSchema),
});
