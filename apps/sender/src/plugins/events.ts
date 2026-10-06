import {
  Queues,
  RoutingKeys,
  metadataChangedSchema,
} from "@arbitrator/contracts";
import { createLogger } from "@arbitrator/logger";
import { type Consumer, subscribe } from "@arbitrator/messaging";
import { Elysia } from "elysia";

import type { Orchestrator } from "../orchestrator/service";

const logger = createLogger("arbitrator/sender/events");

/**
 * Consumes `metadata.changed` and nudges the orchestrator to reconcile.
 * Best-effort: the sender runs without the broker, and a missed event is a
 * latency bug (reconcile runs anyway), not a correctness bug.
 */
export const eventsPlugin = (orchestrator: Orchestrator) => {
  const state: { consumer: Consumer | undefined } = { consumer: undefined };

  return new Elysia({ name: "sender-events" })
    .decorate({ events: state })
    .onStart(() => {
      const consumer = subscribe({
        queue: Queues.metadataChanged,
        patterns: [RoutingKeys.metadataChanged],
        durable: true,
        prefetch: 16,
      });
      state.consumer = consumer;
      logger.info(
        `subscribed to ${RoutingKeys.metadataChanged} via ${Queues.metadataChanged}`,
      );

      // Drain in the background; do not block the start hook.
      void (async () => {
        for await (const delivery of consumer) {
          if (!metadataChangedSchema.safeParse(delivery.json()).success) {
            delivery.ack();
            continue;
          }
          orchestrator.notifyMetadataChanged();
          delivery.ack();
        }
      })();
    })
    .onStop(async () => {
      const consumer = state.consumer;
      state.consumer = undefined;
      await consumer?.close();
    });
};
