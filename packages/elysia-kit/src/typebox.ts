import { t } from "elysia";

/**
 * Structural shape of a TypeBox 0.34 schema, which is what
 * `drizzle-typebox` emits. It is *not* the `typebox@1` shape Elysia v2 accepts
 * (`~kind` vs the old `Symbol(TypeBox.Kind)`), so it must be converted.
 */
export interface LegacyTypeBoxSchema {
    type?: string;
    properties?: Record<string, LegacyTypeBoxSchema>;
    required?: readonly string[];
    items?: LegacyTypeBoxSchema;
    anyOf?: LegacyTypeBoxSchema[];
    oneOf?: LegacyTypeBoxSchema[];
    const?: unknown;
    enum?: readonly unknown[];
    format?: string;
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    default?: unknown;
    description?: string;
    additionalProperties?: boolean;
    [key: string]: unknown;
}

const passthroughOptions = [
    "default",
    "description",
    "minimum",
    "maximum",
    "exclusiveMinimum",
    "exclusiveMaximum",
    "minLength",
    "maxLength",
    "pattern",
    "format",
    "multipleOf",
] as const;

function optionsOf(schema: LegacyTypeBoxSchema): Record<string, unknown> {
    const options: Record<string, unknown> = {};
    for (const key of passthroughOptions) {
        if (schema[key] !== undefined) options[key] = schema[key];
    }
    return options;
}

/**
 * Convert a `drizzle-typebox` (TypeBox 0.34) schema into Elysia v2 `t` schema.
 *
 * Why this exists: `drizzle-typebox@1.0.0-beta` still depends on
 * `@sinclair/typebox` 0.34, while Elysia v2 validates with `typebox@1`. Passing
 * a 0.34 object straight to a route throws `"body" is not a schema` at
 * registration time, so every schema the drizzle helpers produce goes through
 * here first.
 *
 * Mapping notes:
 * - `Date` becomes an ISO `string` with `format: "date-time"` — JSON carries
 *   timestamps as strings, and this keeps the OpenAPI document accurate.
 * - `anyOf` / `oneOf` become `t.Union`, so a pgEnum arrives as a literal union.
 * - `integer`/`number` keep their `minimum` / `maximum` bounds, which is what
 *   makes Elysia coerce numeric query strings correctly.
 * - Objects mark non-`required` properties as `t.Optional`, matching JSON
 *   semantics (drizzle's DB defaults show up as optional insert fields).
 */
/**
 * The values of `anyOf`/`oneOf` when every member is a single constant, which
 * is how pgEnums and TypeBox 0.34 unions of literals arrive.
 */
function literalValues(members: LegacyTypeBoxSchema[]): unknown[] | undefined {
    const values: unknown[] = [];
    for (const member of members) {
        if ("const" in member) {
            values.push(member.const);
            continue;
        }
        if (Array.isArray(member.enum) && member.enum.length === 1) {
            values.push(member.enum[0]);
            continue;
        }
        return undefined;
    }
    return values.length > 0 ? values : undefined;
}

/**
 * `t.UnionEnum`, not `t.Union([t.Literal(…), …])`.
 *
 * `t.Union` of literals in a **response** schema crashes every AOT bundle in
 * `elysia@2.0.0-rc.0` (the union changes Elysia's module emission order and the
 * bundle dies at startup with `The superclass is not a constructor` —
 * elysiajs/elysia#2024). `t.UnionEnum` validates the same value set and is
 * AOT-safe. Unions wider than a constant set still fall back to `t.Union`.
 */
function enumSchema(values: readonly unknown[]): any {
    if (values.length === 0) return t.Never();
    return t.UnionEnum(values as unknown as [never, ...never[]]);
}

export function toElysiaSchema(schema: LegacyTypeBoxSchema): any {
    if (!schema || typeof schema !== "object") return t.Any();

    if (Array.isArray(schema.anyOf) || Array.isArray(schema.oneOf)) {
        const members = (schema.anyOf ?? schema.oneOf)!;
        const values = literalValues(members);
        if (values) return enumSchema(values);
        return t.Union(members.map((member) => toElysiaSchema(member)));
    }
    if (Array.isArray(schema.enum)) return enumSchema(schema.enum);
    if ("const" in schema)
        return schema.const === null
            ? t.Null()
            : t.Literal(schema.const as string | number | boolean);

    const options = optionsOf(schema);

    switch (schema.type) {
        case "object": {
            const required = new Set(schema.required ?? []);
            const properties: Record<string, any> = {};
            for (const [key, value] of Object.entries(
                schema.properties ?? {},
            )) {
                const converted = toElysiaSchema(value);
                properties[key] = required.has(key)
                    ? converted
                    : t.Optional(converted);
            }
            if (schema.additionalProperties === false)
                options.additionalProperties = false;
            return t.Object(properties, options);
        }
        case "array":
            return t.Array(
                schema.items ? toElysiaSchema(schema.items) : t.Unknown(),
                options,
            );
        case "string":
            return t.String(options);
        case "integer":
            return t.Integer(options);
        case "number":
            return t.Number(options);
        case "boolean":
            return t.Boolean(options);
        case "null":
            return t.Null();
        case "Date":
            return t.String({ ...options, format: "date-time" });
        default:
            return t.Any(options);
    }
}
