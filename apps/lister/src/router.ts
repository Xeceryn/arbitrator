import { chainLinkRouter } from "./core/chain-link/chain-link.router";
import { chainRouter } from "./core/chain/chain.router";
import { cryptocurrencyRouter } from "./core/cryptocurrency/cryptocurrency.router";
import { exchangeRouter } from "./core/exchange/exchange.router";
import { marketRouter } from "./core/market/market.router";
import { opportunityRouter } from "./core/opportunity/opportunity.router";
import { utilityRouter } from "./core/utility/utility.router";

export const router = {
    exchange: exchangeRouter,
    cryptocurrency: cryptocurrencyRouter,
    market: marketRouter,
    opportunity: opportunityRouter,
    chainLink: chainLinkRouter,
    chain: chainRouter,
    utility: utilityRouter,
};
