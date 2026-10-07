import { count, eq, type SQL } from "drizzle-orm";

import { paginate } from "../../common/pagination";
import { database } from "../../database/connection";
import { exchange } from "./exchange.sql";
import type {
    ExchangeInsert,
    ListExchangeInput,
    PaginatedExchangeList,
} from "./exchange.type";

export namespace Exchange {
    export async function add(input: ExchangeInsert) {
        return await database
            .insert(exchange)
            .values(input)
            .returning()
            .then((result) => result.at(0));
    }

    export async function list(
        input: ListExchangeInput,
    ): Promise<PaginatedExchangeList> {
        return await paginate({ table: exchange, input });
    }

    /** List with a caller-supplied extra filter (e.g. exclude assigned). */
    export async function listExcluding(
        input: ListExchangeInput,
        condition?: SQL,
    ): Promise<PaginatedExchangeList> {
        return await paginate({ table: exchange, input, condition });
    }

    export async function cmcIdExists(cmcId: number) {
        return await database
            .select({ count: count() })
            .from(exchange)
            .where(eq(exchange.cmcId, cmcId))
            .then((result) => !!result.at(0)?.count);
    }

    export async function getById(id: number) {
        return await database
            .select()
            .from(exchange)
            .where(eq(exchange.id, id))
            .then((result) => result.at(0));
    }

    export async function getByCmcId(cmcId: number) {
        return await database
            .select()
            .from(exchange)
            .where(eq(exchange.cmcId, cmcId))
            .then((result) => result.at(0));
    }

    export async function update(
        id: number,
        payload: Partial<typeof exchange.$inferInsert>,
    ) {
        return await database
            .update(exchange)
            .set(payload)
            .where(eq(exchange.id, id))
            .returning()
            .then((result) => result.at(0));
    }

    export async function remove(id: number) {
        return await database
            .delete(exchange)
            .where(eq(exchange.id, id))
            .returning()
            .then((result) => result.at(0));
    }
}
