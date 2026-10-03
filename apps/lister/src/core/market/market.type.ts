import { marketTable } from "./market.sql";

export type Market = typeof marketTable.$inferSelect;
