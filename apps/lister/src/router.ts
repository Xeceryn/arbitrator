import { cryptocurrencyRouter } from "./core/cryptocurrency/cryptocurrency.router";
import { exchangeCryptocurrencyRouter } from "./core/exchange-cryptocurrency/exchange-cryptocurrency.router";
import { exchangeCryptocurrencyChainRouter } from "./core/exchange-cryptocurrency-chain/exchange-cryptocurrency-chain.router";
import { exchangeRouter } from "./core/exchange/exchange.router";
import { utilityRouter } from "./core/utility/utility.router";

export const router = {
  exchange: exchangeRouter,
  cryptocurrency: cryptocurrencyRouter,
  exchangeCryptocurrency: exchangeCryptocurrencyRouter,
  exchangeCryptocurrencyChain: exchangeCryptocurrencyChainRouter,
  utility: utilityRouter,
};
