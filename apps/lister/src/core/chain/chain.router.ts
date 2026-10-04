import { ORPCError, os } from "@orpc/server";
import z from "zod";

import { publishMetadataChanged } from "../../events";
import { Chain } from "./chain";
import {
  chainInsertSchema,
  chainSelectSchema,
  chainUpdateSchema,
  listChainSelectSchema,
  paginatedChainSelectSChema,
} from "./chain.schema";

export const chainRouter = {
  add: os
    .input(chainInsertSchema)
    .output(chainSelectSchema)
    .handler(async ({ input }) => {
      if (await Chain.codeExists(input.code)) {
        throw new ORPCError("CONFLICT", {
          message: "chain with this code already exists",
        });
      }
      const result = await Chain.add(input);
      if (!result) {
        throw new ORPCError("INTERNAL_SERVER_ERROR", {
          message: "something wrong when adding chain",
        });
      }

      void publishMetadataChanged({
        entity: "chain",
        action: "created",
        chainIds: [result.id],
      });

      return result;
    }),

  list: os
    .input(listChainSelectSchema)
    .output(paginatedChainSelectSChema)
    .handler(async ({ input }) => {
      const result = await Chain.list(input);
      return result;
    }),

  findById: os
    .input(z.number())
    .output(chainSelectSchema)
    .handler(async ({ input }) => {
      const result = await Chain.getById(input);
      if (!result) {
        throw new ORPCError("NOT_FOUND", {
          message: "chain not found",
        });
      }

      return result;
    }),

  update: os
    .input(
      z.object({
        id: z.number(),
        payload: chainUpdateSchema,
      }),
    )
    .output(chainSelectSchema)
    .handler(async ({ input }) => {
      const target = await Chain.getById(input.id);
      if (!target) {
        throw new ORPCError("NOT_FOUND", {
          message: "chain not found",
        });
      }
      if (input?.payload?.code) {
        const byCode = await Chain.getByCode(input.payload.code);
        if (byCode && byCode.id !== input.id) {
          throw new ORPCError("CONFLICT", {
            message: "code is already in use",
          });
        }
      }

      const result = await Chain.update(input.id, input.payload);
      if (!result) {
        throw new ORPCError("NOT_FOUND", {
          message: "chain not found",
        });
      }

      void publishMetadataChanged({
        entity: "chain",
        action: "updated",
        chainIds: [result.id],
      });

      return result;
    }),

  remove: os
    .input(z.number())
    .output(chainSelectSchema)
    .handler(async ({ input }) => {
      const result = await Chain.remove(input);
      if (!result) {
        throw new ORPCError("NOT_FOUND", {
          message: "chain not found",
        });
      }

      void publishMetadataChanged({
        entity: "chain",
        action: "deleted",
        chainIds: [result.id],
      });

      return result;
    }),
};
