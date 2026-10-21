import { type Static, Type as t } from "typebox";

export const baseCurrencySchema = t.Enum(["usdt", "idr"]);
export type BaseCurrency = Static<typeof baseCurrencySchema>;

export const workerStateSchema = t.Enum([
    "connected",
    "closed",
    "reconnecting",
    "reconnected",
    "disconnected",
    "error",
]);
export type WorkerState = Static<typeof workerStateSchema>;

/** Convenience mirror of `workerStateSchema` for value-position use. */
export const WorkerState = {
    Connected: "connected",
    Closed: "closed",
    Reconnecting: "reconnecting",
    Reconnected: "reconnected",
    Disconnected: "disconnected",
    Error: "error",
} as const satisfies Record<string, WorkerState>;

/** A coin to (un)subscribe on one exchange's orderbook stream. */
export const symbolSubscriptionSchema = t.Object({
    cmcId: t.Number(),
    symbol: t.String(),
});
export type SymbolSubscription = Static<typeof symbolSubscriptionSchema>;
