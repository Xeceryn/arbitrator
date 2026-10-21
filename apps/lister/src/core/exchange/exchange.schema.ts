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
import { exchange } from "./exchange.sql";

/**
 * Static shapes of the drizzle-generated schemas. Drizzle stays the source of
 * truth: these are attached to the TypeBox values so `Static<typeof schema>`
 * agrees with the columns the repository reads and writes.
 */
type ExchangeRow = typeof exchange.$inferSelect;
type ExchangeInsertRow = Omit<
    typeof exchange.$inferInsert,
    "createdAt" | "updatedAt"
>;
type ExchangeUpdateRow = Partial<ExchangeInsertRow>;

const exchangeInsertColumns = fromDrizzle(createInsertSchema(exchange));
const exchangeUpdateColumns = fromDrizzle(createUpdateSchema(exchange));

export const exchangeInsertSchema = typedSchema<ExchangeInsertRow>(
    t.Omit(exchangeInsertColumns, ["createdAt", "updatedAt"]),
);
export const exchangeUpdateSchema = typedSchema<ExchangeUpdateRow>(
    t.Omit(exchangeUpdateColumns, ["createdAt", "updatedAt"]),
);
export const exchangeSelectSchema = fromDrizzle<ExchangeRow>(
    createSelectSchema(exchange),
);

/** Searchable columns: no timestamps, no logo. */
export const exchangeSearchByKeys = [
    "id",
    "cmcId",
    "name",
    "slug",
    "registeredOnCmc",
    "baseCurrency",
] as const;

/** Sortable columns: everything but the logo. */
export const exchangeOrderByKeys = [
    ...exchangeSearchByKeys,
    "createdAt",
    "updatedAt",
] as const;

export const exchangeSearchByKeysSchema = literalUnion(exchangeSearchByKeys);
export const exchangeOrderByKeysSchema = literalUnion(exchangeOrderByKeys);

export const listExchangeSelectSchema = createPaginationInputSchema({
    searchByKeys: exchangeSearchByKeys,
    orderByKeys: exchangeOrderByKeys,
    defaultSearchBy: "name",
    defaultOrderBy: "id",
});

export const paginatedExchangeSelectSchema =
    createPaginatedOutputSchema(exchangeSelectSchema);
