import { and, asc, desc, eq, gt, inArray, ne } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

import { database } from "../../database/connection";
import { chainLink } from "../chain-link/chain-link.sql";
import { cryptocurrency } from "../cryptocurrency/cryptocurrency.sql";
import { exchange } from "../exchange/exchange.sql";
import { market } from "../market/market.sql";
import { opportunity } from "./opportunity.sql";

/**
 * A directed arbitrage leg: acquire the coin on `buyExchangeId`, move it, and
 * dispose of it on `sellExchangeId`. One direction does not imply the other.
 */
export type OpportunityRoute = {
  cmcId: number;
  buyExchangeId: number;
  sellExchangeId: number;
  /** Per-exchange tickers, carried so the signal UI can label each side. */
  buyExchangeSymbol: string;
  sellExchangeSymbol: string;
};

export type OpportunitySortKey = "profitPercentage" | "profitVolume";

type ChainLinkSide = {
  chainId: number;
  withdrawEnabled: boolean;
  depositEnabled: boolean;
};

function routeKey(route: OpportunityRoute): string {
  return `${route.cmcId}:${route.buyExchangeId}:${route.sellExchangeId}`;
}

export namespace Opportunity {
  /**
   * Directed transferable legs for the given exchanges. A leg exists when the
   * buy side can withdraw and the sell side can deposit on a shared chain, and
   * both markets have trading enabled.
   */
  export async function computeRoutes(
    exchangeIds: number[],
  ): Promise<OpportunityRoute[]> {
    if (exchangeIds.length < 2) return [];

    const markets = await database
      .select({
        id: market.id,
        exchangeId: market.exchangeId,
        cryptocurrencyId: market.cryptocurrencyId,
        tradeEnabled: market.tradeEnabled,
        exchangeSymbol: market.exchangeSymbol,
      })
      .from(market)
      .where(inArray(market.exchangeId, exchangeIds));

    if (markets.length === 0) return [];

    const cryptocurrencyIds = [
      ...new Set(markets.map((row) => row.cryptocurrencyId)),
    ];
    const coins = await database
      .select({ id: cryptocurrency.id, cmcId: cryptocurrency.cmcId })
      .from(cryptocurrency)
      .where(inArray(cryptocurrency.id, cryptocurrencyIds));
    const cmcById = new Map(coins.map((row) => [row.id, row.cmcId]));

    const links = await database
      .select()
      .from(chainLink)
      .where(
        inArray(
          chainLink.marketId,
          markets.map((row) => row.id),
        ),
      );

    const linksByMarket = new Map<number, ChainLinkSide[]>();
    for (const link of links) {
      const bucket = linksByMarket.get(link.marketId) ?? [];
      bucket.push({
        chainId: link.chainId,
        withdrawEnabled: link.withdrawEnabled,
        depositEnabled: link.depositEnabled,
      });
      linksByMarket.set(link.marketId, bucket);
    }

    const byCryptocurrency = new Map<number, typeof markets>();
    for (const row of markets) {
      const bucket = byCryptocurrency.get(row.cryptocurrencyId) ?? [];
      bucket.push(row);
      byCryptocurrency.set(row.cryptocurrencyId, bucket);
    }

    const routes = new Map<string, OpportunityRoute>();

    for (const group of byCryptocurrency.values()) {
      for (let i = 0; i < group.length; i += 1) {
        for (let j = i + 1; j < group.length; j += 1) {
          const a = group[i]!;
          const b = group[j]!;

          if (a.exchangeId === b.exchangeId) continue;
          if (!a.tradeEnabled || !b.tradeEnabled) continue;

          const cmcId = cmcById.get(a.cryptocurrencyId);
          if (cmcId === undefined) continue;

          const bByChain = new Map(
            (linksByMarket.get(b.id) ?? []).map((link) => [link.chainId, link]),
          );

          for (const aLink of linksByMarket.get(a.id) ?? []) {
            const bLink = bByChain.get(aLink.chainId);
            if (!bLink) continue;

            // a → b: withdraw on a, deposit on b.
            if (aLink.withdrawEnabled && bLink.depositEnabled) {
              const route: OpportunityRoute = {
                cmcId,
                buyExchangeId: a.exchangeId,
                sellExchangeId: b.exchangeId,
                buyExchangeSymbol: a.exchangeSymbol,
                sellExchangeSymbol: b.exchangeSymbol,
              };
              routes.set(routeKey(route), route);
            }

            // b → a: withdraw on b, deposit on a.
            if (bLink.withdrawEnabled && aLink.depositEnabled) {
              const route: OpportunityRoute = {
                cmcId,
                buyExchangeId: b.exchangeId,
                sellExchangeId: a.exchangeId,
                buyExchangeSymbol: b.exchangeSymbol,
                sellExchangeSymbol: a.exchangeSymbol,
              };
              routes.set(routeKey(route), route);
            }
          }
        }
      }
    }

    return [...routes.values()];
  }

