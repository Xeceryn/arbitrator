/**
 * RabbitMQ topology shared by every service. Never write a literal routing key
 * or queue name in a service; import from here.
 *
 * `metadata.changed` goes through the topic exchange and is routed by key. The
 * orderbook is not: each exchange has its own queue and sender workers
 * `sendToQueue` straight into it. The exchange name is runtime config
 * (`AMQP_EXCHANGE`); only its type and the keys below are fixed here.
 */
export const ExchangeType = "topic" as const;

export const RoutingKeys = {
  /**
   * Legacy wildcard for the single shared orderbook queue. The per-exchange
   * orderbook path no longer publishes to the exchange, so this only exists for
   * the unused `concurrent.ts` entrypoint.
   */
  orderbookNormalizedAll: "orderbook.normalized.*",
  /** Coarse metadata-change notification emitted by lister. */
  metadataChanged: "metadata.changed",
} as const;

/**
 * Queues. Every receiver process competes on each exchange's orderbook queue,
 * so each message is handled by exactly one process. All queues are durable and
 * never auto-deleted: the receiver declares one `orderbookFor(exchange)` queue
 * per exchange on startup and the sender declares `metadataChanged`, so
 * publishers can fan in regardless of whether a consumer is currently
 * connected.
 */
export const Queues = {
  /**
   * Per-exchange durable queue, e.g. `arbitrator.orderbook.indodax`. Sender
   * workers send directly to it over the default exchange; the receiver declares
   * it. No binding is involved.
   */
  orderbookFor: (exchange: string) => `arbitrator.orderbook.${exchange}`,
  /**
   * Legacy single queue captured through the `orderbook.normalized.*` binding.
   * The default `index.ts` entrypoint no longer uses it; only the unused
   * `concurrent.ts` entrypoint still binds it.
   */
  orderbook: "arbitrator.orderbook.normalized",
  metadataChanged: "arbitrator.metadata.changed",
} as const;
