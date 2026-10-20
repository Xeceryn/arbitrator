# packages/sdk

Eden Treaty client for the lister service. Exports `lister`, built with
`treaty<App>` from `@elysia/eden`, so **every call returns `{ data, error }`** —
`data` is `null` when `error` is set, `error` is `null` on success. Check the
error before using the data:

```ts
const { data, error } = await lister.exchange.get({ query: { limit: -1 } });
if (error) throw new Error(String(error.value));
// data.data
```

- Base URL: `LISTER_URL` (default `http://localhost:3001`).
- Typed from lister's app instance (`@arbitrator/lister/app` → `App`); adding an
  Elysia route to lister makes it available here with no codegen.
- Call shapes follow the REST route map in `docs/elysia-2-migration.md`:
  path params are a leading call (`lister.chain({ id }).patch(body)`),
  query goes under `{ query }`, bodies are the first argument of
  `post`/`patch`/`delete`.
- `error` is Elysia's validation-aware union (`{ status, value }`); the status
  may be a real route status (404/409/500) or `422` for a schema failure, and
  only some branches carry `value.message`.
- Used by ui, sender, receiver, cmc-collector, chain-metadata-collector,
  old-lister-migrator.
- `elysia` is a devDependency so the treaty type resolves the same copy lister
  uses; bump both through the `elysia` catalog in the root `package.json`.
- No tests. `test` script is a failing placeholder.
