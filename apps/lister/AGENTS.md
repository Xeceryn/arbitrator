# apps/lister

Source of truth for arbitration data. oRPC API on `:3001`, Postgres via
drizzle (`drizzle-orm/bun-sql`). The UI, sender, receiver, cmc-collector and the
migrator all read from it.

## Run

```bash
bun run dev            # bun run --watch src/index.ts
bun run build          # bun build --target=bun ./src/index.ts --outdir=./dist
bun run db:generate    # drizzle-kit generate
bun run db:migrate     # drizzle-kit migrate
bun run db:studio      # drizzle-kit studio
bun run typecheck      # bun --check
```

Entry: `src/index.ts` — `Bun.serve` wrapping the oRPC `RPCHandler`, plus
`startLastPriceScheduler()`. `src/router.ts` aggregates the domain routers.

## Structure

```
src/core/<entity>/     chain, chain-link, cryptocurrency, exchange, market, opportunity, utility
  <entity>.ts          data-access namespace / domain logic
  <entity>.router.ts   oRPC procedures (os.input/os.output/os.handler)
  <entity>.sql.ts      drizzle table (this is the schema glob target)
  <entity>.schema.ts   zod schemas
src/core/{constants,schemas,types}.ts   public subpath exports (@arbitrator/lister/{types,constants,schemas})
src/database/          connection.ts, relations.ts, schema.ts
src/events/            metadata.ts (publishMetadataChanged), publisher.ts
src/last-price/        router + Bun.cron scheduler
src/common/            shared pagination helpers
```

## Non-obvious rules

- **Publish after mutations.** Every mutation that changes transferability must
  call `void publishMetadataChanged({ entity, action, ... })` (from `src/events`).
  It is best-effort, validates against the contracts schema, and never throws —
  a lost event is a latency bug, the sender full-reconciles.
  `utility.clearDatabase` is dev-only and intentionally does not publish.
- Drizzle schema glob is `src/**/*.sql.ts` (see `drizzle.config.ts`). Do not put
  table definitions elsewhere or migrations will miss them.
- `DATABASE_URL` falls back to `postgres://postgres:postgres@localhost:5432/arbitrator`.
- `market.listTransferableCoins` is the sender's read-model: directed,
  `tradeEnabled` required on both markets, deduped unordered pairs. Keep it
  composable (a future signal feature will add filters) — don't bake signal logic in.
- `src/last-price/last-price.scheduler.ts` writes `last-price:<symbol>` to Redis
  every 5 minutes from Indodax's public ticker; the receiver reads it for
  USDT/IDR conversion.
- Migrations live in `apps/lister/migrations/`; generate them, don't hand-write.

## Docker

`Dockerfile` has a default `runtime` target (runs `dist/index.js`) and a
`migrate` target (`drizzle-kit migrate`) used by `deploy.compose.yaml`.
