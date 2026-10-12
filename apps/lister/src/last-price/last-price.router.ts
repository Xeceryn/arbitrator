import { lastPriceKey } from "@arbitrator/contracts";
import { ORPCError, os } from "@orpc/server";
import { redis } from "bun";
import z from "zod";

import { lastPriceSchema } from "./last-price.schema";

export const lastPriceRouter = {
    /**
     * Last price for one symbol, e.g. `usdt`. Standalone: symbol in, price out.
     */
    get: os
        .input(z.string().min(1))
        .output(lastPriceSchema)
        .handler(async ({ input }) => {
            const symbol = input.toLowerCase();
            const value = await redis.get(lastPriceKey(symbol));
            const price = value === null ? Number.NaN : Number(value);
            if (!Number.isFinite(price)) {
                throw new ORPCError("NOT_FOUND", {
                    message: `no last price for symbol: ${symbol}`,
                });
            }
            return { symbol, price };
        }),
};
