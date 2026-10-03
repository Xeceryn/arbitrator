import { ORPCError, os } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import z from "zod";

import { database } from "../../database/connection";
import { Market } from "./market";
import { marketInsertSchema, marketSelectSchema } from "./market.schema";
import { market } from "./market.sql";

const assign = os
  .input(marketInsertSchema)
  .output(marketSelectSchema)
  .handler(async ({ input }) => {
    if (await Market.exists(input)) {
      throw new ORPCError("CONFLICT", {
        message: "exchange with cryptocurrency already exists",
      });
    }

    const result = await database
      .insert(market)
      .values(input)
      .returning()
      .onConflictDoNothing()
      .then((result) => result.at(0));
    console.log("result", result);

    if (!result) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "something wrong when assigning exchange-cryptocurrency",
      });
    }

    return result;
  });

const update = os
  .input(
    marketSelectSchema.pick({
      exchangeId: true,
      cryptocurrencyId: true,
    }),
  )
  .output(marketSelectSchema)
  .handler(async ({ input }) => {
    if (!(await Market.exists(input))) {
      throw new ORPCError("NOT_FOUND", {
        message: "exchange-cryptocurrency assignment not found",
      });
    }

    const result = await database
      .update(market)
      .set(input)
      .where(
        and(
          eq(market.exchangeId, input.exchangeId),
          eq(market.cryptocurrencyId, input.cryptocurrencyId),
        ),
      )
      .returning()
      .then((result) => result.at(0));

    if (!result) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "something wrong when updating exchange-cryptocurrency",
      });
    }

    return result;
  });

const unassign = os
  .input(
    marketSelectSchema.pick({
      exchangeId: true,
      cryptocurrencyId: true,
    }),
  )
  .handler(async ({ input }) => {
    const result = await database
      .delete(market)
      .where(
        and(
          eq(market.exchangeId, input.exchangeId),
          eq(market.cryptocurrencyId, input.cryptocurrencyId),
        ),
      )
      .returning()
      .then((result) => result.at(0));

    if (!result) {
      throw new ORPCError("NOT_FOUND", {
        message: "exchange-cryptocurrency assignment not found",
      });
    }

    return result;
  });

const list = os
  .input(
    z
      .object({
        exchangeId: z.number().optional(),
        cryptocurrencyId: z.number().optional(),
      })
      .optional(),
  )
  .output(z.array(marketSelectSchema))
  .handler(async ({ input }) => {
    return await Market.getAll(input);
  });

const findById = os
  .input(z.number())
  .output(marketSelectSchema)
  .handler(async ({ input }) => {
    const result = await Market.getById(input);
    if (!result) {
      throw new ORPCError("NOT_FOUND", {
        message: "exchange-cryptocurrency assignment not found",
      });
    }

    return result;
  });

export const marketRouter = os.router({
  assign,
  unassign,
  update,
  list,
  findById,
});
