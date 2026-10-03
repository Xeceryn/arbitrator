import { ORPCError, os } from "@orpc/server";
import { and, eq, notExists } from "drizzle-orm";
import z from "zod";

import { database } from "../../database/connection";
import { Chain } from "../chain/chain";
import {
  listChainSelectSchema,
  paginatedChainSelectSChema,
} from "../chain/chain.schema";
import { chain } from "../chain/chain.sql";
import { ChainLink } from "./chain-link";
import {
  chainLinkInsertSchema,
  chainLinkSelectSchema,
  chainLinkUpdateSchema,
  chainLinkWithChainSchema,
} from "./chain-link.schema";
import { chainLink } from "./chain-link.sql";

const add = os
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
  });

const list = os
  .input(
    z
      .object({
        marketId: z.number().optional(),
        chainId: z.number().optional(),
      })
      .optional(),
  )
  .output(z.array(chainLinkSelectSchema))
  .handler(async ({ input }) => {
    return await ChainLink.getAll(input);
  });

/** Chain links with their chain embedded, for the market expand panel. */
const listDetailed = os
  .input(
    z
      .object({
        marketId: z.number().optional(),
        chainId: z.number().optional(),
      })
      .optional(),
  )
  .output(z.array(chainLinkWithChainSchema))
  .handler(async ({ input }) => {
    return await ChainLink.getAllWithChain(input);
  });

/** Chains that are not yet linked to the given market. */
const listAvailableChains = os
  .input(
    listChainSelectSchema.extend({
      marketId: z.coerce.number(),
    }),
  )
  .output(paginatedChainSelectSChema)
  .handler(async ({ input }) => {
    const { marketId, ...pagination } = input;

    return await Chain.listExcluding(
      pagination,
      notExists(
        database
          .select({ id: chainLink.id })
          .from(chainLink)
          .where(
            and(
              eq(chainLink.chainId, chain.id),
              eq(chainLink.marketId, marketId),
            ),
          ),
      ),
    );
  });

const findById = os
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
  });

const update = os
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
        message: "something wrong when updating exchange-cryptocurrency-chain",
      });
    }

    return result;
  });

const remove = os
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
  });

export const chainLinkRouter = os.router({
  add,
  list,
  listDetailed,
  listAvailableChains,
  findById,
  update,
  remove,
});
