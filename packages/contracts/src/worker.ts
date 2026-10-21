import { type Static, Type as t } from "typebox";

import { symbolSubscriptionSchema, workerStateSchema } from "./domain";

/** Parent -> worker control messages (postMessage only; never orderbook data). */
export const workerCommandSchema = t.Union([
    t.Object({
        type: t.Literal("subscribe"),
        symbols: t.Array(symbolSubscriptionSchema),
    }),
    t.Object({
        type: t.Literal("unsubscribe"),
        symbols: t.Array(symbolSubscriptionSchema),
    }),
    t.Object({ type: t.Literal("shutdown") }),
]);
export type WorkerCommand = Static<typeof workerCommandSchema>;

/** Worker -> parent messages (state/acks/errors; never orderbook data). */
export const workerEventSchema = t.Union([
    t.Object({
        type: t.Literal("state"),
        threadId: t.String(),
        exchange: t.String(),
        state: workerStateSchema,
    }),
    t.Object({
        type: t.Literal("subscribed"),
        cmcIds: t.Array(t.Number()),
    }),
    t.Object({
        type: t.Literal("unsubscribed"),
        cmcIds: t.Array(t.Number()),
    }),
    t.Object({
        type: t.Literal("error"),
        message: t.String(),
        cmcIds: t.Optional(t.Array(t.Number())),
    }),
]);
export type WorkerEvent = Static<typeof workerEventSchema>;
