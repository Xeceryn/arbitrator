import { chainTable } from "./chain.sql";

export type Chain = typeof chainTable.$inferSelect;
