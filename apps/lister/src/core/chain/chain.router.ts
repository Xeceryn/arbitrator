import { ORPCError, os } from "@orpc/server";
import { Chain } from "./chain";
import {
  chainInsertSchema,
  chainSelectSchema,
  chainUpdateSchema,
} from "./chain.schema";
import z from "zod";

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

      return result;
    }),

  list: os
    .input(
      z
        .object({
          code: z.string().optional(),
        })
        .optional(),
    )
    .output(z.array(chainSelectSchema))
    .handler(async ({ input }) => {
      return await Chain.list(input);
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
    .output(chainSelectSchema.partial())
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

      return result;
    }),
};
