import z from "zod";

import { symbolSubscriptionSchema, workerStateSchema } from "./domain";

/** One live worker as reported by the sender orchestrator. */
export const workerStatusSchema = z.object({
    id: z.string(),
    exchangeSlug: z.string(),
    symbols: z.array(symbolSubscriptionSchema),
    state: workerStateSchema,
});
export type WorkerStatus = z.infer<typeof workerStatusSchema>;

/**
 * Snapshot served by `GET /exchanges` and pushed over `/exchanges/ws`.
 * All maps default to empty so the UI never has to tolerate missing fields.
 */
export const orchestratorStatusSchema = z.object({
    started: z.array(z.string()),
    workers: z.array(workerStatusSchema),
    /** Recent unexpected worker deaths per exchange slug. */
    failures: z.record(z.string(), z.number()),
    /** Desired subscription count per exchange (last reconcile). */
    desired: z.record(z.string(), z.number()),
    /** Max subscriptions one worker may hold, per exchange. */
    capacity: z.record(z.string(), z.number()),
    supported: z.array(z.string()),
});
export type OrchestratorStatus = z.infer<typeof orchestratorStatusSchema>;

/** Error body the sender returns for failed start/reconcile calls. */
export const senderMessageSchema = z.object({ message: z.string() });
export type SenderMessage = z.infer<typeof senderMessageSchema>;

export const senderStartResponseSchema = z.object({ started: z.string() });
export type SenderStartResponse = z.infer<typeof senderStartResponseSchema>;

export const senderStopResponseSchema = z.object({ stopped: z.string() });
export type SenderStopResponse = z.infer<typeof senderStopResponseSchema>;

/**
 * Sender -> UI push protocol. The socket sends one `snapshot` on connect, then
 * a `status` push on every mutation (start/stop, reconcile topology change,
 * worker state report, unexpected death, respawn). The payload is always the
 * full status — small enough to broadcast verbatim, so the UI never refetches.
 */
export const senderStatusEventSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("snapshot"),
        status: orchestratorStatusSchema,
    }),
    z.object({
        type: z.literal("status"),
        status: orchestratorStatusSchema,
    }),
]);
export type SenderStatusEvent = z.infer<typeof senderStatusEventSchema>;
