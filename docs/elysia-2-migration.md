# Elysia 2 migration (branch `elysia-2-migration`)

Migrate every oRPC surface to Elysia v2, document each service with OpenAPI, and
replace the oRPC client in `@arbitrator/sdk` with an Eden Treaty client.

## Versions and packaging

All Elysia v2 packages live in the **`elysia` catalog** in the root
`package.json`, so a version bump happens in one place:

| package                 | catalog entry | why                                                      |
| ----------------------- | ------------- | -------------------------------------------------------- |
| `elysia`                | `2.0.0-rc.0`  | core framework                                           |
| `@elysia/openapi`       | `2.0.0-rc.0`  | OpenAPI + Scalar UI (v2 rename of `@elysiajs/swagger`)   |
| `@elysia/cors`          | `2.0.0-rc.0`  | CORS (replaces the oRPC `CORSPlugin`)                    |
| `@elysia/static`        | `2.0.0-rc.0`  | ui `/public` assets                                      |
| `@elysia/server-timing` | `2.0.0-rc.0`  | ui server timing                                         |
| `@elysia/html`          | `2.0.0-rc.0`  | ui JSX (`@kitajs/html`)                                  |
| `@elysia/eden`          | `2.0.0-rc.0`  | Eden Treaty (v2 rename of `@elysiajs/eden`)              |
| `typebox`               | `^1.4.2`      | peer of `elysia`; unresolvable peer breaks **all** types |
| `exact-mirror`          | `^1.2.6`      | peer of `elysia`                                         |
| `openapi-types`         | `^12.1.3`     | peer of `@elysia/openapi`                                |

Consumers reference `catalog:elysia`, never a literal version. The old
`@elysiajs/*` packages and `@orpc/*` are not used anywhere after the migration.

> **Peer deps are not optional.** The v1 recommendation skipped `typebox` /
> `exact-mirror`; with v2 a missing peer makes Elysia's `.d.ts` degrade and every
> handler loses its parameter types (silently `any`). They are declared as real
> dependencies in `lister`, `sender`, `ui`.

## Elysia v2 syntax rules

1. **Route options come before the handler**: `app.get(path, options, handler)`.
   `app.get(path, handler, options)` is the v1 order and still compiles — but the
   handler then gets **no inference** (`query`/`body`/`params` become `any`) and
   Eden/OpenAPI see the wrong types. This is the single most common trap.
2. Schemas may be **zod 4** (`import { z } from "zod"`) or Elysia `t`. Use zod for
   everything that already has a zod schema (drizzle-zod); use `t.Numeric()` for
   path params that must be numbers (`params: t.Object({ id: t.Numeric() })`).
3. `detail: { summary, tags }` documents a route; `detail.hide: true` hides it.
4. `@elysia/openapi` is registered once per app:

    ```ts
    import { openapi } from "@elysia/openapi";
    import { z } from "zod";

    .use(
        openapi({
            documentation: { info: { title: "...", version: "..." } },
            mapJsonSchema: { zod: z.toJSONSchema },
        }),
    )
    ```

    `/openapi` serves the Scalar UI, `/openapi/json` the spec.

5. Status codes: set `set.status = 404` (v2 also exposes `status()` from
   `elysia`). Keep the existing HTTP semantics of each service.

## `apps/lister` — authoritative REST route map (port 3001)

oRPC procedures are replaced by these routes. Every consumer rewrite
(`sdk`, `ui`, `receiver`, `cmc-collector`, `old-lister-migrator`,
`chain-metadata-collector`) must use exactly this shape.

