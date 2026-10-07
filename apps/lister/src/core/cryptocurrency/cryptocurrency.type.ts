import type z from "zod";

import type {
    cryptocurrencyInsertSchema,
    cryptocurrencySelectSchema,
    cryptocurrencyUpdateSchema,
    listCryptocurrencySelectSchema,
    paginatedCryptocurrencySelectSchema,
    cryptocurrencyRouteSchema,
    cryptocurrencyRouteEndpointSchema,
    cryptocurrencyRoutesSchema,
} from "./cryptocurrency.schema";
import { cryptocurrency } from "./cryptocurrency.sql";

export type Cryptocurrency = typeof cryptocurrency.$inferSelect;
export type CryptocurrencySelect = z.infer<typeof cryptocurrencySelectSchema>;
export type CryptocurrencyInsert = z.infer<typeof cryptocurrencyInsertSchema>;
export type CryptocurrencyUpdate = z.infer<typeof cryptocurrencyUpdateSchema>;
export type ListCryptocurrencyInput = z.infer<
    typeof listCryptocurrencySelectSchema
>;
export type PaginatedCryptocurrencyList = z.infer<
    typeof paginatedCryptocurrencySelectSchema
>;
export type CryptocurrencyRoute = z.infer<typeof cryptocurrencyRouteSchema>;
export type CryptocurrencyRouteEndpoint = z.infer<
    typeof cryptocurrencyRouteEndpointSchema
>;
export type CryptocurrencyRoutes = z.infer<typeof cryptocurrencyRoutesSchema>;
