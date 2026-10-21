import {
    cryptocurrencyOrderByKeys,
    cryptocurrencySearchByKeys,
} from "./cryptocurrency.schema";

export const CryptocurrencySearchByOptions: string[] = [
    ...cryptocurrencySearchByKeys,
];
export const CryptocurrencyOrderByOptions: string[] = [
    ...cryptocurrencyOrderByKeys,
];
