import {
  type NormalizedOrderbookEvent,
  OrderbookQueue,
  Subjects,
  rawOrderbookSchema,
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

const encoder = new TextEncoder();

// `main.ts` runs one of these per CPU; sharing the queue group means each raw
// message is handled by exactly one process.
const subscription = nc.subscribe(Subjects.orderbookRaw("*"), {
  queue: OrderbookQueue,
});
logger.info(
  `receiver-${process.pid} listening on ${Subjects.orderbookRaw("*")}`,
);

for await (const message of subscription) {
  const parsed = rawOrderbookSchema.safeParse(message.json());
  if (!parsed.success) {
    logger.warn(`dropping malformed raw orderbook: ${parsed.error.message}`);
    continue;
  }

  const { exchange, cmcId, asks, bids } = parsed.data;
  const normalized: NormalizedOrderbookEvent = { cmcId, asks, bids };

  nc.publish(
    Subjects.orderbookNormalized(exchange),
    encoder.encode(JSON.stringify(normalized)),
  );
}
