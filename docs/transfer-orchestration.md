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

**Current stage:** Phase 0–1 started.

- [x] `packages/contracts` filled (subjects, metadata event, raw/normalized
      orderbook, worker control protocol, domain value objects).
- [x] lister `market.listTransferableCoins` (directed, `tradeEnabled` both sides).
- [x] lister `events/` NATS publisher, wired into `market` and `chain_link`
      mutations.
- [ ] lister events wired into `exchange`, `cryptocurrency`, `chain` mutations.
- [ ] Everything from Phase 2 down (see §10).

**Only open question:** receiver delivery guarantee — core NATS queue group vs
JetStream ack/redelivery. See §7. This does not block Phases 2–3.

**Next action:** implement the pure reconciler (Phase 2 / task T4), or wire the
remaining lister mutations (T3) — T4 is the risky one and should come first.

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

- Subscribes `orderbook.*.update` (queue `ORDERBOOK_UPDATE`), parses, does
  nothing else. Clustered over `hardwareConcurrency` via `src/main.ts`.

**NATS** — `nats:2.12-alpine`; JetStream commented out and stays out. Core NATS
only.

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

- `apps/lister/src/events/nats.ts` — lazy NATS connection; degrades to a logged
  no-op when NATS is unreachable, so the UI keeps working.
- `apps/lister/src/events/metadata.ts` — `publishMetadataChanged`, validates
  payload against the contracts schema, never throws.
- Emitted after successful mutations; coarse payload. Core NATS, no replay. A
  lost event is a latency bug, not correctness (sender full-reconciles).
- Wired: `market.assign/update/unassign`, `chain_link.add/update/remove`.
  Pending: `exchange.*`, `cryptocurrency.*`, `chain.*`.

---

## 3. `packages/contracts`

`src/subjects.ts`, `src/events.ts`, `src/orderbook.ts`, `src/worker.ts`,
`src/domain.ts`, re-exported from `src/index.ts`.

- `Subjects.orderbookRaw(exchange)` → `orderbook.<exchange>.raw`
- `Subjects.orderbookNormalized(exchange)` → `orderbook.normalized.<exchange>`
- `Subjects.metadataChanged` → `metadata.changed`
- `metadataChangedSchema` — `{ version: 1, entity, action, exchangeIds?,
cryptocurrencyIds?, chainIds?, marketIds?, occurredAt }`
- `rawOrderbookSchema` — `{ exchange, cmcId, asks, bids, ts }`
- `normalizedOrderbookSchema` — `{ cmcId, asks, bids }` (exchange lives in the
  subject)
- `workerCommandSchema` / `workerEventSchema` — parent↔worker `postMessage`
  control protocol
- `symbolSubscriptionSchema`, `workerStateSchema`, `baseCurrencySchema`

The receiver imports only subjects + orderbook schemas, never sender internals.

---

## 4. sender → Elysia orchestrator

### 4.1 Framework

Replace `@orpc/server` with `elysia` + `@elysiajs/eden`; export the app type for
an Eden client. Keep lister on oRPC. `derive` injects `{ orchestrator, logger,
nats }`; the orchestrator is a plain singleton module.

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
    pack toAdd into workers with room, else spawn new chunked workers
    terminate only workers whose symbol set becomes empty
  terminate exchanges with no desired subs
  if startedExchangeIds.size < 2: terminate everything
  if startedExchangeIds is empty: no-op (metadata edits with no workers ignored)