  /**
   * Level-triggered reconciliation of the opportunity table against the set of
   * started exchanges: create legs that now exist, delete legs that no longer
   * do, and refresh the exchange tickers when they were renamed. Idempotent —
   * the sender calls it on start/stop and metadata changes.
   *
   * Rows are seeded with zero prices/volumes; the receiver owns updating them.
   */
  export async function sync(
    exchangeIds: number[],
  ): Promise<{ created: number; updated: number; deleted: number }> {
    const desired = await computeRoutes(exchangeIds);
    const desiredKeys = new Set(desired.map(routeKey));

    const existing = await database
      .select({
        id: opportunity.id,
        cmcId: opportunity.cmcId,
        buyExchangeId: opportunity.buyExchangeId,
        sellExchangeId: opportunity.sellExchangeId,
        buyExchangeSymbol: opportunity.buyExchangeSymbol,
        sellExchangeSymbol: opportunity.sellExchangeSymbol,
      })
      .from(opportunity);

    const existingByKey = new Map<string, (typeof existing)[number]>();
    const staleIds: number[] = [];
    for (const row of existing) {
      const key = routeKey(row);
      existingByKey.set(key, row);
      if (!desiredKeys.has(key)) staleIds.push(row.id);
    }

    const missing: OpportunityRoute[] = [];
    const renamed: Array<{ id: number; route: OpportunityRoute }> = [];
    for (const route of desired) {
      const row = existingByKey.get(routeKey(route));
      if (!row) {
        missing.push(route);
        continue;
      }
      if (
        row.buyExchangeSymbol !== route.buyExchangeSymbol ||
        row.sellExchangeSymbol !== route.sellExchangeSymbol
      ) {
        renamed.push({ id: row.id, route });
      }
    }

    if (staleIds.length > 0) {
      await database
        .delete(opportunity)
        .where(inArray(opportunity.id, staleIds));
    }

    if (missing.length > 0) {
      await database.insert(opportunity).values(
        missing.map((route) => ({
          cmcId: route.cmcId,
          buyExchangeId: route.buyExchangeId,
          sellExchangeId: route.sellExchangeId,
          buyExchangeSymbol: route.buyExchangeSymbol,
          sellExchangeSymbol: route.sellExchangeSymbol,
          buyPrice: 0,
          sellPrice: 0,
          buyVolume: 0,
          sellVolume: 0,
        })),
      );
    }

    for (const { id, route } of renamed) {
      await database
        .update(opportunity)
        .set({
          buyExchangeSymbol: route.buyExchangeSymbol,
          sellExchangeSymbol: route.sellExchangeSymbol,
        })
        .where(eq(opportunity.id, id));
    }

    return {
      created: missing.length,
      updated: renamed.length,
      deleted: staleIds.length,
    };
  }

