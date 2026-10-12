import z from "zod";

/** One symbol's most recent traded price, e.g. `{ symbol: "usdt", price: 17869 }`. */
export const lastPriceSchema = z.object({
    symbol: z.string(),
    price: z.number(),
});

export type LastPrice = z.infer<typeof lastPriceSchema>;
