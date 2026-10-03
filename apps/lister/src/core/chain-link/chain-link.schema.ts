import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

import { chainLinkTable } from "./chain-link.sql";

export const chainLinkInsertSchema = createInsertSchema(chainLinkTable).omit({
  createdAt: true,
  updatedAt: true,
});

export const chainLinkUpdateSchema = createUpdateSchema(chainLinkTable).omit({
  createdAt: true,
  updatedAt: true,
});

export const chainLinkSelectSchema = createSelectSchema(chainLinkTable);

export const chainLinkFilterExistsSchema = chainLinkSelectSchema.pick({
  marketId: true,
  chainId: true,
});
