import {
  cryptocurrencyOrderByKeysSchema,
  cryptocurrencySearchByKeysSchema,
} from "./cryptocurrency.schema";

export const CryptocurrencySearchByOptions =
  cryptocurrencySearchByKeysSchema.enum;
export const CryptocurrencyOrderByOptions =
  cryptocurrencyOrderByKeysSchema.enum;
