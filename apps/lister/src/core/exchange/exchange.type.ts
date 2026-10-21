import type { Static } from "typebox";

import type {
    exchangeInsertSchema,
    exchangeSelectSchema,
    exchangeUpdateSchema,
    listExchangeSelectSchema,
    paginatedExchangeSelectSchema,
} from "./exchange.schema";
import { exchange } from "./exchange.sql";

export type Exchange = typeof exchange.$inferSelect;
export type ExchangeSelect = Static<typeof exchangeSelectSchema>;
export type ExchangeInsert = Static<typeof exchangeInsertSchema>;
export type ExchangeUpdate = Static<typeof exchangeUpdateSchema>;
export type ListExchangeInput = Static<typeof listExchangeSelectSchema>;
export type PaginatedExchangeList = Static<
    typeof paginatedExchangeSelectSchema
>;
