import { ORPCError, os } from "@orpc/server";

import { Cryptocurrency } from "./cryptocurrency";
import {
  cryptocurrencyInsertSchema,
  cryptocurrencySelectSchema,
  cryptocurrencyUpdateSchema,
  paginatedCryptocurrencySelectSchema,
} from "./cryptocurrency.schema";
import { paginationInputSchema } from "../../common/pagination.schema";
import z from "zod";

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

      return result;
    }),

  list: os
    .input(
      z.object({
        ...paginationInputSchema.shape,
        cmcid: z.number().optional(),
        hasExchangeWithId: z.number().optional(),
      }),
    )
    .output(paginatedCryptocurrencySelectSchema)
    .handler(async ({ input }) => {
      // const { page = 1, limit = 20, ...filters } = input;
      const { page, limit, ...filters } = input;
      const result = await Cryptocurrency.getAll({ page, limit }, filters);
      return result;
    }),
  findById: os
    .input(z.number())
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
        id: z.number(),
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
        const byCmcId = await Cryptocurrency.getByCmcId(input.payload.cmcId);
        if (byCmcId && byCmcId.id !== input.id) {
          throw new ORPCError("CONFLICT", {
            message: "cmcId is already in use",
          });
        }
      }

      return await Cryptocurrency.update(input.id, input.payload);
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

      return result;
    }),
};
