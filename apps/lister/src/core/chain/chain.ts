import { eq, count, type SQL } from "drizzle-orm";

import { paginate } from "../../common/pagination";
import { database } from "../../database/connection";
import { chain } from "./chain.sql";
import type {
    ChainInsert,
    ChainUpdate,
    ListChainInput,
    PaginatedChainList,
} from "./chain.type";

export namespace Chain {
    export async function add(input: ChainInsert) {
        return await database
            .insert(chain)
            .values(input)
            .returning()
            .then((result) => result.at(0));
    }

    export async function list(
        input: ListChainInput,
    ): Promise<PaginatedChainList> {
        const result = await paginate({ table: chain, input });
        return result;
    }

    /** List with a caller-supplied extra filter (e.g. exclude assigned). */
    export async function listExcluding(
        input: ListChainInput,
        condition?: SQL,
    ): Promise<PaginatedChainList> {
        return await paginate({ table: chain, input, condition });
    }

    export async function codeExists(code: string) {
        return await database
            .select({ count: count() })
            .from(chain)
            .where(eq(chain.code, code))
            .then((result) => !!result.at(0)?.count);
    }

    export async function getById(id: number) {
        return await database
            .select()
            .from(chain)
            .where(eq(chain.id, id))
            .then((result) => result.at(0));
    }

    export async function getByCode(code: string) {
        return await database
            .select()
            .from(chain)
            .where(eq(chain.code, code))
            .then((result) => result.at(0));
    }

    export async function update(id: number, input: ChainUpdate) {
        return await database
            .update(chain)
            .set(input)
            .where(eq(chain.id, id))
            .returning()
            .then((result) => result.at(0));
    }

    export async function remove(id: number) {
        return await database
            .delete(chain)
            .where(eq(chain.id, id))
            .returning()
            .then((result) => result.at(0));
    }
}
