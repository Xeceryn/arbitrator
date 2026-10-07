import * as pg from "drizzle-orm/pg-core";

import { addDefaultTimestampFields } from "../../utils/drizzle.util";
import { chain } from "../chain/chain.sql";
import { market } from "../market/market.sql";

export const chainLink = pg.pgTable("chain_link", {
    id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
    marketId: pg
        .integer()
        .notNull()
        .references(() => market.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    chainId: pg
        .integer()
        .notNull()
        .references(() => chain.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    withdrawEnabled: pg.boolean().notNull().default(true),
    depositEnabled: pg.boolean().notNull().default(true),
    ...addDefaultTimestampFields(),
});
