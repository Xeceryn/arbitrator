import { t } from "elysia";
import type { Static } from "typebox";

/** One symbol's most recent traded price, e.g. `{ symbol: "usdt", price: 17869 }`. */
export const lastPriceSchema = t.Object({
    symbol: t.String(),
    price: t.Number(),
});

export type LastPrice = Static<typeof lastPriceSchema>;
