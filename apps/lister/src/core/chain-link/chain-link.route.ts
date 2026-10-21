import { and, eq, notExists } from "drizzle-orm";
import { Elysia, status, t } from "elysia";

import { messageSchema } from "../../common/http.schema";
import {
    isPaginationLimitValid,
    paginationLimitMessage,
} from "../../common/pagination.schema";
import { extendSchema } from "../../common/typebox";
import { databasePlugin } from "../../plugins/database";
import { eventsPlugin } from "../../plugins/events";
import { Chain } from "../chain/chain";
import {
    listChainSelectSchema,
    paginatedChainSelectSChema,
} from "../chain/chain.schema";
import { chain } from "../chain/chain.sql";
import type { ListChainInput } from "../chain/chain.type";
import { ChainLink } from "./chain-link";
import {
    chainLinkInsertSchema,
    chainLinkSelectSchema,
    chainLinkUpdateSchema,
    chainLinkWithChainSchema,
} from "./chain-link.schema";
import { chainLink } from "./chain-link.sql";

const chainLinkIdParams = t.Object({ id: t.Numeric() });

const chainLinkFilterSchema = t.Object({
    marketId: t.Optional(t.Integer()),
    chainId: t.Optional(t.Integer()),
});

/** Chain pagination plus the market whose unlinked chains we want. */
const availableChainQuerySchema = extendSchema<
    ListChainInput & { marketId: number }
>(listChainSelectSchema, { marketId: t.Integer() });

const chainLinkNotFound = {
    message: "exchange-cryptocurrency-chain not found",
};

export const chainLinkRoutes = new Elysia({
    name: "chain-link",
    prefix: "/chain-link",
    tags: ["chain-link"],
})
    .use(databasePlugin)
    .use(eventsPlugin)
    .get(
        "",
        {
            query: chainLinkFilterSchema,
            response: { 200: t.Array(chainLinkSelectSchema) },
            detail: { summary: "List chain links" },
        },
        async ({ query }) => await ChainLink.getAll(query),
    )
    /** Chain links with their chain embedded, for the market expand panel. */
    .get(
        "/detailed",
        {
            query: chainLinkFilterSchema,
            response: { 200: t.Array(chainLinkWithChainSchema) },
            detail: { summary: "List chain links with their chain" },
        },
        async ({ query }) => await ChainLink.getAllWithChain(query),
    )
    /** Chains that are not yet linked to the given market. */
    .get(
        "/available-chains",
        {
            query: availableChainQuerySchema,
            response: { 200: paginatedChainSelectSChema },
            detail: { summary: "Chains not yet linked to a market" },
        },
        async ({ db, query }) => {
            const { marketId, ...pagination } = query;

            if (!isPaginationLimitValid(pagination.limit)) {
                throw status(422, { message: paginationLimitMessage });
            }

            return await Chain.listExcluding(
                pagination,
                notExists(
                    db
                        .select({ id: chainLink.id })
                        .from(chainLink)
                        .where(
                            and(
                                eq(chainLink.chainId, chain.id),
                                eq(chainLink.marketId, marketId),
                            ),
                        ),
                ),
            );
        },
    )
    .get(
        "/:id",
        {
            params: chainLinkIdParams,
            response: { 200: chainLinkSelectSchema, 404: messageSchema },
            detail: { summary: "Find a chain link by id" },
        },
        async ({ params, set }) => {
            const result = await ChainLink.getById(params.id);
            if (!result) {
                set.status = 404;
                return chainLinkNotFound;
            }

            return result;
        },
    )
    .post(
        "",
        {
            body: chainLinkInsertSchema,
            response: {
                200: chainLinkSelectSchema,
                409: messageSchema,
                500: messageSchema,
            },
            detail: { summary: "Add a chain link" },
        },
        async ({ body, events, set }) => {
            if (await ChainLink.exists(body)) {
                set.status = 409;
                return {
                    message:
                        "exchange-cryptocurrency-chain assignment already exists",
                };
            }

            const result = await ChainLink.add(body);
            if (!result) {
                set.status = 500;
                return {
                    message:
                        "something wrong when adding exchange-cryptocurrency-chain",
                };
            }

            void events.publishMetadataChanged({
                entity: "chain_link",
                action: "created",
                chainIds: [result.chainId],
                marketIds: [result.marketId],
            });

            return result;
        },
    )
    .patch(
        "/:id",
        {
            params: chainLinkIdParams,
            body: chainLinkUpdateSchema,
            response: {
                200: chainLinkSelectSchema,
                404: messageSchema,
                500: messageSchema,
            },
            detail: { summary: "Update a chain link" },
        },
        async ({ params, body, events, set }) => {
            const target = await ChainLink.getById(params.id);
            if (!target) {
                set.status = 404;
                return chainLinkNotFound;
            }

            const result = await ChainLink.update(params.id, body);
            if (!result) {
                set.status = 500;
                return {
                    message:
                        "something wrong when updating exchange-cryptocurrency-chain",
                };
            }

            void events.publishMetadataChanged({
                entity: "chain_link",
                action: "updated",
                chainIds: [result.chainId],
                marketIds: [result.marketId],
            });

            return result;
        },
    )
    .delete(
        "/:id",
        {
            params: chainLinkIdParams,
            response: { 200: chainLinkSelectSchema, 404: messageSchema },
            detail: { summary: "Remove a chain link" },
        },
        async ({ params, events, set }) => {
            const result = await ChainLink.remove(params.id);
            if (!result) {
                set.status = 404;
                return chainLinkNotFound;
            }

            void events.publishMetadataChanged({
                entity: "chain_link",
                action: "deleted",
                chainIds: [result.chainId],
                marketIds: [result.marketId],
            });

            return result;
        },
    );
