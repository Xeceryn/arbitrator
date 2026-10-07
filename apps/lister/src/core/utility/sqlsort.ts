import { asc, desc, type AnyColumn } from "drizzle-orm";

export function SortOrder<T extends AnyColumn>(
    order: "asc" | "desc",
    orderBy: T,
) {
    return order === "asc" ? asc(orderBy) : desc(orderBy);
}