| route                            | method | input                                                         | old procedure                                                       |
| -------------------------------- | ------ | ------------------------------------------------------------- | ------------------------------------------------------------------- |
| `/exchange`                      | GET    | query: exchange pagination                                    | `exchange.list`                                                     |
| `/exchange`                      | POST   | body: insert                                                  | `exchange.add`                                                      |
| `/exchange/:id`                  | GET    | params id                                                     | `exchange.findById`                                                 |
| `/exchange/:id/cryptocurrencies` | GET    | params id                                                     | `exchange.findByIdWithCryptocurrencies`                             |
| `/exchange/:id`                  | PATCH  | params id, body: update                                       | `exchange.update`                                                   |
| `/exchange/:id`                  | DELETE | params id                                                     | `exchange.remove`                                                   |
| `/cryptocurrency`                | GET    | query: coin pagination                                        | `cryptocurrency.list`                                               |
| `/cryptocurrency`                | POST   | body: insert                                                  | `cryptocurrency.add`                                                |
| `/cryptocurrency/:id`            | GET    | params id                                                     | `cryptocurrency.findById`                                           |
| `/cryptocurrency/:id/routes`     | GET    | params id                                                     | `cryptocurrency.routes`                                             |
| `/cryptocurrency/:id`            | PATCH  | params id, body: update                                       | `cryptocurrency.update`                                             |
| `/cryptocurrency/:id`            | DELETE | params id                                                     | `cryptocurrency.remove`                                             |
| `/market`                        | GET    | query: `exchangeId?`, `cryptocurrencyId?`                     | `market.list`                                                       |
| `/market/detailed`               | GET    | same query                                                    | `market.listDetailed`                                               |
| `/market/available-exchanges`    | GET    | query: exchange pagination + `cryptocurrencyId`               | `market.listAvailableExchanges`                                     |
| `/market/transferable-coins`     | POST   | body: `{ exchangeIds: number[] }`                             | `market.listTransferableCoins` (POST because the query is an array) |
| `/market/assign`                 | POST   | body: assign                                                  | `market.assign`                                                     |
| `/market/unassign`               | POST   | body: `{ exchangeId, cryptocurrencyId }`                      | `market.unassign`                                                   |
| `/market`                        | PATCH  | body: update payload (keyed by exchangeId + cryptocurrencyId) | `market.update`                                                     |
| `/market/:id`                    | GET    | params id                                                     | `market.findById`                                                   |
| `/chain-link`                    | GET    | query: `marketId?`, `chainId?`                                | `chainLink.list`                                                    |
| `/chain-link/detailed`           | GET    | same query                                                    | `chainLink.listDetailed`                                            |
| `/chain-link/available-chains`   | GET    | query: chain pagination + `marketId`                          | `chainLink.listAvailableChains`                                     |
| `/chain-link`                    | POST   | body: insert                                                  | `chainLink.add`                                                     |
| `/chain-link/:id`                | GET    | params id                                                     | `chainLink.findById`                                                |
| `/chain-link/:id`                | PATCH  | params id, body: update                                       | `chainLink.update`                                                  |
| `/chain-link/:id`                | DELETE | params id                                                     | `chainLink.remove`                                                  |
| `/chain`                         | GET    | query: chain pagination                                       | `chain.list`                                                        |
| `/chain`                         | POST   | body: insert                                                  | `chain.add`                                                         |
| `/chain/:id`                     | GET    | params id                                                     | `chain.findById`                                                    |
| `/chain/:id`                     | PATCH  | params id, body: update                                       | `chain.update`                                                      |
| `/chain/:id`                     | DELETE | params id                                                     | `chain.remove`                                                      |
| `/opportunity`                   | GET    | query: `orderBy`, `order`                                     | `opportunity.list`                                                  |
| `/opportunity/sync`              | POST   | body: `{ exchangeIds }`                                       | `opportunity.sync`                                                  |
| `/last-price/:symbol`            | GET    | params symbol                                                 | `lastPrice.get`                                                     |
| `/utility/ping`                  | GET    | —                                                             | `utility.ping`                                                      |
| `/utility/clear-database`        | POST   | —                                                             | `utility.clearDatabase` (dev only, `detail.hide: true`)             |

Static segments (`/market/detailed`) must be registered **before** the
dynamic `/market/:id` sibling so they win the match.

Behaviour that must survive the rewrite:

- `publishMetadataChanged({...})` on every mutation (see `apps/lister/AGENTS.md`),
  unchanged.
- oRPC `ORPCError("NOT_FOUND" | "CONFLICT" | "INTERNAL_SERVER_ERROR", { message })`
  becomes a real HTTP status (`set.status = 404 | 409 | 500`) returning
  `{ message }`. Keep the messages.
- CORS on `:3001` stays open (`@elysia/cors`).
- `startLastPriceScheduler()` still starts from `src/index.ts`.

