/**
 * NATS subjects. Never write a literal subject in a service; import from here.
 */
export const Subjects = {
  /**
   * Normalized orderbook published by sender workers and consumed by the
   * receiver. The exchange is the last token.
   */
  orderbookNormalized: (exchange: string) => `orderbook.normalized.${exchange}`,
  /** Coarse metadata-change notification emitted by lister. */
  metadataChanged: "metadata.changed",
} as const;

/** Queue group shared by every receiver process so work is load-balanced. */
export const OrderbookQueue = "ORDERBOOK_UPDATE" as const;
