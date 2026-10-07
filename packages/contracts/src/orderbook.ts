import z from "zod";

export const orderbookLevelSchema = z.tuple([z.number(), z.number()]);

/**
 * Canonical orderbook shape. Workers normalize exchange-specific payloads into
 * this before publishing. The exchange is carried both in the routing key and
 * in the payload (`exchange`); the receiver uses the payload so it never has to
 * parse routing-key tokens. There is no raw tier — this is the only orderbook
 * payload on the wire.
 */
export const normalizedOrderbookSchema = z.object({
    exchange: z.string(),
    cmcId: z.number(),
    asks: z.array(orderbookLevelSchema),
    bids: z.array(orderbookLevelSchema),
});
export type NormalizedOrderbookEvent = z.infer<
    typeof normalizedOrderbookSchema
>;