Files: domain modules (`<entity>.ts`, `<entity>.sql.ts`, `<entity>.schema.ts`) are
**untouched**. `<entity>.router.ts` becomes `<entity>.route.ts` exporting an
Elysia instance; `src/app.ts` aggregates them and exports `app` + `App`;
`src/index.ts` only listens and starts the scheduler. `package.json` export `.`
becomes `./src/app.ts`.

## `@arbitrator/sdk` — Eden client

```ts
import { treaty } from "@elysia/eden";
import type { App } from "@arbitrator/lister/app";

export const lister = treaty<App>(env.LISTER_URL);
```

- Export the concrete treaty client (no generic proxy, no `createSafeClient`).
- Every call returns `{ data, error }`; `data` is `null` when `error` is set and
  `error` is `null` on success.
- No tuple (`[error, data]`) API anymore — call sites must be updated.
- `App` type comes from the lister app instance, so new lister routes appear in
  the SDK with no codegen. Both sides must resolve the same `elysia` copy.

Eden call shapes used by the migration:

```ts
await lister.exchange.get({ query: { limit: -1 } }); // list
await lister.exchange.post({ name, slug, logo, ... }); // create
await lister.exchange({ id }).get(); // findById
await lister.exchange({ id })["cryptocurrencies"].get(); // detail
await lister.exchange({ id }).patch({ name }); // update
await lister.exchange({ id }).delete(); // remove
await lister.market.detailed.get({ query: { exchangeId: 1 } });
await lister.market["available-exchanges"].get({ query: { cryptocurrencyId: 3 } });
await lister.market["transferable-coins"].post({ exchangeIds: [1, 2] });
await lister.market.assign.post({ exchangeId, cryptocurrencyId });
await lister.market.unassign.post({ exchangeId, cryptocurrencyId });
await lister.market.patch({ exchangeId, cryptocurrencyId, tradeEnabled });
await lister["chain-link"].get({ query: { marketId } });
await lister["chain-link"].detailed.get({ query: { marketId } });
await lister["chain-link"]["available-chains"].get({ query: { marketId } });
await lister.chain.get({ query: { limit: -1 } });
await lister.chain.post({ name, code });
await lister.chain({ id }).patch({ name });
await lister.opportunity.get({ query: { orderBy, order } });
await lister.opportunity.sync.post({ exchangeIds });
await lister["last-price"]({ symbol }).get();
await lister.utility.ping.get();
```

## `apps/sender` — Elysia v2 (port 3002)

Already Elysia 1.4. Upgrade only:

- options-before-handler for `post`/`get`/`ws`.
- register `@elysia/openapi` with `documentation.info` (title "Arbitrator
  Sender", version from `apps/sender/package.json` if cheap, `detail.tags`:
  `orchestrator`, `workers`, `events`).
- keep the WS stream (`/exchanges/ws`) behaviour byte-for-byte: snapshot on open,
  `status` pushes, unsubscribe on close.
- keep response schemas (zod) and the 501 `{ message }` body.
- routes unchanged otherwise.

## `apps/ui` — Elysia v2 + Eden (port 3000)

- `@elysiajs/{html,static,server-timing}` → `@elysia/{html,static,server-timing}`;
  `@elysiajs/eden` → `@elysia/eden`.
- `@gtramontina.com/elysia-htmx` has `peerDependencies: elysia ^1.0.0` and is
  dropped: vendor a small plugin at `src/plugins/htmx.ts` that exposes `hx`
  (`request`, `boosted`, `isHTMX`, `currentURL`, `target`, `trigger`,
  `triggerName`, `prompt`, plus `redirect`, `pushURL`, `replaceURL`, `refresh`,
  `reswap`, `retarget`, `reselect`, `triggerEvent`, `stopPolling`) on the context
  via `derive`, with `set.headers["HX-*"]` mutations. Controllers only need
  `.use(htmx())` to keep working.
- options-before-handler everywhere; `onError` keeps the two-parameter form (it
  gained properties in v2 — keep `{ code, error, request, set }`).
- `sender.client.ts` uses `treaty<App>` from `@elysia/eden`.
- `plugins/clients.ts` decorates `lister` (from `@arbitrator/sdk`) and `sender`
  (treaty) as today; handlers read them from context.
