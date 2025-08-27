import { cryptocurrencyRouter } from "./core/cryptocurrency/cryptocurrency.router";
import { exchangeRouter } from "./core/exchange/exchange.router";
import { utilityRouter } from "./core/utility/utility.router";

export const router = {
  exchange: exchangeRouter,
  cryptocurrency: cryptocurrencyRouter,
  utility: utilityRouter,
};
