import * as pg from "drizzle-orm/pg-core";
import { addDefaultTimestampFields } from "../../utils/drizzle.util";

export const exchangeBaseCurrencyPgEnum = pg.pgEnum("exchangeBaseCurrency", [
  "usdt",
  "idr",
]);

export const exchangeTable = pg.pgTable("exchange", {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
  cmcId: pg.integer().notNull(),
  name: pg.varchar({ length: 255 }).notNull(),
  baseCurrency: exchangeBaseCurrencyPgEnum().notNull(),
  ...addDefaultTimestampFields(),
});
