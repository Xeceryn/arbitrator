# apps/sender

Exchange worker orchestrator. Elysia v2 + Eden on `:3002` (OpenAPI at
`/openapi`); owns a `node:worker_threads` pool and the desired-state reconciler.

## Run

```bash
bun run dev            # bun run --watch src/index.ts
bun run build
# Focused typecheck that EXCLUDES legacy workers:
bunx tsc -p apps/sender/tsconfig.app.json --noEmit
bun test apps/sender/src/orchestrator   # reconcile.test.ts + pool.test.ts
```

There is no `typecheck` script; use the focused `tsc` above (run from repo root).

## Structure

```
src/app.ts        createApp() builds the Elysia app; exports `app` + `App` type
src/index.ts      exports the app, app.listen(3002) unless inAotBuild()
src/orchestrator/ service.ts (state + debounce), reconcile.ts (PURE, tested),
                  registry.ts (worker adapters), pool.ts (threads, tested),
                  bootstrap.ts (wiring), lister.ts (ListerGateway over the
                  injected treaty client; the client itself lives in plugins/lister.ts)
src/plugins/      lister.ts (decorate `lister` = @arbitrator/sdk treaty),
                  orchestrator.ts (decorate + first reconcile onStart),
                  events.ts (consume metadata.changed -> notifyMetadataChanged,
                  onStop closes the consumer)
src/workers/      protocol.ts (worker control), orderbooks/*.ts (one per exchange)
src/types, src/utils, src/vendor   legacy shims (delete once all workers migrate)
```

Route `params`/`body`/`response` schemas are TypeBox (`typebox@1`) imported from
`@arbitrator/contracts` (or `{ Type as t }` from `typebox` locally). No zod, so
`openapi()` needs no `mapJsonSchema`. Contract schemas are validated with
`Value.Check` / `Value.Parse` from `typebox/value`.

`src/index.ts` exports `app` (named + default) and only listens when
`inAotBuild()` is false, so an AOT build can evaluate the route graph without a
socket, a reconcile or a RabbitMQ consumer. Note: `.use(websocket())` currently
makes the bun AOT plugin fail (`Bundle failed`), so `bun build.ts` does not
complete until that is resolved upstream — plain `bun build --target=bun` works.

## Routes

`POST /exchanges/:slug/start` (501 if no adapter), `POST /exchanges/:slug/stop`,
`POST /reconcile` (force full reconcile), `GET /exchanges`, `GET /workers`,
`WS /exchanges/ws` (server-push status; the UI fans this out, nothing polls).

Elysia v2 rules: route options come **before** the handler, and `.ws()` needs
`.use(websocket())` from `elysia/websocket`. Every route carries `detail`
tags (`orchestrator`, `workers`, `events`); the WS route is hidden from OpenAPI.

Lister calls go through `orchestrator/lister.ts` (`@arbitrator/sdk` Eden client).
Eden **rejects** instead of returning an error tuple, so fire-and-forget
reconciles (`schedule()`, `onStart`) always `.catch()` — a lister outage logs and
keeps the server up.

## Non-obvious rules

- **`orchestrator/reconcile.ts` stays pure** (no I/O, time, or randomness). All
  lister/worker I/O sits at the edges in `service.ts`/`pool.ts`. Keep the tests
  passing.
- Reconcile is level-triggered/single-flight with a 300 ms debounce: recompute
  full desired state, apply only the delta. Never apply an event's diff directly
  (ADR 0001).
- **Control vs data plane (ADR 0002):** `postMessage` carries control only
  (`workerCommandSchema`/`workerEventSchema`); orderbook data goes to RabbitMQ
  directly from each worker (`sendToQueueNow` to `Queues.orderbookFor(exchange)`).
  Do not route orderbook data through the parent.
- Migrated workers use the contracts protocol (`bootstrap` / `onCommand` /
  `createOrderbookPublisher`): `binance`, `gate-io`, `indodax`, `kucoin`, `mexc`.
  Legacy workers still read `Bun.argv` and `self.postMessage` and use the
  `src/types` / `src/utils` shims: `bitget`, `bitmart`, `huobi`, `pintu`.
- Indodax displays `traded_currency_unit` (what lister stores as
  `market.exchangeSymbol`) but subscribes with its pair `id`. The worker maps
  CMC id -> pair id through `workers/orderbooks/indodax-symbols.ts` (generated
  from `indodax.com/api/pairs`), falling back to `<ticker>idr`. Regenerate that
  table when Indodax lists a coin whose unit differs from `traded_currency`.
- To typecheck a worker, add its file to `tsconfig.app.json` `include`. That list
  currently names only `binance`, `gate-io`, `indodax`, `kucoin` — `mexc` is
  migrated but not included yet, so it is not covered by the focused `tsc`.
- A worker that dies is respawned by the pool, not by a reconcile; worker socket
  retry is the worker's own concern.
- Started exchanges need lister reachable (`LISTER_URL`, default
  `http://localhost:3001`).
