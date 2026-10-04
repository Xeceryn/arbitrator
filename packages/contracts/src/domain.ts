import z from "zod";

export const baseCurrencySchema = z.enum(["usdt", "idr"]);
export type BaseCurrency = z.infer<typeof baseCurrencySchema>;

export const workerStateSchema = z.enum([
  "connected",
  "closed",
  "reconnecting",
  "reconnected",
  "disconnected",
  "error",
]);
export type WorkerState = z.infer<typeof workerStateSchema>;

/** A coin to (un)subscribe on one exchange's orderbook stream. */
export const symbolSubscriptionSchema = z.object({
  cmcId: z.number(),
  symbol: z.string(),
});
export type SymbolSubscription = z.infer<typeof symbolSubscriptionSchema>;
