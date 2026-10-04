import { Subjects, metadataChangedSchema } from "@arbitrator/contracts";
import { createLogger } from "@arbitrator/logger";
import { connect } from "@nats-io/transport-node";

import { app, orchestrator } from "./app";

const logger = createLogger("arbitrator/sender");

app.listen(3002, ({ hostname, port }) => {
  logger.info(`listening on http://${hostname}:${port}`);
});

// Recover any worker topology from a previous life of this process.
void orchestrator.runReconcile();

try {
  const nc = await connect({
    servers: Bun.env.NATS_URL ?? "nats://localhost:4222",
    user: Bun.env.NATS_USER,
    pass: Bun.env.NATS_PASSWORD,
    name: "arbitrator-sender",
    maxReconnectAttempts: -1,
  });

  logger.info(`subscribed to ${Subjects.metadataChanged}`);
  const subscription = nc.subscribe(Subjects.metadataChanged);
  for await (const message of subscription) {
    if (!metadataChangedSchema.safeParse(message.json()).success) continue;
    orchestrator.notifyMetadataChanged();
  }
} catch (error: unknown) {
  logger.warn(
    `nats subscription failed, metadata events disabled: ${String(error)}`,
  );
}
