import type { z } from "zod";

import type {
  chainLinkFilterExistsSchema,
  chainLinkInsertSchema,
  chainLinkSelectSchema,
  chainLinkUpdateSchema,
  chainLinkWithChainSchema,
} from "./chain-link.schema";
import { chainLink } from "./chain-link.sql";

export type ChainLink = typeof chainLink.$inferSelect;
export type ChainLinkInsert = z.infer<typeof chainLinkInsertSchema>;

export type ChainLinkUpdate = z.infer<typeof chainLinkUpdateSchema>;

export type ChainLinkSelect = z.infer<typeof chainLinkSelectSchema>;

export type ChainLinkFilterExists = z.infer<typeof chainLinkFilterExistsSchema>;

export type ChainLinkWithChain = z.infer<typeof chainLinkWithChainSchema>;
