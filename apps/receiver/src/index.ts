import {
  OrderbookQueue,
  Subjects,
  normalizedOrderbookSchema,
} from "@arbitrator/contracts";
import { createLogger } from "@arbitrator/logger";
import { connect } from "@nats-io/transport-node";

const logger = createLogger("arbitrator/receiver");

const nc = await connect({
  servers: Bun.env.NATS_URL ?? "nats://localhost:4222",
  user: Bun.env.NATS_USER,
  pass: Bun.env.NATS_PASSWORD,
  name: "arbitrator-receiver",
  maxReconnectAttempts: -1,
});

// Workers already normalize; this subscribes to the single normalized stream.
// `main.ts` runs one of these per CPU under a shared queue group, so each
// message is handled by exactly one process.
const subject = Subjects.orderbookNormalized("*");
const subscription = nc.subscribe(subject, { queue: OrderbookQueue });
logger.info(`receiver-${process.pid} listening on ${subject}`);

for await (const message of subscription) {
  const parsed = normalizedOrderbookSchema.safeParse(message.json());
  if (!parsed.success) {
    logger.warn(`dropping malformed orderbook: ${parsed.error.message}`);
    continue;
  }

  // The exchange is the last subject token; the payload carries cmcId/asks/bids.
  // TODO(separate feature): price conversion/lookup + persist to DB.
}
