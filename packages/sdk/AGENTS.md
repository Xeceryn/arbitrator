# packages/sdk

oRPC client to the lister service. Exports `listerClient`, built with
`createSafeClient`, so **every call returns a discriminated result** — check the
error before using the data:

```ts
const [error, result] = await listerClient.exchange.list({});
if (error) throw error;
// result.data
```

- Base URL: `LISTER_URL` (default `http://localhost:3001`).
- Typed from lister's router type (`@arbitrator/lister/router`); adding an oRPC
  procedure to lister makes it available here with no codegen.
- Used by ui, sender, receiver, cmc-collector, old-lister-migrator.
- `package.json` lists a `@arbitrator/sdk` self-dependency that looks accidental —
  leave it unless cleaning up deps.
- No tests. `test` script is a failing placeholder.
