import type { Static } from "typebox";

import type {
    chainLinkFilterExistsSchema,
    chainLinkInsertSchema,
    chainLinkSelectSchema,
    chainLinkUpdateSchema,
    chainLinkWithChainSchema,
} from "./chain-link.schema";
import { chainLink } from "./chain-link.sql";

export type ChainLink = typeof chainLink.$inferSelect;
export type ChainLinkInsert = Static<typeof chainLinkInsertSchema>;

export type ChainLinkUpdate = Static<typeof chainLinkUpdateSchema>;

export type ChainLinkSelect = Static<typeof chainLinkSelectSchema>;

export type ChainLinkFilterExists = Static<typeof chainLinkFilterExistsSchema>;

export type ChainLinkWithChain = Static<typeof chainLinkWithChainSchema>;
