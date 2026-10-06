# Worker control over postMessage, orderbook data over RabbitMQ

## Context

Orderbook workers are `worker_threads` inside the sender orchestrator. The
orchestrator must tell a worker which coins to (un)subscribe, while orderbook
updates must reach the receiver, which runs clustered across CPUs.

## Decision

The parent↔worker channel (`postMessage`) carries **control only**: subscribe,
unsubscribe, shutdown, and worker state/acks. Orderbook updates never travel
through `postMessage`; workers publish them directly to RabbitMQ
(`orderbook.normalized.<exchange>` routing key on the shared topic exchange),
and the receiver consumes them.

## Why

Routing the orderbook firehose through the parent would serialize every
exchange's updates through one event loop and one process. Publishing from the
worker keeps the data plane parallel and lets the receiver scale horizontally
via a shared queue (competing consumers). `postMessage` stays small and typed,
which suits a control protocol.

## Consequences

- Each worker holds its own RabbitMQ connection.
- The parent is not on the data path, so a slow consumer cannot back-pressure
  the orchestrator.
- Workers can be transparently kill+respawned when an exchange SDK cannot
  dynamically (un)subscribe, without changing the control contract.
