import {
    createInsertSchema,
    createSelectSchema,
    createUpdateSchema,
} from "drizzle-typebox";
import { t } from "elysia";

import { extendSchema, fromDrizzle, typedSchema } from "../../common/typebox";
import { chainSelectSchema } from "../chain/chain.schema";
import type { ChainSelect } from "../chain/chain.type";
import { chainLink } from "./chain-link.sql";

/**
 * Static shapes of the drizzle-generated schemas. Drizzle stays the source of
 * truth: these are attached to the TypeBox values so `Static<typeof schema>`
 * agrees with the columns the repository reads and writes.
 */
type ChainLinkRow = typeof chainLink.$inferSelect;
type ChainLinkInsertRow = Omit<
    typeof chainLink.$inferInsert,
    "createdAt" | "updatedAt"
>;
type ChainLinkUpdateRow = Partial<ChainLinkInsertRow>;
type ChainLinkFilterExistsRow = Pick<ChainLinkRow, "marketId" | "chainId">;
type ChainLinkWithChainRow = ChainLinkRow & { chain: ChainSelect };

const chainLinkInsertColumns = fromDrizzle(createInsertSchema(chainLink));
const chainLinkUpdateColumns = fromDrizzle(createUpdateSchema(chainLink));

export const chainLinkInsertSchema = typedSchema<ChainLinkInsertRow>(
    t.Omit(chainLinkInsertColumns, ["createdAt", "updatedAt"]),
);
export const chainLinkUpdateSchema = typedSchema<ChainLinkUpdateRow>(
    t.Omit(chainLinkUpdateColumns, ["createdAt", "updatedAt"]),
);
export const chainLinkSelectSchema = fromDrizzle<ChainLinkRow>(
    createSelectSchema(chainLink),
);

/** The `(market, chain)` pair that identifies an existing link. */
export const chainLinkFilterExistsSchema =
    typedSchema<ChainLinkFilterExistsRow>(
        t.Pick(chainLinkSelectSchema, ["marketId", "chainId"]),
    );

/** A chain-link row with its chain embedded. */
export const chainLinkWithChainSchema = extendSchema<ChainLinkWithChainRow>(
    chainLinkSelectSchema,
    { chain: chainSelectSchema },
);
