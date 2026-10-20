import { and, eq, notExists } from "drizzle-orm";
import { Elysia, t } from "elysia";
import z from "zod";

import { messageSchema } from "../../common/http.schema";
import { database } from "../../database/connection";
import { publishMetadataChanged } from "../../events";
import { Cryptocurrency } from "../cryptocurrency/cryptocurrency";
import { Exchange } from "../exchange/exchange";
import {
    listExchangeSelectSchema,
    paginatedExchangeSelectSchema,
} from "../exchange/exchange.schema";
import { exchange } from "../exchange/exchange.sql";
import { Market } from "./market";
import {
    listTransferableCoinsInputSchema,
    marketAssignSchema,
    marketSelectSchema,
    marketUpdatePayloadSchema,
    marketWithRelationsSchema,
    transferableCoinsSchema,
} from "./market.schema";
import { market } from "./market.sql";

const marketIdParams = t.Object({ id: t.Numeric() });

const marketFilterSchema = z
    .object({
        exchangeId: z.coerce.number().optional(),
        cryptocurrencyId: z.coerce.number().optional(),
    })
    .optional();

const assignmentNotFound = {
    message: "exchange-cryptocurrency assignment not found",
};

export const marketRoutes = new Elysia({
    name: "market",
    prefix: "/market",
    tags: ["market"],
})
    .get(
        "",
        {
            query: marketFilterSchema,
            response: { 200: z.array(marketSelectSchema) },
            detail: { summary: "List exchange-cryptocurrency assignments" },
        },
        async ({ query }) => await Market.getAll(query),
    )
    /**
     * Assignment read-model: markets with their exchange and cryptocurrency
     * embedded. Filter by either side (exchange detail or coin sidebar).
     */
    .get(
        "/detailed",
        {
            query: marketFilterSchema,
            response: { 200: z.array(marketWithRelationsSchema) },
            detail: { summary: "List assignments with exchange and coin" },
        },
        async ({ query }) => await Market.getAllWithRelations(query),
    )
    /** Exchanges that are not yet assigned to the given coin. */
    .get(
        "/available-exchanges",
        {
            query: listExchangeSelectSchema.extend({
                cryptocurrencyId: z.coerce.number(),
            }),
            response: { 200: paginatedExchangeSelectSchema },
            detail: { summary: "Exchanges not yet assigned to a coin" },
        },
        async ({ query }) => {
            const { cryptocurrencyId, ...pagination } = query;

            return await Exchange.listExcluding(
                pagination,
                notExists(
                    database
                        .select({ id: market.id })
                        .from(market)
                        .where(
                            and(
                                eq(market.exchangeId, exchange.id),
                                eq(market.cryptocurrencyId, cryptocurrencyId),
                            ),
                        ),
                ),
            );
        },
    )
    /**
     * Directed transferability read-model for the sender orchestrator: the union
     * of per-exchange coin subscriptions for the requested started exchanges.
     */
    .post(
        "/transferable-coins",
        {
            body: listTransferableCoinsInputSchema,
            response: { 200: transferableCoinsSchema },
            detail: { summary: "Transferable coins for started exchanges" },
        },
        async ({ body }) =>
            await Market.listTransferableCoins(body.exchangeIds),
    )
    .post(
        "/assign",
        {
            body: marketAssignSchema,
            response: {
                200: marketSelectSchema,
                404: messageSchema,
                409: messageSchema,
                500: messageSchema,
            },
            detail: { summary: "Assign a coin to an exchange" },
        },
        async ({ body, set }) => {
            if (await Market.exists(body)) {
                set.status = 409;
                return {
                    message: "exchange with cryptocurrency already exists",
                };
            }

            const cryptocurrency = await Cryptocurrency.getById(
                body.cryptocurrencyId,
            );
            if (!cryptocurrency) {
                set.status = 404;
                return { message: "cryptocurrency not found" };
            }

            const result = await database
                .insert(market)
                .values({
                    exchangeId: body.exchangeId,
                    cryptocurrencyId: body.cryptocurrencyId,
                    tradeEnabled: body.tradeEnabled,
                    exchangeSymbol:
                        body.exchangeSymbol ??
                        cryptocurrency.symbol.toUpperCase(),
                })
                .returning()
                .onConflictDoNothing()
                .then((result) => result.at(0));

            if (!result) {
                set.status = 500;
                return {
                    message:
                        "something wrong when assigning exchange-cryptocurrency",
                };
            }

            void publishMetadataChanged({
                entity: "market",
                action: "created",
                exchangeIds: [result.exchangeId],
                cryptocurrencyIds: [result.cryptocurrencyId],
                marketIds: [result.id],
            });

            return result;
        },
    )
    .post(
        "/unassign",
        {
            body: marketSelectSchema.pick({
                exchangeId: true,
                cryptocurrencyId: true,
            }),
            response: { 200: marketSelectSchema, 404: messageSchema },
            detail: { summary: "Unassign a coin from an exchange" },
        },
        async ({ body, set }) => {
            const result = await database
                .delete(market)
                .where(
                    and(
                        eq(market.exchangeId, body.exchangeId),
                        eq(market.cryptocurrencyId, body.cryptocurrencyId),
                    ),
                )
                .returning()
                .then((result) => result.at(0));

            if (!result) {
                set.status = 404;
                return assignmentNotFound;
            }

            void publishMetadataChanged({
                entity: "market",
                action: "deleted",
                exchangeIds: [result.exchangeId],
                cryptocurrencyIds: [result.cryptocurrencyId],
                marketIds: [result.id],
            });

            return result;
        },
    )
    /** Update an assignment, keyed by the (exchange, coin) pair. */
    .patch(
        "",
        {
            body: marketUpdatePayloadSchema,
            response: {
                200: marketSelectSchema,
                404: messageSchema,
                500: messageSchema,
            },
            detail: { summary: "Update an assignment" },
        },
        async ({ body, set }) => {
            if (!(await Market.exists(body))) {
                set.status = 404;
                return assignmentNotFound;
            }

            const result = await Market.update(body, body);
            if (!result) {
                set.status = 500;
                return {
                    message:
                        "something wrong when updating exchange-cryptocurrency",
                };
            }

            void publishMetadataChanged({
                entity: "market",
                action: "updated",
                exchangeIds: [result.exchangeId],
                cryptocurrencyIds: [result.cryptocurrencyId],
                marketIds: [result.id],
            });

            return result;
        },
    )
    .get(
        "/:id",
        {
            params: marketIdParams,
            response: { 200: marketSelectSchema, 404: messageSchema },
            detail: { summary: "Find an assignment by id" },
        },
        async ({ params, set }) => {
            const result = await Market.getById(params.id);
            if (!result) {
                set.status = 404;
                return assignmentNotFound;
            }

            return result;
        },
    );
