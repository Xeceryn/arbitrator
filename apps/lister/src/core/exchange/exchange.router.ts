import { ORPCError, os } from "@orpc/server";
import { Exchange } from "./exchange";
import { z } from "zod/v4";
import {
  exchangeInsertSchema,
  exchangeSelectSchema,
  exchangeUpdateSchema,
} from "./exchange.schema";

const findAll = os
  .input(
    z
      .object({
        cmcid: z.number().optional(),
        hasCryptocurrencyWithId: z.number().optional(),
      })
      .optional(),
  )
  .output(z.array(exchangeSelectSchema))
  .handler(async ({ input }) => {
    return await Exchange.getAll(input);
  });

const findById = os
  .input(z.number())
  .output(exchangeSelectSchema)
  .handler(async ({ input }) => {
    const result = await Exchange.getById(input);
    if (!result) {
      throw new ORPCError("NOT_FOUND", {
        message: "exchange not found",
      });
    }

    return result;
  });

const add = os
  .input(exchangeInsertSchema)
  .output(exchangeSelectSchema)
  .handler(async ({ input }) => {
    if (await Exchange.cmcIdExists(input.cmcId)) {
      throw new ORPCError("CONFLICT", {
        message: "exchange with this cmcId already exists",
      });
    }
    return await Exchange.add(input);
  });

const update = os
  .input(
    z.object({
      id: z.number(),
      payload: exchangeUpdateSchema.omit({ createdAt: true, updatedAt: true }),
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

    // validate if cmcId is about to be updated
    // but the upcoming cmcId is already in use
    if (input?.payload?.cmcId) {
      const byCmcId = await Exchange.getByCmcId(input.payload.cmcId);
      if (byCmcId && byCmcId.id !== input.id) {
        throw new ORPCError("CONFLICT", {
          message: "cmcId is already in use",
        });
      }
    }

    return await Exchange.update(input.id, input.payload);
  });

const remove = os
  .input(z.number())
  .output(exchangeSelectSchema)
  .handler(async ({ input }) => {
    const result = await Exchange.remove(input);
    if (!result) {
      throw new ORPCError("NOT_FOUND");
    }

    return result;
  });

export const exchangeRouter = {
  findAll,
  findById,
  add,
  update,
  remove,
};
