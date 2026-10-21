import {
    toElysiaSchema as convertDrizzleSchema,
    type LegacyTypeBoxSchema,
} from "@arbitrator/elysia-kit";
import { t } from "elysia";
import type { TSchemaOptions, TUnsafe } from "typebox";

/**
 * An Elysia v2 TypeBox schema that carries its static type explicitly.
 *
 * [`toElysiaSchema`] converts a runtime `drizzle-typebox` tree (TypeBox 0.34)
 * into a TypeBox v1 schema, which means its declared return type is `any`. Used
 * bare, `Static<typeof schema>` would collapse to `unknown` and the whole
 * repository layer would lose its types.
 *
 * `TUnsafe` is TypeBox v1's escape hatch for exactly this: `Static`,
 * `StaticEncode` and `StaticDecode` all read `~unsafe` straight back, and
 * Elysia's `UnwrapSchema` treats it as a TypeBox schema, so routes, OpenAPI and
 * Eden keep their types. The marker is type-level only — the value stays the
 * real `t.Object` built by the converter, so validation and serialisation are
 * unchanged.
 */
export type TypedSchema<T> = TUnsafe<T>;

/**
 * JSON Schema for a timestamp column: `string` / `date-time`.
 *
 * Drizzle hands the repository `Date` instances (`timestamp({ mode: "date" })`),
 * so the schema is a codec: the document and the validation side stay an ISO
 * string, and Elysia encodes the `Date` on the way out of the handler.
 *
 * Caveat: a codec in a **response** schema currently makes the Elysia AOT
 * bundle crash at startup (`The superclass is not a constructor`, a module
 * ordering bug in elysia 2.0.0-rc.0), which is why lister ships a plain bundle
 * (see `build.ts`).
 */
const isoDateTimeSchema = t.Encode(t.String({ format: "date-time" }), (value) =>
    (value as Date).toISOString(),
);

function isIsoDateString(schema: any): boolean {
    return (
        schema?.type === "string" &&
        schema.format === "date-time" &&
        schema["~codec"] === undefined
    );
}

function withIsoDateEncoding(schema: any): any {
    if (!schema || typeof schema !== "object") return schema;
    if (isIsoDateString(schema)) return isoDateTimeSchema;

    switch (schema["~kind"]) {
        case "Object":
            for (const key of Object.keys(schema.properties ?? {})) {
                schema.properties[key] = withIsoDateEncoding(
                    schema.properties[key],
                );
            }
            return schema;
        case "Array":
            schema.items = withIsoDateEncoding(schema.items);
            return schema;
        case "Union":
            schema.anyOf = schema.anyOf.map(withIsoDateEncoding);
            return schema;
        default:
            return schema;
    }
}

/**
 * Convert a `drizzle-typebox` schema (`createSelectSchema` /
 * `createInsertSchema` / `createUpdateSchema`) into an Elysia v2 schema and
 * pair it with the drizzle-inferred static type.
 *
 * Every drizzle-generated schema must go through this: Elysia v2 validates with
 * `typebox@1` and throws `"body" is not a schema` for a raw 0.34 tree.
 */
export function fromDrizzle<T>(schema: unknown): TypedSchema<T> {
    const converted = convertDrizzleSchema(schema as LegacyTypeBoxSchema);

    return withIsoDateEncoding(converted) as TypedSchema<T>;
}

/** Re-declare the static type of a composed or hand-built Elysia `t` schema. */
export function typedSchema<T>(schema: unknown): TypedSchema<T> {
    return schema as TypedSchema<T>;
}

/**
 * Object-schema `extend`: reuse every property of `base` and add `extra`.
 *
 * TypeBox v1 has no `.extend`, and `t.Intersect` is the wrong tool here: it
 * documents the body as `allOf` and refuses to validate a member that carries an
 * encode codec (the timestamp columns), so the base properties are spread into a
 * single object instead. No field list is written by hand — `required` is
 * re-derived from the properties' own optional markers.
 */
export function extendSchema<T>(
    base: TypedSchema<unknown>,
    extra: Record<string, unknown>,
): TypedSchema<T> {
    const properties = (
        base as unknown as { properties?: Record<string, unknown> }
    ).properties;

    return t.Object({
        ...properties,
        ...extra,
    } as never) as unknown as TypedSchema<T>;
}

/**
 * Enum of the given string literals.
 *
 * Uses `t.UnionEnum`, **not** `t.Union([t.Literal(...)])`: a union of literals
 * anywhere in a response schema reorders Elysia's emitted modules and the AOT
 * bundle dies at startup with `The superclass is not a constructor`
 * (elysiajs/elysia#2024). `t.UnionEnum` is AOT-safe and validates the same set.
 */
export function literalUnion(
    keys: readonly string[],
    options?: TSchemaOptions,
) {
    return t.UnionEnum(keys as unknown as [never, ...never[]], options);
}
