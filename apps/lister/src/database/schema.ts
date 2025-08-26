import { SQL } from "drizzle-orm";
import * as pg from "drizzle-orm/pg-core";

function addDefaultTimestampFields() {
  return {
    createdAt: pg.timestamp().notNull().defaultNow(),
    updatedAt: pg
      .timestamp()
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
  };
}

const cryptocurrency = pg.pgTable("cryptocurrency", {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
  name: pg.varchar({ length: 255 }).notNull(),
  symbol: pg.varchar({ length: 255 }).notNull(),
  cmcId: pg.integer().notNull(),
  ...addDefaultTimestampFields(),
});

const exchangeBaseCurrencyPgEnum = pg.pgEnum("exchangeBaseCurrency", [
  "usdt",
  "idr",
]);

const exchange = pg.pgTable("exchange", {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
  cmcId: pg.integer().notNull(),
  name: pg.varchar({ length: 255 }).notNull(),
  baseCurrency: exchangeBaseCurrencyPgEnum().notNull(),
  ...addDefaultTimestampFields(),
});

const chain = pg.pgTable("chain", {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
  cmcId: pg.integer().notNull(),
  name: pg.varchar({ length: 255 }).notNull(),
  ...addDefaultTimestampFields(),
});

// relation
const exchangeCryptocurrency = pg.pgTable("exchange_cryptocurrency", {
  id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
  exchangeId: pg.integer().notNull(),
  cryptocurrencyId: pg.integer().notNull(),
  exchangeSymbol: pg.varchar({ length: 255 }).notNull(),
  ...addDefaultTimestampFields(),
});

const exchangeCryptocurrencyChain = pg.pgTable(
  "exchange_cryptocurrency_chain",
  {
    id: pg.integer().primaryKey().generatedAlwaysAsIdentity(),
    exchangeCryptocurrencyId: pg.integer().notNull(),
    chainId: pg.integer().notNull(),
    withdrawEnabled: pg.boolean().notNull().default(true),
    depositEnabled: pg.boolean().notNull().default(true),
    ...addDefaultTimestampFields(),
  },
);

export const Tables = {
  cryptocurrency,
  exchange,
  chain,
  exchangeCryptocurrency,
  exchangeCryptocurrencyChain,
};
