import z from "zod";

import { symbolSubscriptionSchema, workerStateSchema } from "./domain";

/** Parent -> worker control messages (postMessage only; never orderbook data). */
export const workerCommandSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("subscribe"),
    symbols: z.array(symbolSubscriptionSchema),
  }),
  z.object({
    type: z.literal("unsubscribe"),
    symbols: z.array(symbolSubscriptionSchema),
  }),
  z.object({ type: z.literal("shutdown") }),
]);
export type WorkerCommand = z.infer<typeof workerCommandSchema>;

/** Worker -> parent messages (state/acks/errors; never orderbook data). */
export const workerEventSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("state"),
    threadId: z.string(),
    exchange: z.string(),
    state: workerStateSchema,
  }),
  z.object({
    type: z.literal("subscribed"),
    cmcIds: z.array(z.number()),
  }),
  z.object({
    type: z.literal("unsubscribed"),
    cmcIds: z.array(z.number()),
  }),
  z.object({
    type: z.literal("error"),
    message: z.string(),
    cmcIds: z.array(z.number()).optional(),
  }),
]);
export type WorkerEvent = z.infer<typeof workerEventSchema>;
