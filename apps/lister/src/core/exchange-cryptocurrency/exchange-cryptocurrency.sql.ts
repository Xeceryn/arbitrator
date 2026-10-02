import * as pg from "drizzle-orm/pg-core";

import { addDefaultTimestampFields } from "../../utils/drizzle.util";
import { cryptocurrencyTable } from "../cryptocurrency/cryptocurrency.sql";
import { exchangeTable } from "../exchange/exchange.sql";

export const exchangeCryptocurrencyTable = pg.pgTable(
  "exchange_cryptocurrency",
  {
    id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
    exchangeId: pg
      .integer()
      .notNull()
      .references(() => exchangeTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    cryptocurrencyId: pg
      .integer()
      .notNull()
      .references(() => cryptocurrencyTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    exchangeSymbol: pg.varchar({ length: 255 }).notNull(),
    ...addDefaultTimestampFields(),
  },
);
