import { exchangeTable } from "./exchange.sql";

export type Exchange = typeof exchangeTable.$inferSelect;
