import * as pg from "drizzle-orm/pg-core";
import { addDefaultTimestampFields } from "../../utils/drizzle.util";

export const cryptocurrencyTable = pg.pgTable("cryptocurrency", {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: pg.varchar({ length: 255 }).notNull(),
  symbol: pg.varchar({ length: 255 }).notNull(),
  slug: pg.varchar({ length: 255 }).notNull().unique(),
  cmcId: pg.integer().notNull().unique(),
  ...addDefaultTimestampFields(),
});
