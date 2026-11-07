import { describe, expect, test } from "bun:test";

import { PgDialect } from "drizzle-orm/pg-core";

import { cryptocurrency } from "../core/cryptocurrency/cryptocurrency.sql";
import { exchange } from "../core/exchange/exchange.sql";
import { defaultSearchCondition } from "./pagination";

/**
 * Drizzle reports numeric columns as `"number int32"` and enum columns as
 * `"string enum"`, and Postgres has no ILIKE operator for either, so the
 * search condition has to cast them to text. This regressed once: a numeric
 * `searchBy` (`id`, `cmcId`) produced `integer ILIKE $1` and every such search
 * failed with a 500.
 */
const dialect = new PgDialect();

function query(
    table: Parameters<typeof defaultSearchCondition>[0],
    searchBy: string,
    search: string,
) {
    const condition = defaultSearchCondition(table, searchBy, search);
    return condition ? dialect.sqlToQuery(condition) : undefined;
}

describe("defaultSearchCondition", () => {
    test("no term means no condition", () => {
        expect(query(cryptocurrency, "cmcId", "")).toBeUndefined();
    });

    test("numeric columns are matched on their text form", () => {
        const result = query(cryptocurrency, "cmcId", "102")!;
        expect(result.sql).toContain('cast("cryptocurrency"."cmcId" as text)');
        expect(result.sql).toContain("ilike");
        // Partial ids are the point: "102" must find 1027.
        expect(result.params).toEqual(["%102%"]);
    });

    test("a non-numeric term stays a parameter instead of NaN", () => {
        const result = query(cryptocurrency, "id", "abc")!;
        expect(result.params).toEqual(["%abc%"]);
    });

    test("enum columns are matched on their text form", () => {
        const result = query(exchange, "baseCurrency", "USDT")!;
        expect(result.sql).toContain('cast("exchange"."baseCurrency" as text)');
        expect(result.params).toEqual(["%usdt%"]);
    });

    test("text columns keep a plain case-insensitive match", () => {
        const result = query(cryptocurrency, "symbol", "BTC")!;
        expect(result.sql).not.toContain("cast(");
        expect(result.sql).toContain("ilike");
        expect(result.params).toEqual(["%btc%"]);
    });

    test("booleans parse the term", () => {
        expect(query(exchange, "registeredOnCmc", "true")!.params).toEqual([
            true,
        ]);
        expect(query(exchange, "registeredOnCmc", "1")!.params).toEqual([true]);
        expect(query(exchange, "registeredOnCmc", "no")!.params).toEqual([
            false,
        ]);
    });
});
