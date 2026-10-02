import type z from "zod";

import type {
  chainInsertSchema,
  chainSelectSchema,
  chainUpdateSchema,
  listChainSelectSchema,
  paginatedChainSelectSChema,
} from "./chain.schema";
import { chainTable } from "./chain.sql";

export type Chain = typeof chainTable.$inferSelect;
export type ChainSelect = z.infer<typeof chainSelectSchema>;
export type ChainInsert = z.infer<typeof chainInsertSchema>;
export type ChainUpdate = z.infer<typeof chainUpdateSchema>;
export type ListChainInput = z.infer<typeof listChainSelectSchema>;
export type PaginatedChainList = z.infer<typeof paginatedChainSelectSChema>;
