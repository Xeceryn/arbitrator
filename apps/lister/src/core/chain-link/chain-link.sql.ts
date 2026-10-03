import * as pg from "drizzle-orm/pg-core";

import { addDefaultTimestampFields } from "../../utils/drizzle.util";
import { chainTable } from "../chain/chain.sql";
import { marketTable } from "../market/market.sql";

export const chainLinkTable = pg.pgTable("chain_link", {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
  marketId: pg
    .integer()
    .notNull()
    .references(() => marketTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  chainId: pg
    .integer()
    .notNull()
    .references(() => chainTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  withdrawEnabled: pg.boolean().notNull().default(true),
  depositEnabled: pg.boolean().notNull().default(true),
  ...addDefaultTimestampFields(),
});
