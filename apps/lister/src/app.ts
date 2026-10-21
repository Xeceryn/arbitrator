import { cors } from "@elysia/cors";
import { openapi } from "@elysia/openapi";
import { Elysia } from "elysia";

import { chainLinkRoutes } from "./core/chain-link/chain-link.route";
import { chainRoutes } from "./core/chain/chain.route";
import { cryptocurrencyRoutes } from "./core/cryptocurrency/cryptocurrency.route";
import { exchangeRoutes } from "./core/exchange/exchange.route";
import { marketRoutes } from "./core/market/market.route";
import { opportunityRoutes } from "./core/opportunity/opportunity.route";
import { utilityRoutes } from "./core/utility/utility.route";
import { lastPriceRoutes } from "./last-price/last-price.route";
import { databasePlugin } from "./plugins/database";
import { eventsPlugin } from "./plugins/events";

/**
 * The lister HTTP surface. `App` is the Eden treaty type consumed by
 * `@arbitrator/sdk`; every route plugin is a self-contained Elysia instance.
 *
 * Schemas are Elysia-native TypeBox (drizzle-typebox through
 * `@arbitrator/elysia-kit`'s `toElysiaSchema`), so OpenAPI reads them directly
 * and no `mapJsonSchema` mapper is needed.
 */
export const app = new Elysia()
    .use(cors({ origin: "*" }))
    .use(
        openapi({
            documentation: {
                info: { title: "Arbitrator Lister", version: "0.0.0" },
            },
        }),
    )
    .use(databasePlugin)
    .use(eventsPlugin)
    .use(exchangeRoutes)
    .use(cryptocurrencyRoutes)
    .use(marketRoutes)
    .use(chainLinkRoutes)
    .use(chainRoutes)
    .use(opportunityRoutes)
    .use(lastPriceRoutes)
    .use(utilityRoutes);

export type App = typeof app;
