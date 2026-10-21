import { Elysia, status, t } from "elysia";

import { messageSchema } from "../../common/http.schema";
import {
    isPaginationLimitValid,
    paginationLimitMessage,
} from "../../common/pagination.schema";
import { eventsPlugin } from "../../plugins/events";
import { Chain } from "./chain";
import {
    chainInsertSchema,
    chainSelectSchema,
    chainUpdateSchema,
    listChainSelectSchema,
    paginatedChainSelectSChema,
} from "./chain.schema";

const chainIdParams = t.Object({ id: t.Numeric() });

const chainNotFound = { message: "chain not found" };

export const chainRoutes = new Elysia({
    name: "chain",
    prefix: "/chain",
    tags: ["chain"],
})
    .use(eventsPlugin)
    .get(
        "",
        {
            query: listChainSelectSchema,
            response: { 200: paginatedChainSelectSChema },
            detail: { summary: "List chains" },
        },
        async ({ query }) => {
            if (!isPaginationLimitValid(query.limit)) {
                throw status(422, { message: paginationLimitMessage });
            }

            return await Chain.list(query);
        },
    )
    .post(
        "",
        {
            body: chainInsertSchema,
            response: {
                200: chainSelectSchema,
                409: messageSchema,
                500: messageSchema,
            },
            detail: { summary: "Add a chain" },
        },
        async ({ body, events, set }) => {
            if (await Chain.codeExists(body.code)) {
                set.status = 409;
                return { message: "chain with this code already exists" };
            }

            const result = await Chain.add(body);
            if (!result) {
                set.status = 500;
                return { message: "something wrong when adding chain" };
            }

            void events.publishMetadataChanged({
                entity: "chain",
                action: "created",
                chainIds: [result.id],
            });

            return result;
        },
    )
    .get(
        "/:id",
        {
            params: chainIdParams,
            response: { 200: chainSelectSchema, 404: messageSchema },
            detail: { summary: "Find a chain by id" },
        },
        async ({ params, set }) => {
            const result = await Chain.getById(params.id);
            if (!result) {
                set.status = 404;
                return chainNotFound;
            }

            return result;
        },
    )
    .patch(
        "/:id",
        {
            params: chainIdParams,
            body: chainUpdateSchema,
            response: {
                200: chainSelectSchema,
                404: messageSchema,
                409: messageSchema,
            },
            detail: { summary: "Update a chain" },
        },
        async ({ params, body, events, set }) => {
            const target = await Chain.getById(params.id);
            if (!target) {
                set.status = 404;
                return chainNotFound;
            }

            if (body.code) {
                const byCode = await Chain.getByCode(body.code);
                if (byCode && byCode.id !== params.id) {
                    set.status = 409;
                    return { message: "code is already in use" };
                }
            }

            const result = await Chain.update(params.id, body);
            if (!result) {
                set.status = 404;
                return chainNotFound;
            }

            void events.publishMetadataChanged({
                entity: "chain",
                action: "updated",
                chainIds: [result.id],
            });

            return result;
        },
    )
    .delete(
        "/:id",
        {
            params: chainIdParams,
            response: { 200: chainSelectSchema, 404: messageSchema },
            detail: { summary: "Remove a chain" },
        },
        async ({ params, events, set }) => {
            const result = await Chain.remove(params.id);
            if (!result) {
                set.status = 404;
                return chainNotFound;
            }

            void events.publishMetadataChanged({
                entity: "chain",
                action: "deleted",
                chainIds: [result.id],
            });

            return result;
        },
    );
