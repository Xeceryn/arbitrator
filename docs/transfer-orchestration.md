# Transferable-Coin Subscription Orchestration

Feature context, decisions, and implementation tracker.

Services: `apps/lister` (source of truth + events), `apps/sender` (worker
orchestrator, moving to Elysia), `apps/receiver` (orderbook normalizer),
`packages/contracts` (shared event/domain contract).

Related: [ADR 0001](./adr/0001-desired-state-reconciliation.md),
[ADR 0002](./adr/0002-worker-control-vs-data-plane.md),
[CONTEXT.md](../CONTEXT.md).

---

## Status & handoff (read this first)

**Current stage:** All phases (0–5) implemented.

- [x] `packages/contracts` filled (routing keys, metadata event,
      normalized orderbook, worker control protocol, domain value objects).
- [x] lister `market.listTransferableCoins` (directed, `tradeEnabled` both sides).
- [x] lister `events/` RabbitMQ publisher, wired into every mutation router
      (`market`, `chain_link`, `exchange`, `cryptocurrency`, `chain`).
      `utility.clearDatabase` is dev-only and intentionally left out.
- [x] pure `reconcile` module + 6 tests (`apps/sender/src/orchestrator/`).
- [x] Phase 3: Elysia app, worker registry (binance + gate), worker pool
      (`worker_threads` + `workerData` + postMessage), 6 pool tests.
- [x] sender subscribes `metadata.changed` → debounced reconcile (T11).
- [x] receiver consumer: subscribes `orderbook.normalized.*` from the shared
      queue (T12).
- [x] opportunity persistence: sender reconciles legs via `opportunity.sync`;
      receiver updates prices/volumes directly in the DB.
- [x] UI: Workers page (`/workers`) with per-exchange start/stop, Eden client in
      `apps/ui/src/sender.client.ts`, status + worker/coin counts.

**Run / verify:**

- sender: `bun run dev` in `apps/sender` → port 3002. Routes:
  `POST /exchanges/:slug/start|stop`, `GET /exchanges`, `GET /workers`.
  `start` returns 501 for an exchange with no adapter.
- receiver: `bun run dev` in `apps/receiver`; consumes
  `orderbook.normalized.<exchange>` (no republish).
- ui: `bun run dev` in `apps/ui` → port 3000; open `/workers` for start/stop.
- new sender code typecheck: `bunx tsc -p apps/sender/tsconfig.app.json --noEmit`
  (legacy debt workers are excluded).
- tests: `bun test apps/sender/src/orchestrator`.

**Delivery guarantee:** resolved by moving to RabbitMQ — manual acks bound the
receiver's in-flight work and a crash redelivers unacked messages. See §7.

**Next action:** none — feature implemented.

**How to resume with a fresh context:** read this doc top to bottom once, then
work the checklist in §10 in order. The design rationale lives in §1–§5; the
tracker is §10. Nothing else is required.

---

## 0. Verified baseline (as of this session)

**lister** (`oRPC`, port 3001, Postgres via drizzle)

- Tables: `exchange` (slug, cmcId, baseCurrency), `cryptocurrency` (cmcId unique,
  slug, symbol), `chain` (code), `market` (exchangeId, cryptocurrencyId,
  `tradeEnabled`, `exchangeSymbol`), `chain_link` (marketId, chainId,
  `withdrawEnabled`, `depositEnabled`).
- `Cryptocurrency.listRoutes(id)` computes **directed** routes for the UI matrix.
- Mutations are oRPC handlers; `events/` now publishes `metadata.changed`.

**sender** (`oRPC`, port 3002)

- `src/router.ts` is a stub with an unused `workerConfig[]` (indodax 30,
  binance 100, gate 100, mexc 20 subs/connection).
- `src/workers/orderbooks/*.ts`: declared as `worker_threads`
  (`self.postMessage`) but read `Bun.argv`; all data flows via `postMessage`.
  Binance has a commented `nc.publish("orderbook.binance.update", ...)`.
- Two divergent message shapes: `WorkerMessage` (`worker.ts`) and
  `OrderbookWorkerMessage` (`orderbook.ts`).
- `Exchange` const uses `"gate"`; worker file/threadId uses `"gate-io"`.

**receiver**

- Subscribes `orderbook.normalized.*` (shared queue `Queues.orderbook`), parses,
  does nothing else. Clustered over `hardwareConcurrency` via `src/main.ts`.

