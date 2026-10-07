import { defineRelations } from "drizzle-orm";

import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
    chain: {
        markets: r.many.market({
            from: r.chain.id.through(r.chainLink.chainId),
            to: r.market.id.through(r.chainLink.marketId),
        }),
        chainLinks: r.many.chainLink({
            from: r.chain.id,
            to: r.chainLink.chainId,
        }),
    },
    chainLink: {
        market: r.one.market({
            from: r.chainLink.marketId,
            to: r.market.id,
        }),
        chain: r.one.chain({
            from: r.chainLink.chainId,
            to: r.chain.id,
        }),
    },
    market: {
        chains: r.many.chain({
            from: r.market.id.through(r.chainLink.marketId),
            to: r.chain.id.through(r.chainLink.chainId),
        }),
        chainLinks: r.many.chainLink({
            from: r.market.id,
            to: r.chainLink.marketId,
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
        cryptocurrencies: r.many.cryptocurrency({
            from: r.exchange.id.through(r.market.exchangeId),
            to: r.cryptocurrency.id.through(r.market.cryptocurrencyId),
        }),
    },
}));
