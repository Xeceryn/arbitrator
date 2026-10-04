import { ORPCError, os } from "@orpc/server";
import { z } from "zod";

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

export const exchangeRouter = {
  add: os
    .input(exchangeInsertSchema)
    .output(exchangeSelectSchema)
    .handler(async ({ input }) => {
      if (await Exchange.cmcIdExists(input.cmcId)) {
        throw new ORPCError("CONFLICT", {
          message: "exchange with this cmcId already exists",
        });
      }
      const result = await Exchange.add(input);
      if (!result) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "something wrong when adding exchange",
        });
      }

      void publishMetadataChanged({
        entity: "exchange",
        action: "created",
        exchangeIds: [result.id],
      });

      return result;
    }),

  list: os
    .input(listExchangeSelectSchema)
    .output(paginatedExchangeSelectSchema)
    .handler(async ({ input }) => {
      return await Exchange.list(input);
    }),

  findById: os
    .input(z.coerce.number())
    .output(exchangeSelectSchema)
    .handler(async ({ input }) => {
      const result = await Exchange.getById(input);
      if (!result) {
        throw new ORPCError("NOT_FOUND", {
          message: "exchange not found",
        });
      }
      return result;
    }),

  /**
   * Exchange detail with its assigned cryptocurrencies, each carrying the
   * market metadata (`tradeEnabled`, `exchangeSymbol`).
   */
  findByIdWithCryptocurrencies: os
    .input(z.coerce.number())
    .output(exchangeWithCryptocurrenciesSchema)
    .handler(async ({ input }) => {
      const target = await Exchange.getById(input);
      if (!target) {
        throw new ORPCError("NOT_FOUND", {
          message: "exchange not found",
        });
      }

      const markets = await Market.getAllWithRelations({ exchangeId: input });

      return {
        ...target,
        cryptocurrencies: markets.map((market) => ({
          ...market.cryptocurrency,
          marketId: market.id,
          tradeEnabled: market.tradeEnabled,
          exchangeSymbol: market.exchangeSymbol,
        })),
      };
    }),

  update: os
    .input(
      z.object({
        id: z.coerce.number(),
        payload: exchangeUpdateSchema,
      }),
    )
    .output(exchangeSelectSchema)
    .handler(async ({ input }) => {
      const target = await Exchange.getById(input.id);
      if (!target) {
        throw new ORPCError("NOT_FOUND", {
          message: "exchange not found",
        });
      }
      if (input?.payload?.cmcId) {
        const byCmcId = await Exchange.getByCmcId(input.payload.cmcId);
        if (byCmcId && byCmcId.id !== input.id) {
          throw new ORPCError("CONFLICT", {
            message: "cmcId is already in use",
          });
        }
      }
      const data = await Exchange.update(input.id, input.payload);
      if (!data) {
        throw new ORPCError("NOT_FOUND", {
          message: "exchange not found",
        });
      }

      void publishMetadataChanged({
        entity: "exchange",
        action: "updated",
        exchangeIds: [data.id],
      });

      return data;
    }),

  remove: os
    .input(z.number())
    .output(exchangeSelectSchema)
    .handler(async ({ input }) => {
      const result = await Exchange.remove(input);
      if (!result) {
        throw new ORPCError("NOT_FOUND");
      }

      void publishMetadataChanged({
        entity: "exchange",
        action: "deleted",
        exchangeIds: [result.id],
      });

      return result;
    }),
};
