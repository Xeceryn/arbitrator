/**
 * NATS subjects. Never write a literal subject in a service; import from here.
 */
export const Subjects = {
  /** Raw orderbook emitted by a sender worker. */
  orderbookRaw: (exchange: string) => `orderbook.${exchange}.raw`,
  /** Normalized orderbook emitted by the receiver for downstream consumers. */
  orderbookNormalized: (exchange: string) => `orderbook.normalized.${exchange}`,
  /** Coarse metadata-change notification emitted by lister. */
  metadataChanged: "metadata.changed",
} as const;

/** Queue group shared by every receiver process so work is load-balanced. */
export const OrderbookQueue = "ORDERBOOK_UPDATE" as const;
