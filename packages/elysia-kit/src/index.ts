export { toElysiaSchema, type LegacyTypeBoxSchema } from "./typebox";

import { z } from "zod";

/**
 * zod → OpenAPI JSON Schema mapper for `@elysia/openapi`
 * (`openapi({ mapJsonSchema: openapiZodMap })`).
 *
 * Only needed while a service still validates with zod. New routes should use
 * Elysia `t` schemas (`toElysiaSchema` for drizzle tables), which OpenAPI
 * understands natively.
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
