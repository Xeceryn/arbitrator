import { and, eq, notExists } from "drizzle-orm";
import { Elysia, t } from "elysia";
import z from "zod";

import { messageSchema } from "../../common/http.schema";
import { database } from "../../database/connection";
import { publishMetadataChanged } from "../../events";
import { Chain } from "../chain/chain";
import {
    listChainSelectSchema,
    paginatedChainSelectSChema,
} from "../chain/chain.schema";
import { chain } from "../chain/chain.sql";
import { ChainLink } from "./chain-link";
import {
    chainLinkInsertSchema,
    chainLinkSelectSchema,
    chainLinkUpdateSchema,
    chainLinkWithChainSchema,
} from "./chain-link.schema";
import { chainLink } from "./chain-link.sql";

const chainLinkIdParams = t.Object({ id: t.Numeric() });

const chainLinkFilterSchema = z
    .object({
        marketId: z.coerce.number().optional(),
        chainId: z.coerce.number().optional(),
    })
    .optional();

const chainLinkNotFound = {
    message: "exchange-cryptocurrency-chain not found",
};

export const chainLinkRoutes = new Elysia({
    name: "chain-link",
    prefix: "/chain-link",
    tags: ["chain-link"],
})
    .get(
        "",
        {
            query: chainLinkFilterSchema,
            response: { 200: z.array(chainLinkSelectSchema) },
            detail: { summary: "List chain links" },
        },
        async ({ query }) => await ChainLink.getAll(query),
    )
    /** Chain links with their chain embedded, for the market expand panel. */
    .get(
        "/detailed",
        {
            query: chainLinkFilterSchema,
            response: { 200: z.array(chainLinkWithChainSchema) },
            detail: { summary: "List chain links with their chain" },
        },
        async ({ query }) => await ChainLink.getAllWithChain(query),
    )
    /** Chains that are not yet linked to the given market. */
    .get(
        "/available-chains",
        {
            query: listChainSelectSchema.extend({
                marketId: z.coerce.number(),
            }),
            response: { 200: paginatedChainSelectSChema },
            detail: { summary: "Chains not yet linked to a market" },
        },
        async ({ query }) => {
            const { marketId, ...pagination } = query;

            return await Chain.listExcluding(
                pagination,
                notExists(
                    database
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
        async ({ body, set }) => {
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

            void publishMetadataChanged({
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
        async ({ params, body, set }) => {
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

            void publishMetadataChanged({
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
        async ({ params, set }) => {
            const result = await ChainLink.remove(params.id);
            if (!result) {
                set.status = 404;
                return chainLinkNotFound;
            }

            void publishMetadataChanged({
                entity: "chain_link",
                action: "deleted",
                chainIds: [result.chainId],
                marketIds: [result.marketId],
            });

            return result;
        },
    );
