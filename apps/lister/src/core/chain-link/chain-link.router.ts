import { ORPCError, os } from "@orpc/server";
import z from "zod";

import { ChainLink } from "./chain-link";
import {
  chainLinkInsertSchema,
  chainLinkSelectSchema,
  chainLinkUpdateSchema,
} from "./chain-link.schema";

export const chainLinkRouter = {
  add: os
    .input(chainLinkInsertSchema)
    .output(chainLinkSelectSchema)
    .handler(async ({ input }) => {
      if (await ChainLink.exists(input)) {
        throw new ORPCError("CONFLICT", {
          message: "exchange-cryptocurrency-chain assignment already exists",
        });
      }

      const result = await ChainLink.add(input);
      if (!result) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "something wrong when adding exchange-cryptocurrency-chain",
        });
      }

      return result;
    }),

  list: os
    .input(
      z
        .object({
          exchangeCryptocurrencyId: z.number().optional(),
          chainId: z.number().optional(),
        })
        .optional(),
    )
    .output(z.array(chainLinkSelectSchema))
    .handler(async ({ input }) => {
      return await ChainLink.getAll(input);
    }),

  findById: os
    .input(z.number())
    .output(chainLinkSelectSchema)
    .handler(async ({ input }) => {
      const result = await ChainLink.getById(input);
      if (!result) {
        throw new ORPCError("NOT_FOUND", {
          message: "exchange-cryptocurrency-chain not found",
        });
      }

      return result;
    }),

  update: os
    .input(
      z.object({
        id: z.number(),
        payload: chainLinkUpdateSchema,
      }),
    )
    .output(chainLinkSelectSchema)
    .handler(async ({ input }) => {
      const target = await ChainLink.getById(input.id);
      if (!target) {
        throw new ORPCError("NOT_FOUND", {
          message: "exchange-cryptocurrency-chain not found",
        });
      }

      const result = await ChainLink.update(input.id, input.payload);
      if (!result) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message:
            "something wrong when updating exchange-cryptocurrency-chain",
        });
      }

      return result;
    }),

  remove: os
    .input(z.number())
    .output(chainLinkSelectSchema)
    .handler(async ({ input }) => {
      const result = await ChainLink.remove(input);
      if (!result) {
        throw new ORPCError("NOT_FOUND", {
          message: "exchange-cryptocurrency-chain not found",
        });
      }

      return result;
    }),
};
