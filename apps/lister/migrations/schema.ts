import { sql } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  integer,
  varchar,
  boolean,
  timestamp,
  foreignKey,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";

export const exchangeBaseCurrency = pgEnum("exchangeBaseCurrency", [
  "usdt",
  "idr",
]);

export const chain = pgTable(
  "chain",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    code: varchar({ length: 255 }).notNull(),
    createdAt: timestamp()
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp()
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [unique("chain_code_key").on(table.code)],
);

export const chainLink = pgTable("chain_link", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  marketId: integer()
    .notNull()
    .references(() => market.id, { onDelete: "cascade", onUpdate: "cascade" }),
  chainId: integer()
    .notNull()
    .references(() => chain.id, { onDelete: "cascade", onUpdate: "cascade" }),
  withdrawEnabled: boolean().default(true).notNull(),
  depositEnabled: boolean().default(true).notNull(),
  createdAt: timestamp()
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp()
    .default(sql`now()`)
    .notNull(),
});

export const cryptocurrency = pgTable(
  "cryptocurrency",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    symbol: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull(),
    logo: varchar({ length: 255 }).notNull(),
    cmcId: integer().notNull(),
    createdAt: timestamp()
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp()
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [
    unique("cryptocurrency_cmcId_key").on(table.cmcId),
    unique("cryptocurrency_slug_key").on(table.slug),
  ],
);

export const exchange = pgTable(
  "exchange",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    cmcId: integer().notNull(),
    name: varchar({ length: 255 }).notNull(),
    slug: varchar({ length: 255 }).notNull(),
    logo: varchar({ length: 255 }).notNull(),
    registeredOnCmc: boolean().default(true).notNull(),
    baseCurrency: exchangeBaseCurrency().notNull(),
    createdAt: timestamp()
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp()
      .default(sql`now()`)
      .notNull(),
  },
  (table) => [
    unique("exchange_cmcId_key").on(table.cmcId),
    unique("exchange_slug_key").on(table.slug),
  ],
);

export const market = pgTable("market", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  exchangeId: integer()
    .notNull()
    .references(() => exchange.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  cryptocurrencyId: integer()
    .notNull()
    .references(() => cryptocurrency.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  exchangeSymbol: varchar({ length: 255 }).notNull(),
  createdAt: timestamp()
    .default(sql`now()`)
    .notNull(),
  updatedAt: timestamp()
    .default(sql`now()`)
    .notNull(),
});