**RabbitMQ** — `rabbitmq:4-management-alpine`; one topic exchange
(`AMQP_EXCHANGE`, default `arbitrator`) carries both event families. Persistent
messages and a durable queue for `metadata.changed`; the orderbook queue is
auto-delete and non-durable.

---

## 1. What this feature does

> Given a set of _started_ exchanges, compute the coin subscriptions each
> exchange's orderbook worker needs so every transferable pair is observable on
> both legs, and keep those subscriptions correct as exchanges start/stop and
> metadata changes — within each exchange's per-connection subscription limit.

**Definition (transferable pair A,B, coin X) — directed, one direction enough.**
There exists a chain `ch` such that `market(A,X).tradeEnabled` and
`market(B,X).tradeEnabled`, and on `ch`: either
`chain_link(A,X,ch).withdrawEnabled ∧ chain_link(B,X,ch).depositEnabled`, or
`chain_link(B,X,ch).withdrawEnabled ∧ chain_link(A,X,ch).depositEnabled`.
Both legs are subscribed because asks **and** bids are needed on both sides.

> Forward-looking: this query will later grow extra filters to seed a **signal**
> row. Separate feature; keep the read-model composable, don't bake signal logic
> in now.

---

## 2. lister

### 2.1 `market.listTransferableCoins`

```ts
listTransferableCoins({ exchangeIds: number[] }): Promise<{
  exchanges: [{ id, slug, baseCurrency }],
  subscriptions: [{ exchangeId, cmcId, symbol }],         // union, deduped
  routes: [{ aExchangeId, bExchangeId, cmcId, chainId }]  // provenance/debug
}>
```

- Directed, `tradeEnabled` on both markets, deduped unordered pairs.
- `symbol` = `market.exchangeSymbol` (per-exchange naming).
- Distinct from `cryptocurrency.routes` (UI matrix).
- Implemented by loading the requested markets with their `chainLinks` and
  computing pairs in JS (same shape as the existing `listRoutes`); a single SQL
  query is a later optimization if volume demands it.

### 2.2 Metadata change events

- `apps/lister/src/events/publisher.ts` — re-exports the shared RabbitMQ
  publisher; degrades to a logged no-op when the broker is unreachable, so the
  UI keeps working.
- `apps/lister/src/events/metadata.ts` — `publishMetadataChanged`, validates
  payload against the contracts schema, never throws.
- Emitted after successful mutations; coarse payload, persistent message. A
  lost event is a latency bug, not correctness (sender full-reconciles).
- Wired: `market.assign/update/unassign`, `chain_link.add/update/remove`.
  Pending: `exchange.*`, `cryptocurrency.*`, `chain.*`.

---

## 3. `packages/contracts`

`src/messaging.ts`, `src/events.ts`, `src/orderbook.ts`, `src/worker.ts`,
`src/domain.ts`, re-exported from `src/index.ts`.

- `RoutingKeys.orderbookNormalized(exchange)` → `orderbook.normalized.<exchange>`
- `RoutingKeys.metadataChanged` → `metadata.changed`
- `Queues.orderbook` / `Queues.metadataChanged` — broker queue names
- `metadataChangedSchema` — `{ version: 1, entity, action, exchangeIds?,
cryptocurrencyIds?, chainIds?, marketIds?, occurredAt }`
- `normalizedOrderbookSchema` — `{ exchange, cmcId, asks, bids }` (exchange in
  both routing key and payload; workers normalize, there is no raw tier)
- `workerCommandSchema` / `workerEventSchema` — parent↔worker `postMessage`
  control protocol
- `symbolSubscriptionSchema`, `workerStateSchema`, `baseCurrencySchema`

The receiver imports only contracts, lister's data layer, and the SDK — never
sender internals.

---

## 4. sender → Elysia orchestrator

### 4.1 Framework

Elysia + `@elysiajs/eden`; export the app type for an Eden client. Keep lister
on oRPC. Shared dependencies are Elysia **plugins**, not module imports:
`orchestratorPlugin` decorates the orchestrator, `eventsPlugin` consumes
`metadata.changed` in `onStart` and closes its consumer in `onStop`. The UI
provides `lister`/`sender` through a
`clientsPlugin` read from handler context.

Routes: `POST /exchanges/:slug/start`, `POST /exchanges/:slug/stop`,
`GET /exchanges`, `GET /workers`.

