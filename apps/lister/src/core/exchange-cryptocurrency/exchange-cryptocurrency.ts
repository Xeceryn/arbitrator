import { and, count, eq } from "drizzle-orm";
import { exchangeCryptocurrencyTable } from "./exchange-cryptocurrency.sql";
import { database } from "../../database/connection";
import type { ExchangeCryptocurrencyFilterExists } from "./exchange-cryptocurrency.schema";

export namespace ExchangeCryptocurrency {
  export async function exists(
    filter: ExchangeCryptocurrencyFilterExists,
  ): Promise<boolean> {
    const result = await database
      .select({ count: count() })
      .from(exchangeCryptocurrencyTable)
      .where(
        and(
          eq(exchangeCryptocurrencyTable.exchangeId, filter.exchangeId),
          eq(
            exchangeCryptocurrencyTable.cryptocurrencyId,
            filter.cryptocurrencyId,
          ),
        ),
      )
      .execute();

    return !!result[0]?.count;
  }
}
