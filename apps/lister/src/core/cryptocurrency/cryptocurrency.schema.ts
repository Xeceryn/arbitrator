import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-typebox";
import { t } from "elysia";

import {
    createPaginatedOutputSchema,
    createPaginationInputSchema,
} from "../../common/pagination.schema";
import { fromDrizzle, literalUnion, typedSchema } from "../../common/typebox";
import { chainSelectSchema } from "../chain/chain.schema";
import type { ChainSelect } from "../chain/chain.type";
import { exchangeSelectSchema } from "../exchange/exchange.schema";
import type { ExchangeSelect } from "../exchange/exchange.type";
import { cryptocurrency } from "./cryptocurrency.sql";

/**
 * Static shapes of the drizzle-generated schemas. Drizzle stays the source of
 * truth: these are attached to the TypeBox values so `Static<typeof schema>`
 * agrees with the columns the repository reads and writes.
 */
type CryptocurrencyRow = typeof cryptocurrency.$inferSelect;
type CryptocurrencyInsertRow = Omit<
    typeof cryptocurrency.$inferInsert,
    "createdAt" | "updatedAt"
>;
type CryptocurrencyUpdateRow = Partial<Omit<CryptocurrencyInsertRow, "logo">>;

/** One side of a transfer route: the coin's market on an exchange. */
type CryptocurrencyRouteEndpointRow = {
    marketId: number;
    exchange: ExchangeSelect;
    tradeEnabled: boolean;
};

/** A directed transfer route for one coin, over a shared withdraw/deposit chain. */
type CryptocurrencyRouteRow = {
    chain: ChainSelect;
    from: CryptocurrencyRouteEndpointRow;
    to: CryptocurrencyRouteEndpointRow;
};

type CryptocurrencyRoutesRow = {
    exchanges: CryptocurrencyRouteEndpointRow[];
    routes: CryptocurrencyRouteRow[];
};

const cryptocurrencyInsertColumns = fromDrizzle(
    createInsertSchema(cryptocurrency),
);
const cryptocurrencyUpdateColumns = fromDrizzle(
    createUpdateSchema(cryptocurrency),
);

export const cryptocurrencySelectSchema = fromDrizzle<CryptocurrencyRow>(
    createSelectSchema(cryptocurrency),
);
export const cryptocurrencyInsertSchema = typedSchema<CryptocurrencyInsertRow>(
    t.Omit(cryptocurrencyInsertColumns, ["createdAt", "updatedAt"]),
);
export const cryptocurrencyUpdateSchema = typedSchema<CryptocurrencyUpdateRow>(
    t.Omit(cryptocurrencyUpdateColumns, ["logo", "createdAt", "updatedAt"]),
);

/** Searchable columns: no timestamps, no logo. */
export const cryptocurrencySearchByKeys = [
    "id",
    "name",
    "symbol",
    "slug",
    "cmcId",
] as const;

/** Sortable columns: everything but the logo. */
export const cryptocurrencyOrderByKeys = [
    ...cryptocurrencySearchByKeys,
    "createdAt",
    "updatedAt",
] as const;

export const cryptocurrencySearchByKeysSchema = literalUnion(
    cryptocurrencySearchByKeys,
);
export const cryptocurrencyOrderByKeysSchema = literalUnion(
    cryptocurrencyOrderByKeys,
);

export const listCryptocurrencySelectSchema = createPaginationInputSchema({
    searchByKeys: cryptocurrencySearchByKeys,
    orderByKeys: cryptocurrencyOrderByKeys,
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
export const cryptocurrencyRouteEndpointSchema =
    typedSchema<CryptocurrencyRouteEndpointRow>(
        t.Object({
            marketId: t.Integer(),
            exchange: exchangeSelectSchema,
            tradeEnabled: t.Boolean(),
        }),
    );

/**
 * A directed transfer route for one coin: `from` can withdraw the coin on
 * `chain` and `to` can deposit it on the same chain.
 */
export const cryptocurrencyRouteSchema = typedSchema<CryptocurrencyRouteRow>(
    t.Object({
        chain: chainSelectSchema,
        from: cryptocurrencyRouteEndpointSchema,
        to: cryptocurrencyRouteEndpointSchema,
    }),
);

/**
 * Transfer routes for one coin, as a matrix-friendly read-model: every market
 * the coin is assigned to (`exchanges`) plus the directed pairs that can move
 * it between them (`routes`).
 */
export const cryptocurrencyRoutesSchema = typedSchema<CryptocurrencyRoutesRow>(
    t.Object({
        exchanges: t.Array(cryptocurrencyRouteEndpointSchema),
        routes: t.Array(cryptocurrencyRouteSchema),
    }),
);