Guard: `start` looks the slug up in the worker registry. An exchange present in
lister but absent from the registry → `501 exchange worker not implemented`.

### 4.2 Reconciliation (the core)

Level-triggered, idempotent, delta-only. Every trigger recomputes desired and
sends only the difference — never tears down healthy subscriptions:

```
reconcile(startedExchangeIds):
  desired = lister.listTransferableCoins({ exchangeIds: startedExchangeIds })
  for each started exchange:
    current  = union(workers[exchange].symbols)
    toAdd    = desired - current
    toRemove = current - desired
    send unsubscribe(toRemove ∩ worker.symbols)         // postMessage
    pack toAdd into workers with room; spawn as many new workers as needed
    (each capped at maxSubscriptionsPerConnection) to cover every coin
    terminate only workers whose symbol set becomes empty
  terminate exchanges with no desired subs
  if startedExchangeIds.size < 2: terminate everything
  if startedExchangeIds is empty: no-op (metadata edits with no workers ignored)
```

Properties: idempotent; delta-only; burst-safe (debounce ~300 ms, single-flight);
drift-safe (periodic full resync); stable bin-packing. Keep
`reconcile(desired, currentWorkers, configs) → commands` **pure**; lister and
worker I/O at the edges.

`maxSubscriptionsPerConnection` is the only limit: it decides how many workers
are opened, never how many coins are streamed. Every desired coin is covered.

### 4.3 Exchange/worker registry

```ts
type WorkerAdapterConfig = {
  slug: string; // canonical lister slug, e.g. "gate"
  modulePath: string; // "src/workers/orderbooks/gate-io.ts"
  baseCurrency: "usdt" | "idr"; // from lister, fallback here
  maxSubscriptionsPerConnection: number;
  supportsDynamicSubscribe: boolean;
};
```

Scope now: **binance + gate-io only**; rest is debt. Resolves `"gate"` vs
`"gate-io"`.

### 4.4 Worker pool & control protocol

- `node:worker_threads`; args via `workerData` (migrate off `Bun.argv`).
- Control = `postMessage` (`workerCommandSchema` / `workerEventSchema`).
- Data = RabbitMQ only (`orderbook.normalized.<exchange>`); `postMessage`
  carries state, acks, errors.
- Non-dynamic adapters fall back to terminate+respawn; hidden behind one interface.
- Lifecycle: in-process threads, killed with the sender. A worker that dies on
  its own is respawned and re-subscribed.

---

## 5. receiver → orderbook consumer

```
sender workers ──normalized──> receiver ──> price conversion/lookup + DB
orderbook.normalized.<exchange>
```

- Workers already normalize; there is no raw tier and the receiver does **not**
  republish.
- Cluster mode: one process per CPU, all competing on the shared
  `Queues.orderbook` queue, so each message is handled by exactly one process.
- Manual acks with `prefetch`: a message is acked once its snapshot is stashed
  (or its DB update lands in the non-concurrent path), so a crash redelivers
  rather than loses it.
- Per message: price conversion → volume search → update the matching
  `opportunity` legs directly in the database.
- Opportunity rows are created and deleted by the sender through
  `opportunity.sync` (level-triggered against the started set + metadata); the
  receiver only updates prices/volumes, so a removed leg is a zero-row update.

---

## 6. Phased implementation

- **Phase 0 — contracts + transport:** contracts filled; lister events module.
- **Phase 1 — lister read-model:** `listTransferableCoins`.
- **Phase 2 — pure reconciler.**
- **Phase 3 — sender Elysia + worker pool.**
- **Phase 4 — events + receiver.**
- **Phase 5 — UI.**

---

## 7. Delivery guarantee

**Resolved by RabbitMQ.** The receiver consumes from a shared queue with manual
acks and a bounded `prefetch`; a crash between receive and DB write leaves the
message unacked and the broker redelivers it. This replaces the core-NATS
question (load-balanced but no redelivery) that motivated a possible JetStream
consumer. `metadata.changed` is published as a persistent message to a durable
queue, so a sender restart does not miss it.

---

## 8. Resolved decisions

- **Transferability:** directed; one direction suffices; both legs subscribed;
  `tradeEnabled` required on both markets.
- **Worker runtime:** `worker_threads`; `workerData` for args; `postMessage` for
  control; RabbitMQ for orderbook data only; infinite reconnect in worker.
- **Worker lifecycle:** in-process threads, killed with the sender. A worker that
  dies on its own is respawned and re-subscribed.
