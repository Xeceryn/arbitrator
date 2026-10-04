import { SQL, sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

import { exchange } from "../exchange/exchange.sql";

export const opportunity = pg.pgTable("opportunity", {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),

  cmcId: pg.integer().notNull(),
  buyExchangeId: pg
    .integer()
    .notNull()
    .references(() => exchange.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  sellExchangeId: pg
    .integer()
    .notNull()
    .references(() => exchange.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),

  buyPrice: pg.doublePrecision().notNull(),
  sellPrice: pg.doublePrecision().notNull(),

  buyVolume: pg.doublePrecision().notNull(),
  sellVolume: pg.doublePrecision().notNull(),

  profitPercentage: pg.doublePrecision().generatedAlwaysAs(
    (): SQL => sql`
      COALESCE(
        (${opportunity.sellPrice} - ${opportunity.buyPrice})
        / NULLIF(${opportunity.buyPrice}, 0),
        0
      )
    `,
  ),

  profitVolume: pg.doublePrecision().generatedAlwaysAs(
    (): SQL => sql`
      LEAST(${opportunity.buyVolume}, ${opportunity.sellVolume})
      * COALESCE(
        (${opportunity.sellPrice} - ${opportunity.buyPrice})
        / NULLIF(${opportunity.buyPrice}, 0),
        0
      )
    `,
  ),
});
