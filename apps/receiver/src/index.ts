import { createLogger } from "@arbitrator/logger";
import { connect } from "@nats-io/transport-node";
import { type OrderbookMessageContent } from "@arbitrator/sender/";

const logger = createLogger("arbitrator/receiver");

const nc = await connect();

nc.subscribe("orderbook.*.update", {
  queue: "ORDERBOOK_UPDATE",
  callback: (err, msg) => {
    if (err) {
      console.error(err);
    }
    const data = msg.json<OrderbookMessageContent>();
  },
});

logger.info(`receiver-${process.pid} running`);
