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
    chains: r.many.chain(),
  },
  cryptocurrency: {
    exchanges: r.many.exchange({
      from: r.cryptocurrency.id.through(r.market.cryptocurrencyId),
      to: r.exchange.id.through(r.market.exchangeId),
    }),
  },
  exchange: {
    cryptocurrencies: r.many.cryptocurrency(),
  },
}));
