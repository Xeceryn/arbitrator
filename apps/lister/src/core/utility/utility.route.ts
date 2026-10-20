import { reset } from "drizzle-seed";
import { Elysia, t } from "elysia";

import { database } from "../../database/connection";
import { chainLink } from "../chain-link/chain-link.sql";
import { chain } from "../chain/chain.sql";
import { cryptocurrency } from "../cryptocurrency/cryptocurrency.sql";
import { exchange } from "../exchange/exchange.sql";
import { market } from "../market/market.sql";

export const utilityRoutes = new Elysia({
    name: "utility",
    prefix: "/utility",
    tags: ["utility"],
})
    .get(
        "/ping",
        {
            response: { 200: t.Literal("OK") },
            detail: { summary: "Liveness probe" },
        },
        () => "OK",
    )
    /** Dev only: wipes every metadata table. Intentionally publishes nothing. */
    .post(
        "/clear-database",
        {
            detail: { summary: "Clear the database", hide: true },
        },
        async () => {
            await reset(database, {
                cryptocurrency: cryptocurrency,
                exchange: exchange,
                chain: chain,
                market: market,
                chainLink: chainLink,
            });
        },
    );
