import { os } from "@orpc/server";
import { reset } from "drizzle-seed";
import z from "zod";

import { database } from "../../database/connection";
import { chainTable } from "../chain/chain.sql";
import { cryptocurrencyTable } from "../cryptocurrency/cryptocurrency.sql";
import { exchangeCryptocurrencyChainTable } from "../exchange-cryptocurrency-chain/exchange-cryptocurrency-chain.sql";
import { exchangeCryptocurrencyTable } from "../exchange-cryptocurrency/exchange-cryptocurrency.sql";
import { exchangeTable } from "../exchange/exchange.sql";

const clearDatabase = os.output(z.void()).handler(async () => {
  await reset(database, {
    cryptocurrency: cryptocurrencyTable,
    exchange: exchangeTable,
    chain: chainTable,
    exchangeCryptocurrency: exchangeCryptocurrencyTable,
    exchangeCryptocurrencyChain: exchangeCryptocurrencyChainTable,
  });
});

const ping = os.output(z.literal("OK")).handler(() => {
  return "OK";
});

export const utilityRouter = {
  clearDatabase,
  ping,
};