  /**
   * Profitable signals for the signal board: every leg where the sell price
   * beats the buy price, joined with both exchanges and the coin. The UI
   * applies exchange hiding and picks `orderBy`/`order`.
   */
  export async function list(input: {
    orderBy: OpportunitySortKey;
    order: "asc" | "desc";
  }) {
    const buyExchange = alias(exchange, "buy_exchange");
    const sellExchange = alias(exchange, "sell_exchange");

    const column =
      input.orderBy === "profitVolume"
        ? opportunity.profitVolume
        : opportunity.profitPercentage;

    const rows = await database
      .select({
        id: opportunity.id,
        cmcId: opportunity.cmcId,
        buyExchangeId: opportunity.buyExchangeId,
        sellExchangeId: opportunity.sellExchangeId,
        buyExchangeSymbol: opportunity.buyExchangeSymbol,
        sellExchangeSymbol: opportunity.sellExchangeSymbol,
        buyPrice: opportunity.buyPrice,
        sellPrice: opportunity.sellPrice,
        buyVolume: opportunity.buyVolume,
        sellVolume: opportunity.sellVolume,
        profitPercentage: opportunity.profitPercentage,
        profitVolume: opportunity.profitVolume,
        buyExchange: {
          id: buyExchange.id,
          name: buyExchange.name,
          slug: buyExchange.slug,
          logo: buyExchange.logo,
          baseCurrency: buyExchange.baseCurrency,
        },
        sellExchange: {
          id: sellExchange.id,
          name: sellExchange.name,
          slug: sellExchange.slug,
          logo: sellExchange.logo,
          baseCurrency: sellExchange.baseCurrency,
        },
        coin: {
          cmcId: cryptocurrency.cmcId,
          name: cryptocurrency.name,
          symbol: cryptocurrency.symbol,
          logo: cryptocurrency.logo,
        },
      })
      .from(opportunity)
      .innerJoin(buyExchange, eq(opportunity.buyExchangeId, buyExchange.id))
      .innerJoin(sellExchange, eq(opportunity.sellExchangeId, sellExchange.id))
      .innerJoin(cryptocurrency, eq(opportunity.cmcId, cryptocurrency.cmcId))
      .where(
        and(
          gt(opportunity.profitPercentage, 0),
          ne(opportunity.buyPrice, 0),
          ne(opportunity.sellPrice, 0),
          ne(opportunity.buyVolume, 0),
          ne(opportunity.sellVolume, 0),
        ),
      )
      .orderBy(input.order === "asc" ? asc(column) : desc(column));

    // The generated columns are typed nullable by drizzle, but their SQL is
    // `COALESCE(..., 0)`, so they are always present.
    return rows.map((row) => ({
      ...row,
      profitPercentage: row.profitPercentage ?? 0,
      profitVolume: row.profitVolume ?? 0,
    }));
  }

  /**
   * Set the acquisition side of every leg this exchange is the buy venue for.
   *
   * `searchOrderbook` labels the book's sides, not the taker's: bids drive its
   * `buyPrice`, asks its `sellPrice`. A leg's buy price is the ask paid on the
   * buy exchange, so the receiver passes `sellPrice`/`sellVolume` here.
   */
  export async function updateBuySide(input: {
    exchangeId: number;
    cmcId: number;
    price: number;
    volume: number;
  }): Promise<void> {
    await database
      .update(opportunity)
      .set({ buyPrice: input.price, buyVolume: input.volume })
      .where(
        and(
          eq(opportunity.cmcId, input.cmcId),
          eq(opportunity.buyExchangeId, input.exchangeId),
        ),
      );
  }

  /**
   * Set the disposal side of every leg this exchange is the sell venue for.
   * The bid received is `searchOrderbook().buyPrice`/`buyVolume`.
   */
  export async function updateSellSide(input: {
    exchangeId: number;
    cmcId: number;
    price: number;
    volume: number;
  }): Promise<void> {
    await database
      .update(opportunity)
      .set({ sellPrice: input.price, sellVolume: input.volume })
      .where(
        and(
          eq(opportunity.cmcId, input.cmcId),
          eq(opportunity.sellExchangeId, input.exchangeId),
        ),
      );
  }
}
