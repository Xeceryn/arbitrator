import {
    and,
    count,
    eq,
    getTableColumns,
    ilike,
    type AnyColumn,
    type InferSelectModel,
    type SQL,
    type Table,
} from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";

import { SortOrder } from "../core/utility/sqlsort";
import { database } from "../database/connection";
import type { PaginationMetadata } from "./pagination.schema";

/** Structural shape shared by every generated `list*` input schema. */
export type PaginationQuery = {
    page: number;
    limit: number;
    search: string;
    searchBy: string;
    order: "asc" | "desc";
    orderBy: string;
};

/**
 * Every pagination query field is optional on the wire: Elysia fills the
 * schema defaults in before the handler runs, so `paginate` can treat this as a
 * `PaginationQuery` once `withPaginationDefaults` has run.
 */
export type PaginationInput = Partial<PaginationQuery>;

export function withPaginationDefaults(
    input: PaginationInput,
    defaults?: Partial<PaginationQuery>,
): PaginationQuery {
    return {
        page: input.page ?? defaults?.page ?? 1,
        limit: input.limit ?? defaults?.limit ?? 10,
        search: input.search ?? defaults?.search ?? "",
        searchBy: input.searchBy ?? defaults?.searchBy ?? "id",
        orderBy: input.orderBy ?? defaults?.orderBy ?? "id",
        order: input.order ?? defaults?.order ?? "asc",
    };
}

export type PaginatedResult<T> = {
    data: T[];
    meta: PaginationMetadata;
};

/** Resolve a column by name from a Drizzle table, independent of the table type. */
function columnOf(table: Table, key: string): AnyColumn {
    const columns = getTableColumns(table) as unknown as Record<
        string,
        AnyColumn | undefined
    >;
    const column = columns[key];

    if (!column) {
        throw new Error(`Unknown column "${key}"`);
    }

    return column;
}

/**
 * Default search strategy, derived from the column's runtime type:
 * numbers match exactly, booleans parse the term, everything else uses ILIKE.
 * Pass `condition` to `paginate` when a module needs custom search behaviour.
 */
export function defaultSearchCondition(
    table: Table,
    searchBy: string,
    search: string,
): SQL | undefined {
    if (!search) {
        return undefined;
    }

    const column = columnOf(table, searchBy);

    switch (column.dataType) {
        case "number":
            return eq(column, Number(search));
        case "boolean":
            return eq(column, ["true", "1"].includes(search.toLowerCase()));
        default:
            return ilike(column, `%${search.toLowerCase()}%`);
    }
}

export async function paginate<TTable extends PgTable>(options: {
    table: TTable;
    input: PaginationInput;
    /** Extra condition ANDed with the default search condition. */
    condition?: SQL;
}): Promise<PaginatedResult<InferSelectModel<TTable>>> {
    const { table } = options;
    const input = withPaginationDefaults(options.input);
    const searchCondition = defaultSearchCondition(
        table,
        input.searchBy,
        input.search,
    );
    const where = and(options.condition, searchCondition);

    // Drizzle's `.from()` uses a conditional type that cannot be resolved for a
    // generic table, so narrow to the concrete base type for the query only.
    const source = table as PgTable;

    const items = await database
        .select({ count: count() })
        .from(source)
        .where(where)
        .then((result) => result.at(0)?.count ?? 0);

    const isAll = input.limit === -1;
    const limit = isAll ? items : input.limit;
    const offset = isAll ? 0 : (input.page - 1) * input.limit;
    const pages = isAll ? 1 : Math.ceil(items / input.limit);

    const orderBy = columnOf(table, input.orderBy);
    const data = (await database
        .select()
        .from(source)
        .where(where)
        .orderBy(SortOrder(input.order, orderBy))
        .limit(limit)
        .offset(offset)) as InferSelectModel<TTable>[];

    return {
        data,
        meta: {
            items,
            pages,
            page: input.page,
            limit: input.limit,
            from: items === 0 ? 0 : offset + 1,
            to: isAll ? items : Math.min(offset + input.limit, items),
            hasNextPage: input.page < pages,
            hasPreviousPage: input.page > 1,
            search: input.search,
            searchBy: input.searchBy,
            order: input.order,
            orderBy: input.orderBy,
        },
    };
}
