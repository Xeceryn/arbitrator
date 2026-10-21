import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-typebox";
import { t } from "elysia";
import type { Static } from "typebox";

import { extendSchema, fromDrizzle, typedSchema } from "../../common/typebox";
import { cryptocurrencySelectSchema } from "../cryptocurrency/cryptocurrency.schema";
import type { CryptocurrencySelect } from "../cryptocurrency/cryptocurrency.type";
import { exchangeSelectSchema } from "../exchange/exchange.schema";
import type { ExchangeSelect } from "../exchange/exchange.type";
import { market } from "./market.sql";

/**
 * Static shapes of the drizzle-generated schemas. Drizzle stays the source of
 * truth: these are attached to the TypeBox values so `Static<typeof schema>`
 * agrees with the columns the repository reads and writes.
 */
type MarketRow = typeof market.$inferSelect;
type MarketInsertRow = Omit<
    typeof market.$inferInsert,
    "createdAt" | "updatedAt"
>;
type MarketUpdateRow = Partial<MarketInsertRow>;
type MarketFilterExistsRow = Pick<MarketRow, "exchangeId" | "cryptocurrencyId">;
type MarketWithRelationsRow = MarketRow & {
    exchange: ExchangeSelect;
    cryptocurrency: CryptocurrencySelect;
};

/** Input for `market.assign`: the pair plus the two editable fields. */
export type MarketAssign = MarketFilterExistsRow & {
    exchangeSymbol?: string;
    tradeEnabled?: boolean;
};

/** Editable fields of an assignment, keyed by the (exchange, coin) pair. */
export type MarketUpdatePayload = MarketFilterExistsRow & {
    tradeEnabled?: boolean;
    exchangeSymbol?: string;
};

/** A coin plus the market metadata for one exchange. */
export type CryptocurrencyWithMarket = CryptocurrencySelect & {
    marketId: number;
    tradeEnabled: boolean;
    exchangeSymbol: string;
};

const marketInsertColumns = fromDrizzle(createInsertSchema(market));
const marketUpdateColumns = fromDrizzle(createUpdateSchema(market));

export const marketInsertSchema = typedSchema<MarketInsertRow>(
    t.Omit(marketInsertColumns, ["createdAt", "updatedAt"]),
);

export const marketUpdateSchema = typedSchema<MarketUpdateRow>(
    t.Omit(marketUpdateColumns, ["createdAt", "updatedAt"]),
);

export const marketSelectSchema = fromDrizzle<MarketRow>(
    createSelectSchema(market),
);

export const marketFilterExistsSchema = typedSchema<MarketFilterExistsRow>(
    t.Pick(marketSelectSchema, ["exchangeId", "cryptocurrencyId"]),
);

/** A market row with its exchange and cryptocurrency embedded. */
export const marketWithRelationsSchema = extendSchema<MarketWithRelationsRow>(
    marketSelectSchema,
    {
        exchange: exchangeSelectSchema,
        cryptocurrency: cryptocurrencySelectSchema,
    },
);

/**
 * Input for `market.assign`. `exchangeSymbol` is optional and defaults to the
 * coin's symbol; `tradeEnabled` defaults to enabled.
 */
export const marketAssignSchema = typedSchema<MarketAssign>(
    t.Intersect([
        t.Pick(marketInsertSchema, ["exchangeId", "cryptocurrencyId"]),
        t.Object({
            exchangeSymbol: t.Optional(t.String({ maxLength: 255 })),
            tradeEnabled: t.Optional(t.Boolean({ default: true })),
        }),
    ]),
);

/** Editable fields of an assignment, keyed by the (exchange, coin) pair. */
export const marketUpdatePayloadSchema = typedSchema<MarketUpdatePayload>(
    t.Intersect([
        t.Pick(marketSelectSchema, ["exchangeId", "cryptocurrencyId"]),
        t.Object({
            tradeEnabled: t.Optional(t.Boolean()),
            exchangeSymbol: t.Optional(t.String({ maxLength: 255 })),
        }),
    ]),
);

/** A coin plus the market metadata for one exchange. */
export const cryptocurrencyWithMarketSchema =
    extendSchema<CryptocurrencyWithMarket>(cryptocurrencySelectSchema, {
        marketId: t.Integer(),
        tradeEnabled: t.Boolean(),
        exchangeSymbol: t.String(),
    });

export const exchangeWithCryptocurrenciesSchema = extendSchema<
    ExchangeSelect & { cryptocurrencies: CryptocurrencyWithMarket[] }
>(exchangeSelectSchema, {
    cryptocurrencies: t.Array(cryptocurrencyWithMarketSchema),
});

export const listExchangeWithMetadataSchema = extendSchema<
    ExchangeSelect & { cryptocurrencies: CryptocurrencySelect[] }
>(exchangeSelectSchema, {
    cryptocurrencies: t.Array(cryptocurrencySelectSchema),
});

export type MarketInsert = Static<typeof marketInsertSchema>;

export type MarketUpdate = Static<typeof marketUpdateSchema>;

export type MarketSelect = Static<typeof marketSelectSchema>;

export type MarketFilterExists = Static<typeof marketFilterExistsSchema>;

/* -------------------------------------------------------------------------- */
/* Transferable-coin read-model (sender orchestrator)                          */
/* -------------------------------------------------------------------------- */

/** A coin an exchange's worker must subscribe to. */
export const transferableSubscriptionSchema = t.Object({
    exchangeId: t.Integer(),
    cmcId: t.Integer(),
    symbol: t.String(),
});

/** Provenance for why a pair is included: which chain, one direction. */
export const transferableRouteSchema = t.Object({
    aExchangeId: t.Integer(),
    bExchangeId: t.Integer(),
    cmcId: t.Integer(),
    chainId: t.Integer(),
});

export const transferableExchangeSchema = typedSchema<
    Pick<ExchangeSelect, "id" | "slug" | "baseCurrency">
>(t.Pick(exchangeSelectSchema, ["id", "slug", "baseCurrency"]));

export const listTransferableCoinsInputSchema = t.Object({
    exchangeIds: t.Array(t.Integer(), { minItems: 2 }),
});

export const transferableCoinsSchema = t.Object({
    exchanges: t.Array(transferableExchangeSchema),
    subscriptions: t.Array(transferableSubscriptionSchema),
    routes: t.Array(transferableRouteSchema),
});