- `listerClient.x.list(...)` → `lister.x.get({ query })`; tuple results →
  `{ data, error }`. Keep the htmx error semantics (`HX-Reswap: none`,
  `make-toast`) intact.
- add `@elysia/openapi` (title "Arbitrator UI") so the htmx routes are
  discoverable; exclude `/public/*` assets from the document.

## Consumers to update (no Elysia, only the SDK shape)

`apps/receiver`, `apps/cmc-collector`, `apps/old-lister-migrator`,
`apps/chain-metadata-collector`: replace tuple destructuring with
`{ data, error }`, use the route map above, keep the console/throw behaviour and
the existing domain logic.

## Definition of done

- `grep -rn "orpc\|@elysiajs/" apps packages --include=*.ts --include=*.json`
  finds nothing.
- Root `package.json` catalogs: no `@orpc/*`, `@elysiajs/*` entries.
- Per package typecheck (from that package/app directory):
  `bunx tsc -p tsconfig.json --noEmit` (root `bunx tsc -p apps/sender/tsconfig.app.json --noEmit`
  for sender), `bun --check` where a `typecheck` script exists.
- Tests: `bun test apps/sender/src/orchestrator` and
  `bun test` in `apps/chain-metadata-collector` pass.
- `bun run lint` and `bun run format` clean.
- Runtime smoke: lister `curl localhost:3001/openapi/json`, sender
  `curl localhost:3002/openapi/json`, ui `curl localhost:3000/openapi/json`
  (details hidden or tagged, assets excluded).

---

## Gotchas found while migrating (read before touching this code)

1. **Handler-first routes silently lose types.** `.get(path, handler, options)`
   still compiles, but `query`/`body`/`params` become `any`, OpenAPI renders the
   options object as the response, and Eden types are garbage. Always
   `(path, options, handler)`.
2. **Never `z.coerce` in an output schema.** Elysia types a standard-schema
   response from the schema's **input** side. `z.coerce.number()` has an
   `unknown` input, so `meta.items` reaches every Eden client as `unknown`
   (that is why `paginationMetadataSchema` uses plain `z.number()`; coerce only
   request bodies/queries).
3. **`mapJsonSchema` needs the date override.** Plain `{ zod: z.toJSONSchema }`
   drops the whole response document when it meets `z.date()`. Use
   `openapiZodMap` from `@arbitrator/elysia-kit`.
4. **`exclude: { staticFile: true }` is not enough** to hide plugin-registered
   static routes in this RC — exclude the prefix explicitly:
   `exclude: { staticFile: true, paths: ["/public", /^\/public\//] }`.
5. **`@elysia/html` breaks type inference in this RC.** A single
   `.use(html())` turns every later handler's context into `any`. The UI does
   not use it: `BaseLayout` emits `<!DOCTYPE html>` and `main.ts` sets the HTML
   content-type (skipping `/public/*` so CSS/JS keep their own type).
6. **`onError` has no `code`.** The catch-all context is
   `{ error, request, set, … }`; the token lives on `error.code`:
   `not-found`, `validation`, `parse`, `internal-server-error`.
7. **`.on("request", handler)` is gone** — use `.onRequest(handler)`
   (likewise `onAfterResponse`, …). Lifecycle hooks otherwise keep their `on`
   prefix.
8. **`.ws()` needs the provider**: `.use(websocket())` from
   `elysia/websocket`, options `websocket: { perMessageDeflate: true }`.
9. **Eden rejects; it does not return error tuples.** Any fire-and-forget call
   (`void runReconcile()`, `onStart`) must `.catch()`, or an unreachable lister
   becomes an unhandled rejection that kills the process.
10. **Peer deps matter.** Without `typebox`, `exact-mirror` and `openapi-types`
    installed next to `elysia`, the `.d.ts` degrades and _every_ handler loses
    its parameter types. They are part of the `elysia` catalog.

## Shared package

`packages/elysia-kit` (`@arbitrator/elysia-kit`) holds the zod → OpenAPI mapper
and anything else that must stay identical across services. Services keep their
own OpenAPI title/tags in `src/app.ts`.
