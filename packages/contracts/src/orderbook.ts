import { type Static, Type as t } from "typebox";

export const orderbookLevelSchema = t.Tuple([t.Number(), t.Number()]);

/**
 * Canonical orderbook shape. Workers normalize exchange-specific payloads into
 * this before publishing. The exchange is carried both in the routing key and
 * in the payload (`exchange`); the receiver uses the payload so it never has to
 * parse routing-key tokens. There is no raw tier — this is the only orderbook
 * payload on the wire.
 */
export const normalizedOrderbookSchema = t.Object({
    exchange: t.String(),
    cmcId: t.Number(),
    asks: t.Array(orderbookLevelSchema),
    bids: t.Array(orderbookLevelSchema),
});
export type NormalizedOrderbookEvent = Static<typeof normalizedOrderbookSchema>;
