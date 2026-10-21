import { type Static, Type as t } from "typebox";

import { symbolSubscriptionSchema, workerStateSchema } from "./domain";

/** One live worker as reported by the sender orchestrator. */
export const workerStatusSchema = t.Object({
    id: t.String(),
    exchangeSlug: t.String(),
    symbols: t.Array(symbolSubscriptionSchema),
    state: workerStateSchema,
});
export type WorkerStatus = Static<typeof workerStatusSchema>;

/**
 * Snapshot served by `GET /exchanges` and pushed over `/exchanges/ws`.
 * All maps default to empty so the UI never has to tolerate missing fields.
 */
export const orchestratorStatusSchema = t.Object({
    started: t.Array(t.String()),
    workers: t.Array(workerStatusSchema),
    /** Recent unexpected worker deaths per exchange slug. */
    failures: t.Record(t.String(), t.Number()),
    /** Desired subscription count per exchange (last reconcile). */
    desired: t.Record(t.String(), t.Number()),
    /** Max subscriptions one worker may hold, per exchange. */
    capacity: t.Record(t.String(), t.Number()),
    supported: t.Array(t.String()),
});
export type OrchestratorStatus = Static<typeof orchestratorStatusSchema>;

/** Error body the sender returns for failed start/reconcile calls. */
export const senderMessageSchema = t.Object({ message: t.String() });
export type SenderMessage = Static<typeof senderMessageSchema>;

export const senderStartResponseSchema = t.Object({ started: t.String() });
export type SenderStartResponse = Static<typeof senderStartResponseSchema>;

export const senderStopResponseSchema = t.Object({ stopped: t.String() });
export type SenderStopResponse = Static<typeof senderStopResponseSchema>;

/**
 * Sender -> UI push protocol. The socket sends one `snapshot` on connect, then
 * a `status` push on every mutation (start/stop, reconcile topology change,
 * worker state report, unexpected death, respawn). The payload is always the
 * full status — small enough to broadcast verbatim, so the UI never refetches.
 */
export const senderStatusEventSchema = t.Union([
    t.Object({
        type: t.Literal("snapshot"),
        status: orchestratorStatusSchema,
    }),
    t.Object({
        type: t.Literal("status"),
        status: orchestratorStatusSchema,
    }),
]);
export type SenderStatusEvent = Static<typeof senderStatusEventSchema>;