```

Properties: idempotent; delta-only; burst-safe (debounce ~300 ms, single-flight);
drift-safe (periodic full resync); stable bin-packing. Keep
`reconcile(desired, currentWorkers, configs) → commands` **pure**; lister and
worker I/O at the edges.

Capacity overflow: place what fits, surface the rest as unplaced in
`GET /workers`, retry next reconcile.

### 4.3 Exchange/worker registry

```ts
type WorkerAdapterConfig = {
  slug: string; // canonical lister slug, e.g. "gate"
  modulePath: string; // "src/workers/orderbooks/gate-io.ts"
  baseCurrency: "usdt" | "idr"; // from lister, fallback here
  maxSubscriptionsPerConnection: number;
  maxConnectionsPerExchange: number;
  supportsDynamicSubscribe: boolean;
};
```

Scope now: **binance + gate-io only**; rest is debt. Resolves `"gate"` vs
`"gate-io"`.

### 4.4 Worker pool & control protocol

- `node:worker_threads`; args via `workerData` (migrate off `Bun.argv`).
- Control = `postMessage` (`workerCommandSchema` / `workerEventSchema`).
- Data = NATS only (`orderbook.<exchange>.raw`); `postMessage` carries state,
  acks, errors.
- Non-dynamic adapters fall back to terminate+respawn; hidden behind one interface.
- Lifecycle: in-process threads, killed with the sender. A worker that dies on
  its own is respawned and re-subscribed.

---

## 5. receiver → orderbook normalizer

```
sender workers ──raw──> receiver ──normalized──> downstream consumers
orderbook.<exchange>.raw        orderbook.normalized.<exchange>
```

- Cluster mode: one process per CPU, all in queue group `ORDERBOOK_UPDATE`, so
  each message is handled by exactly one process.
- Per message: validate → normalize `{ cmcId, asks, bids }` → price
  conversion/lookup → persist to DB.
- Publish normalized with exchange in the subject.
- Conversion/lookup/DB is a follow-up; this session settles the contract and the
  normalizer boundary. `ts` is intentionally not in the normalized payload.

---

## 6. Phased implementation

- **Phase 0 — contracts + transport:** contracts filled; lister events module.
- **Phase 1 — lister read-model:** `listTransferableCoins`.
- **Phase 2 — pure reconciler.**
- **Phase 3 — sender Elysia + worker pool.**
- **Phase 4 — events + receiver.**
- **Phase 5 — UI.**

---

## 7. Open question

**Receiver delivery guarantee.** Core NATS queue groups are load-balanced but
have no ack/redelivery: a crash between receive and DB write loses the message.
The "acked once" requirement implies JetStream consumers (ack + redelivery) for
the receiver, while `metadata.changed` stays core NATS. Confirm and, if yes,
enable JetStream and add `@nats-io/jetstream`.

---

## 8. Resolved decisions

- **Transferability:** directed; one direction suffices; both legs subscribed;
  `tradeEnabled` required on both markets.
- **Worker runtime:** `worker_threads`; `workerData` for args; `postMessage` for
  control; NATS for orderbook data only; infinite reconnect in worker.
- **Worker lifecycle:** in-process threads, killed with the sender. A worker that
  dies on its own is respawned and re-subscribed.
- **Metadata changes:** only acted on while workers are running; edits with no
  workers running reconcile on next start.
- **Adapter scope:** binance + gate-io only; rest is debt.
- **Receiver:** raw → normalize → publish; cluster uses the NATS queue group.
- **Subjects:** raw `orderbook.<exchange>.raw`, normalized
  `orderbook.normalized.<exchange>`; normalized payload `{ cmcId, asks, bids }`.
- **Durability:** core NATS, no JetStream/replay for `metadata.changed`; no
  churn of healthy subscriptions.
- **Lister events:** handler-level publish (no outbox) for now.
- **Worker registry:** per-exchange config incl. `maxConnectionsPerExchange`;
  exchanges with no adapter return "worker not implemented".
- **Base assets:** all allowed; price conversion is receiver-side, out of scope.

---

## 9. Prototype note

The reconciler is the risky logic (start A/B/C, stop, metadata change mid-flight,
capacity overflow). Before/while implementing Phase 2, a **throwaway logic
prototype** (single HTML: start/stop buttons + transferability toggles, rendering
desired vs current subscriptions and worker topology) can validate the state
model cheaply. Per the prototype discipline: commit it to a throwaway branch,
leave the verdict + branch pointer here, keep only the validated decision on main.

---

## 10. Tasks (implementation tracker)

Each task ends on a checkable bound.

### Phase 0 — contracts + transport

- [x] **T1** `packages/contracts` exports Subjects + zod schemas; typecheck passes;
      no service imports another service's internal paths across the boundary.
- [x] **T2** lister `events/` publisher exists; `publishMetadataChanged` validates
      before send and never throws.
- [ ] **T3** events wired into every mutation that can change transferability:
      `market.*`, `chain_link.*` (done), `exchange.*`, `cryptocurrency.*`,
      `chain.*` (pending). Done when grepping the routers shows a publish call on
      every create/update/delete handler.

### Phase 1 — lister read-model

- [x] **T4** `market.listTransferableCoins` + route + schema. Done when a fixture
      where A→B is directed-only yields both A and B subscriptions, and a pair
      with either side `tradeEnabled=false` yields none.

### Phase 2 — pure reconciler

- [ ] **T5** `reconcile(desired, currentWorkers, configs)` pure module.
      Done when: empty desired → no commands; identical desired twice → second
      call emits nothing; capacity overflow produces additional workers and no
      dropped symbols.
- [ ] **T6** tests or CLI harness covering start A, start B, start C, stop A,
      metadata change.

### Phase 3 — sender Elysia + worker pool

- [ ] **T7** Elysia app + `derive` + start/stop/inspect routes + Eden type export.
- [ ] **T8** registry; `start` returns 501 for unimplemented exchanges.
- [ ] **T9** worker pool + `workerData` + postMessage control protocol.
- [ ] **T10** adapt binance + gate-io: `workerData`, dynamic subscribe/unsubscribe,
      publish raw to NATS.

### Phase 4 — events + receiver

- [ ] **T11** sender subscribes `metadata.changed` → debounced reconcile.
- [ ] **T12** receiver: raw → normalize → publish; imports contracts only.

### Phase 5 — UI

- [ ] **T13** Eden client in `@arbitrator/sdk` + start/stop controls in `apps/ui`.

### Follow-ups (out of current scope)

- [ ] Receiver price conversion/lookup + DB persistence.
- [ ] `listTransferableCoins` filters for the future signal row.
- [ ] Migrate remaining exchange workers off `Bun.argv`.
