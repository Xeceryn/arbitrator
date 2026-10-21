# packages/elysia-kit

Shared Elysia v2 wiring: the **drizzle → Elysia schema converter** and the
legacy **zod → OpenAPI JSON Schema mapper**.

## `toElysiaSchema` (drizzle tables → Elysia `t`)

```ts
import { toElysiaSchema } from "@arbitrator/elysia-kit";
import { createInsertSchema, createSelectSchema } from "drizzle-typebox";

export const exchangeSelectSchema = toElysiaSchema(
    createSelectSchema(exchange),
);
export const exchangeInsertSchema = t.Omit(
    toElysiaSchema(createInsertSchema(exchange)),
    ["createdAt", "updatedAt"],
);
```

`drizzle-typebox@1.0.0-beta` still depends on `@sinclair/typebox` 0.34, while
Elysia v2 validates with `typebox@1`. Handing a 0.34 object to a route throws
`"body" is not a schema` when the route registers. The converter maps:

- `Date` → `t.String({ format: "date-time" })` (JSON carries ISO strings, and
  OpenAPI stays accurate)
- `anyOf` / `oneOf` → `t.Union` (pgEnums arrive as literal unions)
- `integer` / `number` keep `minimum` / `maximum` — that is what makes Elysia
  coerce numeric query strings
- non-`required` object properties → `t.Optional` (drizzle DB defaults show up
  as optional insert fields)

Use `t.Omit` / `t.Pick` / `t.Partial` / `t.Intersect` for schema composition;
TypeBox schemas are plain objects and have no `.omit()` methods.

## `openapiZodMap` (legacy)

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
