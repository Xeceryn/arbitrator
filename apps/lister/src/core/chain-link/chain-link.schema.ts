import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

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
