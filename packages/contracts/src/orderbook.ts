import z from "zod";

export const orderbookLevelSchema = z.tuple([z.number(), z.number()]);

/** Raw orderbook as published by a worker (sender -> receiver). */
export const rawOrderbookSchema = z.object({
  exchange: z.string(),
  cmcId: z.number(),
  asks: z.array(orderbookLevelSchema),
  bids: z.array(orderbookLevelSchema),
  ts: z.number(),
});
export type RawOrderbookEvent = z.infer<typeof rawOrderbookSchema>;

/**
 * Normalized orderbook published by the receiver (receiver -> downstream).
 * The exchange is carried in the subject, not the payload.
 */
export const normalizedOrderbookSchema = z.object({
  cmcId: z.number(),
  asks: z.array(orderbookLevelSchema),
  bids: z.array(orderbookLevelSchema),
});
export type NormalizedOrderbookEvent = z.infer<
  typeof normalizedOrderbookSchema
>;
