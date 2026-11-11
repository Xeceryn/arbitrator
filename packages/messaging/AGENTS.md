# packages/messaging

Shared RabbitMQ (amqplib) wrapper used by lister, sender and receiver.

## API (`src/index.ts`)

- `publish(routingKey, payload, {persistent})` — async, **best-effort, never
  throws** (returns `false` on failure). Use from request paths (lister events).
- `publishNow(...)` / `sendToQueueNow(queue, payload, persistent)` — sync
  fire-and-forget for hot paths (orderbook workers); return `false` when the
  channel isn't ready and kick off a reconnect. A dropped snapshot is fine — the
  next one supersedes it.
- `subscribe({ queue, patterns?, prefetch?, durable?, autoDelete?, maxLength? })`
  — returns an async-iterable `Consumer` with **manual ack** (`delivery.ack()`
  after success; a throw leaves it unacked for redelivery). `patterns` binds to
  the topic exchange; omit for direct-to-queue sends.
- `ensurePublisher()`, `ensureQueue(queue, durable?)`, `closeMessaging()`.

## Non-obvious rules

- Env: `AMQP_URL` (falls back to `RABBITMQ_URL`), `AMQP_EXCHANGE` (default
  `arbitrator`). A failed **initial** connect rejects fast (5 tries) so callers
  can degrade to "messaging disabled"; once connected it reconnects forever.
- amqplib recovery reconnects the model but does **not** recreate channels —
  `ConsumerImpl` recreates its own channel and consumer on close. Keep that
  pattern if you add channels.
- `sendToQueueNow` targets a queue that must already be declared; a send to an
  undeclared queue is silently dropped by the broker. A publisher owning its own
  queue therefore has to `await ensureQueue(queue)` before the first send — the
  consumer that declares it at boot may never have seen it.

Deps: `amqplib` (`catalog:core`); `@types/amqplib` (`catalog:types`).
