import z from "zod";

export const orderbookLevelSchema = z.tuple([z.number(), z.number()]);

/**
 * Canonical orderbook shape. Workers normalize exchange-specific payloads into
 * this before publishing; the exchange is carried in the subject. There is no
 * raw tier — this is the only orderbook payload on the wire.
 */
export const normalizedOrderbookSchema = z.object({
  cmcId: z.number(),
  asks: z.array(orderbookLevelSchema),
  bids: z.array(orderbookLevelSchema),
});
export type NormalizedOrderbookEvent = z.infer<
  typeof normalizedOrderbookSchema
>;
