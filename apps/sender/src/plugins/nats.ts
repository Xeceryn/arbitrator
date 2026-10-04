import { Subjects, metadataChangedSchema } from "@arbitrator/contracts";
import { createLogger } from "@arbitrator/logger";
import { type NatsConnection, connect } from "@nats-io/transport-node";
import { Elysia } from "elysia";

import type { Orchestrator } from "../orchestrator/service";

const logger = createLogger("arbitrator/sender/nats");

/**
 * Connects to NATS when the server starts (not at module load) and closes on
 * stop. Subscribes to `metadata.changed` and nudges the orchestrator to
 * reconcile. Best-effort: the sender runs without NATS.
 */
export const natsPlugin = (orchestrator: Orchestrator) => {
  const nats: { connection: NatsConnection | undefined } = {
    connection: undefined,
  };

  return new Elysia({ name: "nats" })
    .decorate({ nats })
    .onStart(async () => {
      try {
        const connection = await connect({
          servers: Bun.env.NATS_URL ?? "nats://localhost:4222",
          user: Bun.env.NATS_USER,
          pass: Bun.env.NATS_PASSWORD,
          name: "arbitrator-sender",
          maxReconnectAttempts: -1,
        });
        nats.connection = connection;
        logger.info(`subscribed to ${Subjects.metadataChanged}`);

        // Consume in the background; do not block the start hook.
        void (async () => {
          const subscription = connection.subscribe(Subjects.metadataChanged);
          for await (const message of subscription) {
            if (!metadataChangedSchema.safeParse(message.json()).success) {
              continue;
            }
            orchestrator.notifyMetadataChanged();
          }
        })();
      } catch (error: unknown) {
        logger.warn(
          `nats connection failed, metadata events disabled: ${String(error)}`,
        );
      }
    })
    .onStop(async () => {
      await nats.connection?.drain();
    });
};
