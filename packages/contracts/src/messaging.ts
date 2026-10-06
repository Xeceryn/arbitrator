/**
 * RabbitMQ topology shared by every service. Never write a literal routing key
 * or queue name in a service; import from here.
 *
 * Messages are published to a single topic exchange and routed by key. The
 * exchange name is runtime config (`AMQP_EXCHANGE`); only its type and the keys
 * below are fixed here.
 */
export const ExchangeType = "topic" as const;

export const RoutingKeys = {
  /**
   * Normalized orderbook published by sender workers and consumed by the
   * receiver. The exchange is the last token.
   */
  orderbookNormalized: (exchange: string) => `orderbook.normalized.${exchange}`,
  /** Binding pattern that captures every exchange's normalized orderbook. */
  orderbookNormalizedAll: "orderbook.normalized.*",
  /** Coarse metadata-change notification emitted by lister. */
  metadataChanged: "metadata.changed",
} as const;

/**
 * Queues. Every receiver process competes on `orderbook`, so each message is
 * handled by exactly one process (the AMQP equivalent of a NATS queue group).
 * The sender owns `metadataChanged`.
 */
export const Queues = {
  orderbook: "arbitrator.orderbook.normalized",
  metadataChanged: "arbitrator.metadata.changed",
} as const;
