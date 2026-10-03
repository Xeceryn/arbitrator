import { defineRelations } from "drizzle-orm";

import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  chain: {
    markets: r.many.market({
      from: r.chain.id.through(r.chainLink.chainId),
      to: r.market.id.through(r.chainLink.marketId),
    }),
  },
  market: {
    chains: r.many.chain({
      from: r.market.id.through(r.chainLink.marketId),
      to: r.chain.id.through(r.chainLink.chainId),
    }),
    exchange: r.one.exchange({
      from: r.market.exchangeId,
      to: r.exchange.id,
    }),
    cryptocurrency: r.one.cryptocurrency({
      from: r.market.cryptocurrencyId,
      to: r.cryptocurrency.id,
    }),
  },
  cryptocurrency: {
    markets: r.many.market({
      from: r.cryptocurrency.id,
      to: r.market.cryptocurrencyId,
    }),
    exchanges: r.many.exchange({
      from: r.cryptocurrency.id.through(r.market.cryptocurrencyId),
      to: r.exchange.id.through(r.market.exchangeId),
    }),
  },
  exchange: {
    markets: r.many.market({
      from: r.exchange.id,
      to: r.market.exchangeId,
    }),
    cryptocurrencies: r.many.cryptocurrency(),
  },
}));
