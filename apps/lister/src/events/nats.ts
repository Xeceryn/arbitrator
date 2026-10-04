import { createLogger } from "@arbitrator/logger";
import { type NatsConnection, connect } from "@nats-io/transport-node";

const logger = createLogger("arbitrator/lister/events");

let client: NatsConnection | undefined;
let connecting: Promise<NatsConnection | undefined> | undefined;

/**
 * Lazily connect to NATS. Events are best-effort: a lister that cannot reach
 * NATS must keep serving the API (the UI depends on it).
 */
async function getConnection(): Promise<NatsConnection | undefined> {
  if (client) return client;
  if (!connecting) {
    const servers = Bun.env.NATS_URL ?? "nats://localhost:4222";
    connecting = connect({
      servers,
      user: Bun.env.NATS_USER,
      pass: Bun.env.NATS_PASSWORD,
      name: "arbitrator-lister",
      maxReconnectAttempts: -1,
    })
      .then((nc) => {
        client = nc;
        logger.info(`connected to nats at ${servers}`);
        return nc;
      })
      .catch((error: unknown) => {
        logger.warn(
          `nats connection failed, events disabled: ${String(error)}`,
        );
        connecting = undefined;
        return undefined;
      });
  }
  return connecting;
}

/** Publish a JSON payload. Never throws; returns whether it was sent. */
export async function publish(
  subject: string,
  payload: unknown,
): Promise<boolean> {
  try {
    const nc = await getConnection();
    if (!nc) return false;
    nc.publish(subject, new TextEncoder().encode(JSON.stringify(payload)));
    await nc.flush();
    return true;
  } catch (error: unknown) {
    logger.warn(`nats publish to ${subject} failed: ${String(error)}`);
    return false;
  }
}
