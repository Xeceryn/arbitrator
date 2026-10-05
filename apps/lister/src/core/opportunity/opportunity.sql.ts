import { SQL, sql } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

import { cryptocurrency } from "../cryptocurrency/cryptocurrency.sql";
import { exchange } from "../exchange/exchange.sql";

export const opportunity = pg.pgTable("opportunity", {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),

  cmcId: pg
    .integer()
    .notNull()
    .references(() => cryptocurrency.cmcId),
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

  /** Per-exchange tickers of the coin on each leg (e.g. `GOLD(PAXG)`, `PAXG`). */
  buyExchangeSymbol: pg.varchar({ length: 255 }).notNull().default(""),
  sellExchangeSymbol: pg.varchar({ length: 255 }).notNull().default(""),

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
