import { ORPCError, os } from "@orpc/server";
import z from "zod";

import { publishMetadataChanged } from "../../events";
import { Cryptocurrency } from "./cryptocurrency";
import {
    cryptocurrencyInsertSchema,
    cryptocurrencySelectSchema,
    cryptocurrencyUpdateSchema,
    listCryptocurrencySelectSchema,
    paginatedCryptocurrencySelectSchema,
    cryptocurrencyRoutesSchema,
} from "./cryptocurrency.schema";

export const cryptocurrencyRouter = {
    add: os
        .input(cryptocurrencyInsertSchema)
        .output(cryptocurrencySelectSchema)
        .handler(async ({ input }) => {
            if (await Cryptocurrency.cmcIdExists(input.cmcId)) {
                throw new ORPCError("CONFLICT", {
                    message: "cryptocurrency with this cmcId already exists",
                });
            }
            const result = await Cryptocurrency.add(input);
            if (!result) {
                throw new ORPCError("INTERNAL_SERVER_ERROR", {
                    message: "something wrong when adding cryptocurrency",
                });
            }

            void publishMetadataChanged({
                entity: "cryptocurrency",
                action: "created",
                cryptocurrencyIds: [result.id],
            });

            return result;
        }),

    list: os
        .input(listCryptocurrencySelectSchema)
        .output(paginatedCryptocurrencySelectSchema)
        .handler(async ({ input }) => {
            const result = await Cryptocurrency.list(input);
            return result;
        }),

    /** Transfer routes between the coin's exchanges, as a matrix read-model. */
    routes: os
        .input(z.coerce.number())
        .output(cryptocurrencyRoutesSchema)
        .handler(async ({ input }) => {
            return await Cryptocurrency.listRoutes(input);
        }),

    findById: os
        .input(z.coerce.number())
        .output(cryptocurrencySelectSchema)
        .handler(async ({ input }) => {
            const result = await Cryptocurrency.getById(input);
            if (!result) {
                throw new ORPCError("NOT_FOUND", {
                    message: "cryptocurrency not found",
                });
            }

            return result;
        }),

    update: os
        .input(
            z.object({
                id: z.coerce.number(),
                payload: cryptocurrencyUpdateSchema,
            }),
        )
        .output(cryptocurrencySelectSchema)
        .handler(async ({ input }) => {
            const target = await Cryptocurrency.getById(input.id);
            if (!target) {
                throw new ORPCError("NOT_FOUND", {
                    message: "cryptocurrency not found",
                });
            }
            if (input?.payload?.cmcId) {
                const byCmcId = await Cryptocurrency.getByCmcId(
                    input.payload.cmcId,
                );
                if (byCmcId && byCmcId.id !== input.id) {
                    throw new ORPCError("CONFLICT", {
                        message: "cmcId is already in use",
                    });
                }
            }

            const result = await Cryptocurrency.update(input.id, input.payload);
            if (!result) {
                throw new ORPCError("NOT_FOUND", {
                    message: "cryptocurrency not found",
                });
            }

            void publishMetadataChanged({
                entity: "cryptocurrency",
                action: "updated",
                cryptocurrencyIds: [result.id],
            });

            return result;
        }),

    remove: os
        .input(z.number())
        .output(cryptocurrencySelectSchema)
        .handler(async ({ input }) => {
            const result = await Cryptocurrency.remove(input);
            if (!result) {
                throw new ORPCError("NOT_FOUND", {
                    message: "cryptocurrency not found",
                });
            }

            void publishMetadataChanged({
                entity: "cryptocurrency",
                action: "deleted",
                cryptocurrencyIds: [result.id],
            });

            return result;
        }),
};
