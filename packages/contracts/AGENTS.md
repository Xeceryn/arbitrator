# packages/contracts

Shared zod schemas and the RabbitMQ topology. This is the only place routing
keys, queue names, and cross-service message shapes are defined.

## Rule

**Never hardcode a routing key or queue name in a service — import `RoutingKeys`
/ `Queues` from `@arbitrator/contracts`.** Add new events/messages here, not in
the consuming service.

## Contents (all re-exported from `src/index.ts`)

- `messaging.ts` — `ExchangeType`, `RoutingKeys`, `Queues`. Note the split:
  `metadata.changed` is routed through the topic exchange, while orderbook data
  is sent **directly to per-exchange queues** (`Queues.orderbookFor(exchange)`)
  with no binding.
- `events.ts` — `metadataChangedSchema` (coarse `{version, entity, action, …}`).
- `orderbook.ts` — `normalizedOrderbookSchema` (worker output).
- `worker.ts` — `workerCommandSchema` / `workerEventSchema` (parent↔worker
  `postMessage` control protocol), `SymbolSubscription`, `WorkerState`.
- `domain.ts` — domain value objects.
- `last-price.ts` — `lastPriceKey(symbol)` for the Redis last-price cache.
- `sender.ts` — sender API response schemas used by the Elysia app.

Dependencies: `zod` (`catalog:core`). The `@arbitrator/contracts` self-dependency
in `package.json` looks accidental; leave it unless cleaning up deps.
