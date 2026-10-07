import * as pg from "drizzle-orm/pg-core";

import { addDefaultTimestampFields } from "../../utils/drizzle.util";
import { cryptocurrency } from "../cryptocurrency/cryptocurrency.sql";
import { exchange } from "../exchange/exchange.sql";

export const market = pg.pgTable("market", {
    id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
    exchangeId: pg
        .integer()
        .notNull()
        .references(() => exchange.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    cryptocurrencyId: pg
        .integer()
        .notNull()
        .references(() => cryptocurrency.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
    tradeEnabled: pg.boolean().notNull(),
    exchangeSymbol: pg.varchar({ length: 255 }).notNull(),
    ...addDefaultTimestampFields(),
});
