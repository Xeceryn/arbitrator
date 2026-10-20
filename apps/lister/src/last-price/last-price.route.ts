import { lastPriceKey } from "@arbitrator/contracts";
import { redis } from "bun";
import { Elysia, t } from "elysia";

import { messageSchema } from "../common/http.schema";
import { lastPriceSchema } from "./last-price.schema";

export const lastPriceRoutes = new Elysia({
    name: "last-price",
    prefix: "/last-price",
    tags: ["last-price"],
})
    /**
     * Last price for one symbol, e.g. `usdt`. Standalone: symbol in, price out.
     */
    .get(
        "/:symbol",
        {
            params: t.Object({ symbol: t.String({ minLength: 1 }) }),
            response: { 200: lastPriceSchema, 404: messageSchema },
            detail: { summary: "Last price for a symbol" },
        },
        async ({ params, set }) => {
            const symbol = params.symbol.toLowerCase();
            const value = await redis.get(lastPriceKey(symbol));
            const price = value === null ? Number.NaN : Number(value);
            if (!Number.isFinite(price)) {
                set.status = 404;
                return { message: `no last price for symbol: ${symbol}` };
            }

            return { symbol, price };
        },
    );
