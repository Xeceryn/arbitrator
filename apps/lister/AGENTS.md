# apps/lister

Source of truth for arbitration data. Elysia API on `:3001` (OpenAPI at
`/openapi`, spec at `/openapi/json`), Postgres via drizzle (`drizzle-orm/bun-sql`).
The UI, sender, receiver, cmc-collector and the migrator all read from it.

## Run

```bash
bun run dev            # bun run --watch src/index.ts
bun run build          # bun build --target=bun ./src/index.ts --outdir=./dist
bun run db:generate    # drizzle-kit generate
bun run db:migrate     # drizzle-kit migrate
bun run db:studio      # drizzle-kit studio
bun run typecheck      # bun --check
```

Entry: `src/index.ts` — listens on `:3001` with the Elysia `app` from
`src/app.ts`, then `startLastPriceScheduler()`. `src/app.ts` registers `cors()`,
`openapi()` and every route plugin; it also exports the `App` type the SDK's Eden
client is built from.

## Structure

```
src/core/<entity>/     chain, chain-link, cryptocurrency, exchange, market, opportunity, utility
  <entity>.ts          data-access namespace / domain logic
  <entity>.route.ts    Elysia route plugin (options before handler)
  <entity>.sql.ts      drizzle table (this is the schema glob target)
  <entity>.schema.ts   zod schemas
src/core/{constants,schemas,types}.ts   public subpath exports (@arbitrator/lister/{types,constants,schemas})
src/database/          connection.ts, relations.ts, schema.ts
src/events/            metadata.ts (publishMetadataChanged), publisher.ts
src/last-price/        route plugin + Bun.cron scheduler
src/common/            shared pagination helpers + `{ message }` error schema
```

## Non-obvious rules

- **Elysia v2 arg order.** `.get(path, { query, body, params, response, detail },
handler)` — options _before_ the handler. The v1 handler-first order still
  compiles but silently destroys inference. Register static segments
  (`/market/detailed`) before their `/:id` siblings.
- **Errors are HTTP statuses.** `set.status = 404 | 409 | 500` returning
  `{ message }`; there is no `ORPCError` anymore.
- **Publish after mutations.** Every mutation that changes transferability must
  call `void publishMetadataChanged({ entity, action, ... })` (from `src/events`).
  It is best-effort, validates against the contracts schema, and never throws —
  a lost event is a latency bug, the sender full-reconciles.
  `utility.clearDatabase` is dev-only and intentionally does not publish.
- Drizzle schema glob is `src/**/*.sql.ts` (see `drizzle.config.ts`). Do not put
  table definitions elsewhere or migrations will miss them.
- `DATABASE_URL` falls back to `postgres://postgres:postgres@localhost:5432/arbitrator`.
- All list endpoints search through `defaultSearchCondition`
  (`src/common/pagination.ts`): drizzle's `dataType` is **not** `"number"` for
  integer columns (it is `"number int32"`) and enums are `"string enum"`, so
  match on the type family and cast non-text columns to `text` before `ILIKE`.
  A bare `ilike` on `integer`/enum is a Postgres type error (HTTP 500), and
  `eq(column, Number(search))` sends `NaN` for any non-numeric term. Covered by
  `pagination.test.ts`.
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
