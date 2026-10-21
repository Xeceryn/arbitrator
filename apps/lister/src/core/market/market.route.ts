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
import { Cryptocurrency } from "../cryptocurrency/cryptocurrency";
import { Exchange } from "../exchange/exchange";
import {
    listExchangeSelectSchema,
    paginatedExchangeSelectSchema,
} from "../exchange/exchange.schema";
import { exchange } from "../exchange/exchange.sql";
import type { ListExchangeInput } from "../exchange/exchange.type";
import { Market } from "./market";
import {
    listTransferableCoinsInputSchema,
    marketAssignSchema,
    marketFilterExistsSchema,
    marketSelectSchema,
    marketUpdatePayloadSchema,
    marketWithRelationsSchema,
    transferableCoinsSchema,
} from "./market.schema";
import { market } from "./market.sql";

const marketIdParams = t.Object({ id: t.Numeric() });

const marketFilterSchema = t.Object({
    exchangeId: t.Optional(t.Integer()),
    cryptocurrencyId: t.Optional(t.Integer()),
});

/** Exchange pagination plus the coin whose unassigned exchanges we want. */
const availableExchangeQuerySchema = extendSchema<
    ListExchangeInput & { cryptocurrencyId: number }
>(listExchangeSelectSchema, { cryptocurrencyId: t.Integer() });

const assignmentNotFound = {
    message: "exchange-cryptocurrency assignment not found",
};

export const marketRoutes = new Elysia({
    name: "market",
    prefix: "/market",
    tags: ["market"],
})
    .use(databasePlugin)
    .use(eventsPlugin)
    .get(
        "",
        {
            query: marketFilterSchema,
            response: { 200: t.Array(marketSelectSchema) },
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
            response: { 200: t.Array(marketWithRelationsSchema) },
            detail: { summary: "List assignments with exchange and coin" },
        },
        async ({ query }) => await Market.getAllWithRelations(query),
    )
    /** Exchanges that are not yet assigned to the given coin. */
    .get(
        "/available-exchanges",
        {
            query: availableExchangeQuerySchema,
            response: { 200: paginatedExchangeSelectSchema },
            detail: { summary: "Exchanges not yet assigned to a coin" },
        },
        async ({ db, query }) => {
            const { cryptocurrencyId, ...pagination } = query;

            if (!isPaginationLimitValid(pagination.limit)) {
                throw status(422, { message: paginationLimitMessage });
            }

            return await Exchange.listExcluding(
                pagination,
                notExists(
                    db
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
        async ({ body, db, events, set }) => {
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

            const result = await db
                .insert(market)
                .values({
                    exchangeId: body.exchangeId,
                    cryptocurrencyId: body.cryptocurrencyId,
                    tradeEnabled: body.tradeEnabled ?? true,
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

            void events.publishMetadataChanged({
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
            body: marketFilterExistsSchema,
            response: { 200: marketSelectSchema, 404: messageSchema },
            detail: { summary: "Unassign a coin from an exchange" },
        },
        async ({ body, db, events, set }) => {
            const result = await db
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

            void events.publishMetadataChanged({
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
        async ({ body, events, set }) => {
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

            void events.publishMetadataChanged({
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
