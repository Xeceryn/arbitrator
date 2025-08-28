import { ORPCError, os } from "@orpc/server";
import {
  exchangeCryptocurrencyChainInsertSchema,
  exchangeCryptocurrencyChainSelectSchema,
  exchangeCryptocurrencyChainUpdateSchema,
} from "./exchange-cryptocurrency-chain.schema";
import { ExchangeCryptocurrencyChain } from "./exchange-cryptocurrency-chain";
import z from "zod";

export const exchangeCryptocurrencyChainRouter = {
  add: os
    .input(exchangeCryptocurrencyChainInsertSchema)
    .output(exchangeCryptocurrencyChainSelectSchema)
    .handler(async ({ input }) => {
      if (await ExchangeCryptocurrencyChain.exists(input)) {
        throw new ORPCError("CONFLICT", {
          message: "exchange-cryptocurrency-chain assignment already exists",
        });
      }

      const result = await ExchangeCryptocurrencyChain.add(input);
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
    .output(z.array(exchangeCryptocurrencyChainSelectSchema))
    .handler(async ({ input }) => {
      return await ExchangeCryptocurrencyChain.getAll(input);
    }),

  findById: os
    .input(z.number())
    .output(exchangeCryptocurrencyChainSelectSchema)
    .handler(async ({ input }) => {
      const result = await ExchangeCryptocurrencyChain.getById(input);
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
        payload: exchangeCryptocurrencyChainUpdateSchema,
      }),
    )
    .output(exchangeCryptocurrencyChainSelectSchema)
    .handler(async ({ input }) => {
      const target = await ExchangeCryptocurrencyChain.getById(input.id);
      if (!target) {
        throw new ORPCError("NOT_FOUND", {
          message: "exchange-cryptocurrency-chain not found",
        });
      }

      const result = await ExchangeCryptocurrencyChain.update(
        input.id,
        input.payload,
      );
      if (!result) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "something wrong when updating exchange-cryptocurrency-chain",
        });
      }

      return result;
    }),

  remove: os
    .input(z.number())
    .output(exchangeCryptocurrencyChainSelectSchema)
    .handler(async ({ input }) => {
      const result = await ExchangeCryptocurrencyChain.remove(input);
      if (!result) {
        throw new ORPCError("NOT_FOUND", {
          message: "exchange-cryptocurrency-chain not found",
        });
      }

      return result;
    }),
};