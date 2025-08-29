import {
  createSelectSchema,
  createUpdateSchema,
  createInsertSchema,
} from "drizzle-zod";

import { chainTable } from "./chain.sql";

export const chainSelectSchema = createSelectSchema(chainTable);
export const chainInsertSchema = createInsertSchema(chainTable).omit({
  createdAt: true,
  updatedAt: true,
});

export const chainUpdateSchema = createUpdateSchema(chainTable).omit({
  createdAt: true,
  updatedAt: true,
});