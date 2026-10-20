# packages/elysia-kit

Shared Elysia v2 wiring. Currently one thing: the **zod → OpenAPI JSON Schema
mapper** used by every Elysia service.

```ts
import { openapi } from "@elysia/openapi";
import { openapiZodMap } from "@arbitrator/elysia-kit";

new Elysia().use(openapi({ mapJsonSchema: openapiZodMap }));
```

## Why it exists

Elysia's OpenAPI plugin uses the schema's own JSON Schema converter. Plain
`z.toJSONSchema` throws away the **entire response document** as soon as it meets
a schema it cannot represent — and `z.date()` (every drizzle-zod select schema's
`createdAt` / `updatedAt`) is one of those. The symptom is an OpenAPI path with
only `409`/`500` responses and no `200`.

`zodToJsonSchema` therefore:

- sets `unrepresentable: "any"` so unknown shapes degrade instead of failing, and
- overrides `z.ZodDate` to `{ type: "string", format: "date-time" }`.

Use `openapiZodMap` rather than a literal `{ zod: z.toJSONSchema }` — a per-app
copy silently drifts and drops dates again.

## Rules

- No runtime dependencies except `zod` (`catalog:core`); it is schema plumbing,
  not a framework layer.
- Service-specific OpenAPI config (title, tags, path) stays in each app's
  `src/app.ts`; only the shared mapper lives here.
