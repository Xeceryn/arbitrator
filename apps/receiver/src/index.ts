import { createLogger } from "@arbitrator/logger";
import { connect } from "@nats-io/transport-node";
const logger = createLogger("arbitrator/receiver");

const nc = await connect();

nc.subscribe("orderbook.*.update", {
  queue: "ORDERBOOK_UPDATE",
  callback: (err, msg) => {
    if (err) {
      console.error(err);
    }
    console.log(`got message from thread ${process.pid}`);
    console.log(msg.json());
  },
});

logger.info(`receiver-${process.pid} running`);
