# apps/receiver

Consumes normalized orderbook snapshots from RabbitMQ, converts prices to IDR,
finds the price at the volume target, and writes the matching `opportunity` legs
directly in the lister database.

## Run

```bash
bun run dev            # bun run src/main.ts  (spawns one worker per CPU)
bun run start
bun run build          # Bun.build -> dist (compile: true)
```

No `typecheck` or `test` script.

## Structure

```
src/main.ts            supervisor: spawns one worker per CPU (Bun.spawn)
src/index.ts           the worker: lister lookup + consume + process + ack
build.ts               Bun.build compiles src/{main,index}.ts into dist
src/concurrent.ts      alternate batch-flush path (see gotcha)
src/main-concurrent.ts supervisor for the concurrent path
```

`main.ts` spawns `RECEIVER_WORKER ?? "src/index.ts"`; the Docker image sets
`RECEIVER_WORKER=dist/index.js`. `compose.yaml`/`deploy.compose.yaml` run
`dist/main.js`.

## Non-obvious rules

- The receiver may import `@arbitrator/contracts`, the lister data layer
  (`@arbitrator/lister/core/opportunity/opportunity`) and `@arbitrator/sdk` —
  **never sender internals.**
- On startup it lists exchanges from lister to build a slug→id map and the set of
  IDR-quoted exchanges. If lister is unreachable it `process.exit(1)`.
- USDT/IDR rate comes from Redis key `last-price:usdt` (written by the lister
  cron), cached in-process for 5 minutes, fallback `17869`. IDR-quoted exchanges
  (e.g. Indodax) skip conversion.
- Manual ack: a message is acked only after the DB write succeeds; a throw leaves
  it unacked so the broker redelivers. Each exchange owns a durable queue
  (`Queues.orderbookFor(slug)`) declared here.
- `src/concurrent.ts` / `main-concurrent.ts` are an alternative batched
  implementation (flush interval, in-flight cap) not used by the default
  `src/main.ts`. Don't assume changes there affect production.
- Binance quotes a few tickers per 1000/1e6 units; those get a `divider` by
  `cmcId` (see `src/index.ts`).
