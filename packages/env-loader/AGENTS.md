# packages/env-loader

The single, typed environment surface for the monorepo. **Import `env` (or the
helpers) instead of reading `process.env` / `Bun.env` anywhere else.**

```ts
import { env, amqpUrl, listerUrl, senderUrl } from "@arbitrator/env-loader";

env.DATABASE_URL; // string (defaulted)
amqpUrl(); // honors AMQP_URL -> RABBITMQ_URL -> localhost default
```

- `src/index.ts` holds a zod schema for every variable the repo reads. Every
  variable has a **development default**, so a bare checkout works; secrets and
  venue keys are optional and collapse to `undefined` when unset or blank, so
  callers skip that integration instead of failing.
- `env` is parsed once at import. Invalid values throw with the offending field
  list (no silent fallback).
- Bun loads the `.env` of the current directory before the entry module runs,
  so this package does no dotenv loading itself.
- Adding a variable: put it in the schema here **and** in the repo-root
  `.env.example`.

Deps: `zod` (`catalog:core`).
