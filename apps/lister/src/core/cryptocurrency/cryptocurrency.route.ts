import { Elysia, status, t } from "elysia";

import { messageSchema } from "../../common/http.schema";
import {
    isPaginationLimitValid,
    paginationLimitMessage,
} from "../../common/pagination.schema";
import { eventsPlugin } from "../../plugins/events";
import { Cryptocurrency } from "./cryptocurrency";
import {
    cryptocurrencyInsertSchema,
    cryptocurrencyRoutesSchema,
    cryptocurrencySelectSchema,
    cryptocurrencyUpdateSchema,
    listCryptocurrencySelectSchema,
    paginatedCryptocurrencySelectSchema,
} from "./cryptocurrency.schema";

const cryptocurrencyIdParams = t.Object({ id: t.Numeric() });

const cryptocurrencyNotFound = { message: "cryptocurrency not found" };

export const cryptocurrencyRoutes = new Elysia({
    name: "cryptocurrency",
    prefix: "/cryptocurrency",
    tags: ["cryptocurrency"],
})
    .use(eventsPlugin)
    .get(
        "",
        {
            query: listCryptocurrencySelectSchema,
            response: { 200: paginatedCryptocurrencySelectSchema },
            detail: { summary: "List cryptocurrencies" },
        },
        async ({ query }) => {
            if (!isPaginationLimitValid(query.limit)) {
                throw status(422, { message: paginationLimitMessage });
            }

            return await Cryptocurrency.list(query);
        },
    )
    .post(
        "",
        {
            body: cryptocurrencyInsertSchema,
            response: {
                200: cryptocurrencySelectSchema,
                409: messageSchema,
                500: messageSchema,
            },
            detail: { summary: "Add a cryptocurrency" },
        },
        async ({ body, events, set }) => {
            if (await Cryptocurrency.cmcIdExists(body.cmcId)) {
                set.status = 409;
                return {
                    message: "cryptocurrency with this cmcId already exists",
                };
            }

            const result = await Cryptocurrency.add(body);
            if (!result) {
                set.status = 500;
                return {
                    message: "something wrong when adding cryptocurrency",
                };
            }

            void events.publishMetadataChanged({
                entity: "cryptocurrency",
                action: "created",
                cryptocurrencyIds: [result.id],
            });

            return result;
        },
    )
    /** Transfer routes between the coin's exchanges, as a matrix read-model. */
    .get(
        "/:id/routes",
        {
            params: cryptocurrencyIdParams,
            response: { 200: cryptocurrencyRoutesSchema },
            detail: { summary: "Transfer routes for a cryptocurrency" },
        },
        async ({ params }) => await Cryptocurrency.listRoutes(params.id),
    )
    .get(
        "/:id",
        {
            params: cryptocurrencyIdParams,
            response: { 200: cryptocurrencySelectSchema, 404: messageSchema },
            detail: { summary: "Find a cryptocurrency by id" },
        },
        async ({ params, set }) => {
            const result = await Cryptocurrency.getById(params.id);
            if (!result) {
                set.status = 404;
                return cryptocurrencyNotFound;
            }

            return result;
        },
    )
    .patch(
        "/:id",
        {
            params: cryptocurrencyIdParams,
            body: cryptocurrencyUpdateSchema,
            response: {
                200: cryptocurrencySelectSchema,
                404: messageSchema,
                409: messageSchema,
            },
            detail: { summary: "Update a cryptocurrency" },
        },
        async ({ params, body, events, set }) => {
            const target = await Cryptocurrency.getById(params.id);
            if (!target) {
                set.status = 404;
                return cryptocurrencyNotFound;
            }

            if (body.cmcId) {
                const byCmcId = await Cryptocurrency.getByCmcId(body.cmcId);
                if (byCmcId && byCmcId.id !== params.id) {
                    set.status = 409;
                    return { message: "cmcId is already in use" };
                }
            }

            const result = await Cryptocurrency.update(params.id, body);
            if (!result) {
                set.status = 404;
                return cryptocurrencyNotFound;
            }

            void events.publishMetadataChanged({
                entity: "cryptocurrency",
                action: "updated",
                cryptocurrencyIds: [result.id],
            });

            return result;
        },
    )
    .delete(
        "/:id",
        {
            params: cryptocurrencyIdParams,
            response: { 200: cryptocurrencySelectSchema, 404: messageSchema },
            detail: { summary: "Remove a cryptocurrency" },
        },
        async ({ params, events, set }) => {
            const result = await Cryptocurrency.remove(params.id);
            if (!result) {
                set.status = 404;
                return cryptocurrencyNotFound;
            }

            void events.publishMetadataChanged({
                entity: "cryptocurrency",
                action: "deleted",
                cryptocurrencyIds: [result.id],
            });

            return result;
        },
    );
