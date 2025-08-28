import { ORPCError, os } from "@orpc/server";
import {
  exchangeCryptocurrencyInsertSchema,
  exchangeCryptocurrencySelectSchema,
} from "./exchange-cryptocurrency.schema";
import { database } from "../../database/connection";
import { exchangeCryptocurrencyTable } from "./exchange-cryptocurrency.sql";
import { and, eq } from "drizzle-orm";
import { ExchangeCryptocurrency } from "./exchange-cryptocurrency";

const assign = os
  .input(exchangeCryptocurrencyInsertSchema)
  .output(exchangeCryptocurrencySelectSchema)
  .handler(async ({ input }) => {
    if (await ExchangeCryptocurrency.exists(input)) {
      throw new ORPCError("CONFLICT", {
        message: "exchange with cryptocurrency already exists",
        defined: true,
      });
    }
    const result = await database
      .insert(exchangeCryptocurrencyTable)
      .values(input)
      .returning()
      .then((result) => result.at(0));

    if (!result) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "something wrong when assigning exchange-cryptocurrency",
      });
    }

    return result;
  });

const update = os
  .input(
    exchangeCryptocurrencySelectSchema.pick({
      exchangeId: true,
      cryptocurrencyId: true,
    }),
  )
  .output(exchangeCryptocurrencySelectSchema)
  .handler(async ({ input }) => {
    if (!(await ExchangeCryptocurrency.exists(input))) {
      throw new ORPCError("NOT_FOUND", {
        message: "exchange-cryptocurrency assignment not found",
      });
    }

    const result = await database
      .update(exchangeCryptocurrencyTable)
      .set(input)
      .where(
        and(
          eq(exchangeCryptocurrencyTable.exchangeId, input.exchangeId),
          eq(
            exchangeCryptocurrencyTable.cryptocurrencyId,
            input.cryptocurrencyId,
          ),
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

const unsassign = os
  .input(
    exchangeCryptocurrencySelectSchema.pick({
      exchangeId: true,
      cryptocurrencyId: true,
    }),
  )
  .handler(async ({ input }) => {
    const result = await database
      .delete(exchangeCryptocurrencyTable)
      .where(
        and(
          eq(exchangeCryptocurrencyTable.exchangeId, input.exchangeId),
          eq(
            exchangeCryptocurrencyTable.cryptocurrencyId,
            input.cryptocurrencyId,
          ),
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

export const exchangeCryptocurrencyRouter = os.router({
  assign,
  unsassign,
  update,
});
