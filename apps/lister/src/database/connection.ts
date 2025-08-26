import { drizzle } from "drizzle-orm/bun-sql";
import * as exchangeTables from "../core/exchange/exchange.sql";
import * as cryptocurrencyTables from "../core/cryptocurrency/cryptocurrency.sql";
import * as chainTables from "../core/chain/chain.sql";
import * as exchangeCryptocurrencyTables from "../core/exchange-cryptocurrency/exchange-cryptocurrency.sql";
import * as exchangeCryptocurrencyChainTables from "../core/exchange-cryptocurrency-chain/exchange-cryptocurrency-chain.sql";

export const postgresConnection = new Bun.SQL(
  "postgres://sulthonuladib:123456@localhost:5432/lister",
);

export const database = drizzle(postgresConnection, {
  schema: {
    exchangeTables,
    cryptocurrencyTables,
    chainTables,
    exchangeCryptocurrencyTables,
    exchangeCryptocurrencyChainTables,
  },
});
