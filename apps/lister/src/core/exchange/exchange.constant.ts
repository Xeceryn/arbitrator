import { exchangeOrderByKeys, exchangeSearchByKeys } from "./exchange.schema";

export const ExchangeSearchByOptions: string[] = [...exchangeSearchByKeys];
export const ExchangeOrderByOptions: string[] = [...exchangeOrderByKeys];
