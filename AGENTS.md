# AGENTS.md

Bun workspace monorepo (`apps/*`, `packages/*`). No turbo/nx/task runner — the
root `package.json` scripts are the whole build system.

**Every app and package has its own `AGENTS.md`. Read it before changing code
there.** This root file covers only cross-cutting facts.

## Environment

- `bun install` from the repo root installs every workspace.
- Env comes from `.env` files, not direnv. Bun loads only the `.env` in each
  app's own directory (no walk-up), so every real app has `apps/<name>/.env`;
  `docker compose` reads the root `.env`. `.envrc` is being retired.
- Read env through `@arbitrator/env-loader` (`env`), never `process.env` /
  `Bun.env` directly. Template: repo-root `.env.example`.
- Bun version is pinned by the Dockerfiles (`oven/bun:1.4.3`).
- Root `README.md` is a stub — not a source of truth.

## Commands

- `bun run format` — oxfmt (4-space indent, 80 cols, sorted imports).
- `bun run lint` / `bun run lint:fix` — oxlint.
- **Typecheck per app/package, not from the root.** `cd apps/<name>` (or
  `packages/<name>`) and run its own `typecheck` script; not every package has
  one. The root `typecheck` script exists but is not the workflow.
- Sender-only check (excludes legacy workers):
  `bunx tsc -p apps/sender/tsconfig.app.json --noEmit`.
- Tests: `bun test apps/sender/src/orchestrator` (orchestrator pool + reconcile)
  and `bun test` in `apps/chain-metadata-collector` (pure chain normalization).
- Local infra: `docker compose up -d postgresql rabbitmq redis`.
- Prod-ish stack: `docker compose -f deploy.compose.yaml up --build`
  (nginx is the only published service, `https://<LOCAL_DOMAIN>`).
- Run a CLI against the deploy stack: `docker compose -f deploy.compose.yaml run --rm -T --no-deps --workdir /app/apps/cmc-collector tools bun run indodax`
  (build the profile-gated image once with `docker compose -f deploy.compose.yaml build tools`).

Run lint → typecheck (in the changed app/package) → test before declaring work
done.

## Repo map

- `apps/lister` — source of truth. Elysia v2 API `:3001` (OpenAPI at
  `/openapi`), Postgres/drizzle.
- `apps/sender` — orchestrator + worker pool. Elysia v2 `:3002` (OpenAPI at
  `/openapi`).
- `apps/receiver` — RabbitMQ orderbook consumer (cluster per CPU).
- `apps/ui` — server-rendered htmx app `:3000` (Elysia v2).
- `apps/cmc-collector` — CMC scrape/import CLI, plus an Indodax-only live scan
  (`bun run indodax`) for listings, trade and chain maintenance state.
- `apps/chain-metadata-collector` — per-exchange coin/chain crawl → lister chains
  and chain links.
- `apps/old-lister-migrator` — one-off migration scripts.
- `apps/{ticker,galactus,potential,gate-proxy}` — empty scaffolds.
- `packages/contracts` — shared zod schemas + RabbitMQ topology.
- `packages/messaging` — shared RabbitMQ publish/subscribe.
- `packages/logger` — winston factory.
- `packages/sdk` — Eden Treaty client to lister (exports `lister`; every call
  returns `{ data, error }`).
- `packages/env-loader` — unused legacy env schema.
- `packages/elysia-kit` — shared Elysia v2 wiring (the zod → OpenAPI schema
  mapper used by every service).

## Dependencies and bun catalogs

- Workspace deps use `workspace:*`.
- Shared third-party deps use `catalog:<name>` from `workspaces.catalogs` in the
  root `package.json`. Catalogs: `core`, `elysia`, `tools`, `sdk`, `types`.
- **Everything Elysia lives in the `elysia` catalog** (`elysia`, `@elysia/*`,
  plus the `typebox` / `exact-mirror` / `openapi-types` peers). Bump the version
  there, never in a leaf `package.json`.
- **HTTP schemas are TypeBox, not zod.** `typebox` (v1, what `t` is built from)
  is the catalog entry Elysia validates with; drizzle tables are turned into
  schemas with `drizzle-typebox` + `toElysiaSchema()` (`@arbitrator/elysia-kit`).
  `drizzle-typebox` still emits TypeBox 0.34 shapes, hence the converter — never
  pass its output straight to a route.
- zod stays only where it is not an HTTP schema (env validation), and is
  reachable through `catalog:core`.
- **If a package could be reused by another app or package, add it to a catalog
  and reference `catalog:<name>` instead of pinning a version in the leaf
  `package.json`.** (Debt example: `apps/sender` pins `binance`, `bitget-api`,
  `kucoin-api`, … directly even though the `sdk` catalog defines them.)

## Cross-cutting gotchas

- `verbatimModuleSyntax` and `noUncheckedIndexedAccess` are on: use `import
type`, and guard or `!` indexed access.
- Cross-package imports resolve through `tsconfig.base.json` `paths`, not only
  `package.json` exports. `@arbitrator/lister/*` → `apps/lister/src/*`, so deep
  imports like `@arbitrator/lister/core/opportunity/opportunity` work even though
  they are absent from `apps/lister/package.json` exports.
- Builds are `Bun.build` into `dist`; Dockerfiles consume `dist`.
  `apps/{lister,sender,ui}/build.ts` run the build through
  `elysia/plugin/aot/bun`, so routes are compiled ahead of time: no per-route
  JIT on the first request. Anything with import-time side effects (listen,
  schedulers, asset bundling, broker connections) must be guarded with
  `inAotBuild()` from `elysia`, and the entry must export `app`.
- **`patches/elysia@<version>.patch` is temporary.** It fixes three AOT-plugin
  bugs in rc.0 (missing `hasSyncHmac` export in the cookie stub, `InvalidCookie`
  extending `ElysiaError` in the wrong module order, and cookie stubbing on WS
  apps). Bump `elysia` in the `elysia` catalog, delete the patch, drop the
  `patchedDependencies` entry, and re-run the three builds. Never hand-edit
  `node_modules` — bun hardlinks it to `~/.bun/install/cache`; use
  `bun patch elysia@<version>` + `bun patch --commit node_modules/elysia`.
- Elysia resources are **plugins, not module imports**: `databasePlugin` and
  `eventsPlugin` (lister), `orchestratorPlugin`/`eventsPlugin`/`listerPlugin`
  (sender), `clientsPlugin` (ui) decorate the context. Handlers read `db`,
  `events`, `lister` from context; domain/repository modules stay plain.
- Never hardcode a RabbitMQ routing key or queue name — import from
  `@arbitrator/contracts`.
- Data-plane rule (ADR 0002): worker `postMessage` carries **control only**;
  orderbook data goes through RabbitMQ.
- Reconcile is desired-state and idempotent (ADR 0001): recompute desired state
  and diff; never apply an event diff directly.
- Runtime ports: ui `3000`, lister `3001`, sender `3002`.

## Reference docs

- `docs/elysia-2-migration.md` — Elysia v2 conventions, lister REST route map,
  Eden call shapes. Read it before touching any HTTP surface.

- `docs/transfer-orchestration.md` — feature design + task tracker.
- `docs/adr/0001-desired-state-reconciliation.md`, `0002-worker-control-vs-data-plane.md`.
- `docs/architecture/` — C4 model (`model.c4`), runtime sequences (`flows.md`),
  and the generated RabbitMQ topology. `bun run arch:validate` before merging a
  model change; `bun run arch:topology` after touching `messaging.ts`.
- `apps/ui/UI_GUIDE.md`, `infra/nginx/README.md`.
