import { os } from "@orpc/server";
import { reset } from "drizzle-seed";
import z from "zod";

import { database } from "../../database/connection";
import { chainLink } from "../chain-link/chain-link.sql";
import { chain } from "../chain/chain.sql";
import { cryptocurrency } from "../cryptocurrency/cryptocurrency.sql";
import { exchange } from "../exchange/exchange.sql";
import { market } from "../market/market.sql";

const clearDatabase = os.output(z.void()).handler(async () => {
    await reset(database, {
        cryptocurrency: cryptocurrency,
        exchange: exchange,
        chain: chain,
        market: market,
        chainLink: chainLink,
    });
});

const ping = os.output(z.literal("OK")).handler(() => {
    return "OK";
});

export const utilityRouter = {
    clearDatabase,
    ping,
};