- **Metadata changes:** only acted on while workers are running; edits with no
  workers running reconcile on next start.
- **Adapter scope:** binance + gate-io only; rest is debt.
- **Receiver:** consumes the normalized stream and processes it; no republish;
  cluster competes on the shared RabbitMQ queue.
- **Routing keys:** single `orderbook.normalized.<exchange>`; payload
  `{ cmcId, asks, bids }`; workers normalize, there is no raw tier.
- **Capacity:** `maxSubscriptionsPerConnection` is the only limit; the
  reconciler opens as many connections as needed and never drops a subscription.
- **Durability:** `metadata.changed` is persistent on a durable queue;
  orderbook messages are transient on an auto-delete queue; no churn of healthy
  subscriptions.
- **Lister events:** handler-level publish (no outbox) for now.
- **Worker registry:** per-exchange config (`maxSubscriptionsPerConnection`);
  exchanges with no adapter return "worker not implemented".
- **Base assets:** all allowed; price conversion is receiver-side, out of scope.

---

## 9. Prototype note

The reconciler is the risky logic (start A/B/C, stop, metadata change mid-flight,
connection splitting). Before/while implementing Phase 2, a **throwaway logic
prototype** (single HTML: start/stop buttons + transferability toggles, rendering
desired vs current subscriptions and worker topology) can validate the state
model cheaply. Per the prototype discipline: commit it to a throwaway branch,
leave the verdict + branch pointer here, keep only the validated decision on main.

---

## 10. Tasks (implementation tracker)

Each task ends on a checkable bound.

### Phase 0 — contracts + transport

- [x] **T1** `packages/contracts` exports routing keys + zod schemas; typecheck
      passes; no service imports another service's internal paths across the
      boundary.
- [x] **T2** lister `events/` publisher exists; `publishMetadataChanged` validates
      before send and never throws.
- [x] **T3** events wired into every mutation that can change transferability:
      `market.*`, `chain_link.*`, `exchange.*`, `cryptocurrency.*`, `chain.*`.
      `utility.clearDatabase` is dev-only, intentionally excluded.

### Phase 1 — lister read-model

- [x] **T4** `market.listTransferableCoins` + route + schema. Done when a fixture
      where A→B is directed-only yields both A and B subscriptions, and a pair
      with either side `tradeEnabled=false` yields none.

### Phase 2 — pure reconciler

- [x] **T5** `reconcile(desired, currentWorkers, configs)` pure module at
      `apps/sender/src/orchestrator/reconcile.ts`. Verified: empty desired → no
      commands; same desired twice → nothing on the second call; overflowing a
      connection opens more workers and drops no symbol.
- [x] **T6** tests at `apps/sender/src/orchestrator/reconcile.test.ts` (6 cases:
      teardown, spawn, idempotent, multi-connection split, metadata drop, stop).

### Phase 3 — sender Elysia + worker pool

- [x] **T7** Elysia app (`.decorate` over the singleton orchestrator) +
      start/stop/inspect routes + `App` type export (`src/app.ts`).
- [x] **T8** registry; `start` returns 501 for unimplemented exchanges.
- [x] **T9** worker pool + `workerData` + postMessage control + failure-driven
      reconcile; 6 pool tests.
- [x] **T10** adapted binance + gate-io: `workerData`, dynamic
      subscribe/unsubscribe, publish normalized orderbook to RabbitMQ.

### Phase 4 — events + receiver

- [x] **T11** sender subscribes `metadata.changed` → debounced reconcile.
- [x] **T12** receiver: consume `orderbook.normalized.*`; manual ack after the
      snapshot is handled; update opportunity prices/volumes directly (sender
      owns create/delete).

### Phase 5 — UI

- [x] **T13** Eden client (`apps/ui/src/sender.client.ts`, UI-local to avoid an
      sdk↔sender cycle) + start/stop controls on `/workers`.

### Follow-ups (out of current scope)

- [x] Receiver price conversion + opportunity persistence (receiver writes the
      DB directly; sender owns create/delete via `opportunity.sync`).
- [ ] `listTransferableCoins` filters for the future signal row.
- [ ] Migrate the remaining exchange workers (bitget, bitmart, huobi, indodax,
      kucoin, mexc, pintu) to the contracts protocol. They are the only
      consumers of the legacy shims left in `src/types/` and `src/utils/`;
      delete those shims once migrated.
