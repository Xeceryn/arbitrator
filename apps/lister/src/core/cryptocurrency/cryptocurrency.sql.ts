import * as pg from "drizzle-orm/pg-core";

import { addDefaultTimestampFields } from "../../utils/drizzle.util";

export const cryptocurrency = pg.pgTable("cryptocurrency", {
    id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
    name: pg.varchar({ length: 255 }).notNull(),
    symbol: pg.varchar({ length: 255 }).notNull(),
    slug: pg.varchar({ length: 255 }).notNull().unique(),
    logo: pg.varchar({ length: 255 }).notNull(),
    cmcId: pg.integer().notNull().unique(),
    ...addDefaultTimestampFields(),
});
