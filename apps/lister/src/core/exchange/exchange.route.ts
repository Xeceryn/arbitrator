import { Elysia, t } from "elysia";

import { messageSchema } from "../../common/http.schema";
import { publishMetadataChanged } from "../../events";
import { Market } from "../market/market";
import { exchangeWithCryptocurrenciesSchema } from "../market/market.schema";
import { Exchange } from "./exchange";
import {
    exchangeInsertSchema,
    exchangeSelectSchema,
    exchangeUpdateSchema,
    listExchangeSelectSchema,
    paginatedExchangeSelectSchema,
} from "./exchange.schema";

const exchangeIdParams = t.Object({ id: t.Numeric() });

const exchangeNotFound = { message: "exchange not found" };

export const exchangeRoutes = new Elysia({
    name: "exchange",
    prefix: "/exchange",
    tags: ["exchange"],
})
    .get(
        "",
        {
            query: listExchangeSelectSchema,
            response: { 200: paginatedExchangeSelectSchema },
            detail: { summary: "List exchanges" },
        },
        async ({ query }) => await Exchange.list(query),
    )
    .post(
        "",
        {
            body: exchangeInsertSchema,
            response: {
                200: exchangeSelectSchema,
                409: messageSchema,
                500: messageSchema,
            },
            detail: { summary: "Add an exchange" },
        },
        async ({ body, set }) => {
            if (await Exchange.cmcIdExists(body.cmcId)) {
                set.status = 409;
                return { message: "exchange with this cmcId already exists" };
            }

            const result = await Exchange.add(body);
            if (!result) {
                set.status = 500;
                return { message: "something wrong when adding exchange" };
            }

            void publishMetadataChanged({
                entity: "exchange",
                action: "created",
                exchangeIds: [result.id],
            });

            return result;
        },
    )
    /**
     * Exchange detail with its assigned cryptocurrencies, each carrying the
     * market metadata (`tradeEnabled`, `exchangeSymbol`).
     */
    .get(
        "/:id/cryptocurrencies",
        {
            params: exchangeIdParams,
            response: {
                200: exchangeWithCryptocurrenciesSchema,
                404: messageSchema,
            },
            detail: { summary: "Exchange with its cryptocurrencies" },
        },
        async ({ params, set }) => {
            const target = await Exchange.getById(params.id);
            if (!target) {
                set.status = 404;
                return exchangeNotFound;
            }

            const markets = await Market.getAllWithRelations({
                exchangeId: params.id,
            });

            return {
                ...target,
                cryptocurrencies: markets.map((market) => ({
                    ...market.cryptocurrency,
                    marketId: market.id,
                    tradeEnabled: market.tradeEnabled,
                    exchangeSymbol: market.exchangeSymbol,
                })),
            };
        },
    )
    .get(
        "/:id",
        {
            params: exchangeIdParams,
            response: { 200: exchangeSelectSchema, 404: messageSchema },
            detail: { summary: "Find an exchange by id" },
        },
        async ({ params, set }) => {
            const result = await Exchange.getById(params.id);
            if (!result) {
                set.status = 404;
                return exchangeNotFound;
            }

            return result;
        },
    )
    .patch(
        "/:id",
        {
            params: exchangeIdParams,
            body: exchangeUpdateSchema,
            response: {
                200: exchangeSelectSchema,
                404: messageSchema,
                409: messageSchema,
            },
            detail: { summary: "Update an exchange" },
        },
        async ({ params, body, set }) => {
            const target = await Exchange.getById(params.id);
            if (!target) {
                set.status = 404;
                return exchangeNotFound;
            }

            if (body.cmcId) {
                const byCmcId = await Exchange.getByCmcId(body.cmcId);
                if (byCmcId && byCmcId.id !== params.id) {
                    set.status = 409;
                    return { message: "cmcId is already in use" };
                }
            }

            const data = await Exchange.update(params.id, body);
            if (!data) {
                set.status = 404;
                return exchangeNotFound;
            }

            void publishMetadataChanged({
                entity: "exchange",
                action: "updated",
                exchangeIds: [data.id],
            });

            return data;
        },
    )
    .delete(
        "/:id",
        {
            params: exchangeIdParams,
            response: { 200: exchangeSelectSchema, 404: messageSchema },
            detail: { summary: "Remove an exchange" },
        },
        async ({ params, set }) => {
            const result = await Exchange.remove(params.id);
            if (!result) {
                set.status = 404;
                return exchangeNotFound;
            }

            void publishMetadataChanged({
                entity: "exchange",
                action: "deleted",
                exchangeIds: [result.id],
            });

            return result;
        },
    );
