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
import { chain } from "./chain.sql";

/**
 * Static shapes of the drizzle-generated schemas. Drizzle stays the source of
 * truth: these are attached to the TypeBox values so `Static<typeof schema>`
 * agrees with the columns the repository reads and writes.
 */
type ChainRow = typeof chain.$inferSelect;
type ChainInsertRow = Omit<
    typeof chain.$inferInsert,
    "createdAt" | "updatedAt"
>;
type ChainUpdateRow = Partial<ChainInsertRow>;

const chainInsertColumns = fromDrizzle(createInsertSchema(chain));
const chainUpdateColumns = fromDrizzle(createUpdateSchema(chain));

export const chainInsertSchema = typedSchema<ChainInsertRow>(
    t.Omit(chainInsertColumns, ["createdAt", "updatedAt"]),
);
export const chainUpdateSchema = typedSchema<ChainUpdateRow>(
    t.Omit(chainUpdateColumns, ["createdAt", "updatedAt"]),
);
export const chainSelectSchema = fromDrizzle<ChainRow>(
    createSelectSchema(chain),
);

/** Searchable columns: no id, no timestamps. */
export const chainSearchByKeys = ["name", "code"] as const;

/** Sortable columns: every column. */
export const chainOrderByKeys = [
    "id",
    ...chainSearchByKeys,
    "createdAt",
    "updatedAt",
] as const;

export const chainSearchByKeysSchema = literalUnion(chainSearchByKeys);
export const chainOrderByKeysSchema = literalUnion(chainOrderByKeys);

export const listChainSelectSchema = createPaginationInputSchema({
    searchByKeys: chainSearchByKeys,
    orderByKeys: chainOrderByKeys,
    defaultSearchBy: "name",
    defaultOrderBy: "id",
});

export const paginatedChainSelectSChema =
    createPaginatedOutputSchema(chainSelectSchema);
