import { and, eq, inArray } from "drizzle-orm";

import { database } from "../../database/connection";
import { chainLink } from "../chain-link/chain-link.sql";
import { cryptocurrency } from "../cryptocurrency/cryptocurrency.sql";
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
};

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
              };
              routes.set(routeKey(route), route);
            }

            // b → a: withdraw on b, deposit on a.
            if (bLink.withdrawEnabled && aLink.depositEnabled) {
              const route: OpportunityRoute = {
                cmcId,
                buyExchangeId: b.exchangeId,
                sellExchangeId: a.exchangeId,
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
   * do. Idempotent — the sender calls it on start/stop and metadata changes.
   *
   * Rows are seeded with zero prices/volumes; the receiver owns updating them.
   */
  export async function sync(
    exchangeIds: number[],
  ): Promise<{ created: number; deleted: number }> {
    const desired = await computeRoutes(exchangeIds);
    const desiredKeys = new Set(desired.map(routeKey));

    const existing = await database
      .select({
        id: opportunity.id,
        cmcId: opportunity.cmcId,
        buyExchangeId: opportunity.buyExchangeId,
        sellExchangeId: opportunity.sellExchangeId,
      })
      .from(opportunity);

    const staleIds: number[] = [];
    const existingKeys = new Set<string>();
    for (const row of existing) {
      const key = routeKey(row);
      existingKeys.add(key);
      if (!desiredKeys.has(key)) staleIds.push(row.id);
    }

    const missing = desired.filter(
      (route) => !existingKeys.has(routeKey(route)),
    );

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
          buyPrice: 0,
          sellPrice: 0,
          buyVolume: 0,
          sellVolume: 0,
        })),
      );
    }

    return { created: missing.length, deleted: staleIds.length };
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
