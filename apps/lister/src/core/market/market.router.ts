import { ORPCError, os } from "@orpc/server";
import { and, eq, notExists } from "drizzle-orm";
import z from "zod";

import { database } from "../../database/connection";
import { publishMetadataChanged } from "../../events";
import { Cryptocurrency } from "../cryptocurrency/cryptocurrency";
import { Exchange } from "../exchange/exchange";
import {
  listExchangeSelectSchema,
  paginatedExchangeSelectSchema,
} from "../exchange/exchange.schema";
import { exchange } from "../exchange/exchange.sql";
import { Market } from "./market";
import {
  listTransferableCoinsInputSchema,
  marketAssignSchema,
  marketSelectSchema,
  marketUpdatePayloadSchema,
  marketWithRelationsSchema,
  transferableCoinsSchema,
} from "./market.schema";
import { market } from "./market.sql";

const assign = os
  .input(marketAssignSchema)
  .output(marketSelectSchema)
  .handler(async ({ input }) => {
    if (await Market.exists(input)) {
      throw new ORPCError("CONFLICT", {
        message: "exchange with cryptocurrency already exists",
      });
    }

    const cryptocurrency = await Cryptocurrency.getById(input.cryptocurrencyId);
    if (!cryptocurrency) {
      throw new ORPCError("NOT_FOUND", {
        message: "cryptocurrency not found",
      });
    }

    const result = await database
      .insert(market)
      .values({
        exchangeId: input.exchangeId,
        cryptocurrencyId: input.cryptocurrencyId,
        tradeEnabled: input.tradeEnabled,
        exchangeSymbol:
          input.exchangeSymbol ?? cryptocurrency.symbol.toUpperCase(),
      })
      .returning()
      .onConflictDoNothing()
      .then((result) => result.at(0));

    if (!result) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "something wrong when assigning exchange-cryptocurrency",
      });
    }

    void publishMetadataChanged({
      entity: "market",
      action: "created",
      exchangeIds: [result.exchangeId],
      cryptocurrencyIds: [result.cryptocurrencyId],
      marketIds: [result.id],
    });

    return result;
  });

const update = os
  .input(marketUpdatePayloadSchema)
  .output(marketSelectSchema)
  .handler(async ({ input }) => {
    if (!(await Market.exists(input))) {
      throw new ORPCError("NOT_FOUND", {
        message: "exchange-cryptocurrency assignment not found",
      });
    }

    const result = await Market.update(input, input);
    if (!result) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "something wrong when updating exchange-cryptocurrency",
      });
    }

    void publishMetadataChanged({
      entity: "market",
      action: "updated",
      exchangeIds: [result.exchangeId],
      cryptocurrencyIds: [result.cryptocurrencyId],
      marketIds: [result.id],
    });

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

    void publishMetadataChanged({
      entity: "market",
      action: "deleted",
      exchangeIds: [result.exchangeId],
      cryptocurrencyIds: [result.cryptocurrencyId],
      marketIds: [result.id],
    });

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

/**
 * Assignment read-model: markets with their exchange and cryptocurrency
 * embedded. Filter by either side (exchange detail or coin sidebar).
 */
const listDetailed = os
  .input(
    z
      .object({
        exchangeId: z.number().optional(),
        cryptocurrencyId: z.number().optional(),
      })
      .optional(),
  )
  .output(z.array(marketWithRelationsSchema))
  .handler(async ({ input }) => {
    return await Market.getAllWithRelations(input);
  });

/** Exchanges that are not yet assigned to the given coin. */
const listAvailableExchanges = os
  .input(
    listExchangeSelectSchema.extend({
      cryptocurrencyId: z.coerce.number(),
    }),
  )
  .output(paginatedExchangeSelectSchema)
  .handler(async ({ input }) => {
    const { cryptocurrencyId, ...pagination } = input;

    return await Exchange.listExcluding(
      pagination,
      notExists(
        database
          .select({ id: market.id })
          .from(market)
          .where(
            and(
              eq(market.exchangeId, exchange.id),
              eq(market.cryptocurrencyId, cryptocurrencyId),
            ),
          ),
      ),
    );
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

/**
 * Directed transferability read-model for the sender orchestrator: the union of
 * per-exchange coin subscriptions for the requested started exchanges.
 */
const listTransferableCoins = os
  .input(listTransferableCoinsInputSchema)
  .output(transferableCoinsSchema)
  .handler(async ({ input }) => {
    return await Market.listTransferableCoins(input.exchangeIds);
  });

export const marketRouter = os.router({
  assign,
  unassign,
  update,
  list,
  listDetailed,
  listAvailableExchanges,
  listTransferableCoins,
  findById,
});
