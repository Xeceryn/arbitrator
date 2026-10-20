import { z } from "zod";

/**
 * zod → OpenAPI JSON Schema mapper for `@elysia/openapi`
 * (`openapi({ mapJsonSchema: openapiZodMap })`).
 *
 * zod has no JSON Schema representation for `z.date()`, and Elysia's OpenAPI
 * plugin **silently drops the whole response document** when it meets one.
 * That matters here because every drizzle-zod select schema carries
 * `createdAt` / `updatedAt`. Dates are mapped to date-time strings, and
 * anything else unrepresentable degrades to a loose schema instead of
 * deleting the response.
 */
export function zodToJsonSchema(schema: z.ZodType): Record<string, unknown> {
    return z.toJSONSchema(schema, {
        unrepresentable: "any",
        override: (context) => {
            if (context.zodSchema instanceof z.ZodDate) {
                context.jsonSchema.type = "string";
                context.jsonSchema.format = "date-time";
            }
        },
    });
}

/** Ready-to-spread `mapJsonSchema` option: `openapi({ mapJsonSchema: openapiZodMap })`. */
export const openapiZodMap = { zod: zodToJsonSchema };
