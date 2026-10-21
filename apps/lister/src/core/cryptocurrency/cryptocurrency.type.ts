import type { Static } from "typebox";

import type {
    cryptocurrencyInsertSchema,
    cryptocurrencyRouteEndpointSchema,
    cryptocurrencyRouteSchema,
    cryptocurrencyRoutesSchema,
    cryptocurrencySelectSchema,
    cryptocurrencyUpdateSchema,
    listCryptocurrencySelectSchema,
    paginatedCryptocurrencySelectSchema,
} from "./cryptocurrency.schema";
import { cryptocurrency } from "./cryptocurrency.sql";

export type Cryptocurrency = typeof cryptocurrency.$inferSelect;
export type CryptocurrencySelect = Static<typeof cryptocurrencySelectSchema>;
export type CryptocurrencyInsert = Static<typeof cryptocurrencyInsertSchema>;
export type CryptocurrencyUpdate = Static<typeof cryptocurrencyUpdateSchema>;
export type ListCryptocurrencyInput = Static<
    typeof listCryptocurrencySelectSchema
>;
export type PaginatedCryptocurrencyList = Static<
    typeof paginatedCryptocurrencySelectSchema
>;
export type CryptocurrencyRoute = Static<typeof cryptocurrencyRouteSchema>;
export type CryptocurrencyRouteEndpoint = Static<
    typeof cryptocurrencyRouteEndpointSchema
>;
export type CryptocurrencyRoutes = Static<typeof cryptocurrencyRoutesSchema>;
