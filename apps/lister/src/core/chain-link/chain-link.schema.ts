import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { chainSelectSchema } from "../chain/chain.schema";
import { chainLink } from "./chain-link.sql";

export const chainLinkInsertSchema = createInsertSchema(chainLink).omit({
  createdAt: true,
  updatedAt: true,
});

export const chainLinkUpdateSchema = createUpdateSchema(chainLink).omit({
  createdAt: true,
  updatedAt: true,
});

export const chainLinkSelectSchema = createSelectSchema(chainLink);

export const chainLinkFilterExistsSchema = chainLinkSelectSchema.pick({
  marketId: true,
  chainId: true,
});

/** A chain-link row with its chain embedded. */
export const chainLinkWithChainSchema = chainLinkSelectSchema.extend({
  chain: chainSelectSchema,
});
