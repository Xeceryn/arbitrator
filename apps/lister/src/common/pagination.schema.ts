import { t } from "elysia";
import type { Static } from "typebox";

import { literalUnion, typedSchema, type TypedSchema } from "./typebox";

/**
 * Shared query shape of every `list*` endpoint.
 *
 * Elysia coerces numeric query strings into `t.Integer` automatically, so the
 * schema declares plain integers — no `z.coerce` equivalent is needed. Bounds
 * (`limit` ∈ -1 ∪ 1…100) double as the OpenAPI contract.
 */
export interface PaginationInput {
    page: number;
    limit: number;
    search: string;
    searchBy: string;
    orderBy: string;
    order: "asc" | "desc";
}

/**
 * What a caller may send: every field is optional because Elysia fills the
 * schema defaults in. TypeBox's `default` is an annotation only — unlike zod's
 * `.default()` it does not make the *input* optional — so the wrap is what lets
 * Eden clients pass `{ query: { limit: -1 } }` alone.
 */
export type PaginationInputQuery = Partial<PaginationInput>;

/**
 * `limit` is -1 (everything) or 1…100. TypeBox cannot express "any integer in
 * the range except 0" as a validator (a union would lose query coercion), so
 * routes check it with `isPaginationLimitValid` — same rule the old zod
 * `.refine()` enforced.
 */
export const paginationLimitMessage =
    "limit must be -1 (all) or between 1 and 100";

export function isPaginationLimitValid(limit: number | undefined): boolean {
    // `undefined` means the client omitted it; Elysia has already substituted
    // the schema default, so only an explicit out-of-range value is invalid.
    return limit === undefined || limit === -1 || (limit >= 1 && limit <= 100);
}

export function createPaginationInputSchema(filter: {
    searchByKeys: readonly string[];
    orderByKeys: readonly string[];
    defaultSearchBy: string;
    defaultOrderBy: string;
}): TypedSchema<PaginationInputQuery> {
    return typedSchema<PaginationInputQuery>(
        t.Object({
            page: t.Optional(t.Integer({ minimum: 1, default: 1 })),
            limit: t.Optional(
                t.Integer({
                    minimum: -1,
                    maximum: 100,
                    default: 10,
                    description: paginationLimitMessage,
                }),
            ),
            search: t.Optional(t.String({ default: "" })),
            searchBy: t.Optional(
                literalUnion(filter.searchByKeys, {
                    default: filter.defaultSearchBy,
                }),
            ),
            orderBy: t.Optional(
                literalUnion(filter.orderByKeys, {
                    default: filter.defaultOrderBy,
                }),
            ),
            order: t.Optional(
                t.UnionEnum(["asc", "desc"], {
                    default: "asc",
                }),
            ),
        }),
    );
}

interface PaginationMetadataShape {
    items: number;
    pages: number;
    page: number;
    limit: number;
    from: number;
    to: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    search: string;
    searchBy: string;
    order: string;
    orderBy: string;
}

/**
 * Output-only pagination metadata (`data`/`meta` envelope of list endpoints).
 *
 * Plain integers, never coercing: Elysia types a response schema from its input
 * side, so a coercing member would surface `meta.items: unknown` to every Eden
 * client.
 */
export const paginationMetadataSchema = typedSchema<PaginationMetadataShape>(
    t.Object({
        items: t.Integer(),
        pages: t.Integer(),
        page: t.Integer(),
        limit: t.Integer(),
        from: t.Integer(),
        to: t.Integer(),
        hasNextPage: t.Boolean(),
        hasPreviousPage: t.Boolean(),
        search: t.String(),
        searchBy: t.String(),
        order: t.String(),
        orderBy: t.String(),
    }),
);

export type PaginationMetadata = Static<typeof paginationMetadataSchema>;

export function createPaginatedOutputSchema<T>(itemSchema: TypedSchema<T>) {
    return typedSchema<{ data: T[]; meta: PaginationMetadata }>(
        t.Object({
            data: t.Array(itemSchema),
            meta: paginationMetadataSchema,
        }),
    );
}
