import { cryptocurrencyTable } from "./cryptocurrency.sql";

export type Cryptocurrency = typeof cryptocurrencyTable.$inferSelect;
