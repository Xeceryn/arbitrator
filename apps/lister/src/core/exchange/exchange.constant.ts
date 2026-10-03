import {
  exchangeSearchByKeysSchema,
  exchangeOrderByKeysSchema,
} from "./exchange.schema";

export const ExhangeSearchByOptions = exchangeSearchByKeysSchema.enum;
export const ExchangeOrderByOptions = exchangeOrderByKeysSchema.enum;
