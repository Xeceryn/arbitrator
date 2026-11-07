/**
 * Contract between `signal-board.ts` (which owns hide/sort) and
 * `signal-audio.ts` (which needs to know what the first card is).
 *
 * The board applies its state after every WebSocket swap, so an event is more
 * reliable than re-deriving the order somewhere else: it is dispatched after
 * `order`/`display` are already on the nodes, no matter which module the
 * browser ran first.
 */

/** Fired on `document` once the board's hide/sort state is on the DOM. */
export const BOARD_APPLIED_EVENT = "signal-board:applied";

/** The visually first card, i.e. the highest-ranked one after filtering. */
export type BoardTop = {
    /** The card's DOM id (`signal-card-<cmc>-<buy>-<sell>`). */
    id: string;
    /** The API's profit ratio: `(sell - buy) / buy`, so 0.0125 is 1.25%. */
    profitPercentage: number;
};

export type BoardAppliedDetail = {
    top: BoardTop | null;
};
