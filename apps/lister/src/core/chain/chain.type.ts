import type { Static } from "typebox";

import type {
    chainInsertSchema,
    chainSelectSchema,
    chainUpdateSchema,
    listChainSelectSchema,
    paginatedChainSelectSChema,
} from "./chain.schema";
import { chain } from "./chain.sql";

export type Chain = typeof chain.$inferSelect;
export type ChainSelect = Static<typeof chainSelectSchema>;
export type ChainInsert = Static<typeof chainInsertSchema>;
export type ChainUpdate = Static<typeof chainUpdateSchema>;
export type ListChainInput = Static<typeof listChainSelectSchema>;
export type PaginatedChainList = Static<typeof paginatedChainSelectSChema>;
