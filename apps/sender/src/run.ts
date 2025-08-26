// this is only for testing

import { MEXC_ORDERBOOK_WORKER_PATH } from "./workers/orderbooks/mexc";
import { logger } from "./utils/logger";
import type { MessageEvent } from "bun";
import type { OrderbookWorkerMessage } from "./types";

const worker = new Worker(MEXC_ORDERBOOK_WORKER_PATH, {
  argv: ["1-btc,2-eth"],
});

// const ExchangeConfigStore = new Map<string, Set<string>>();

worker.onmessage = (event: MessageEvent<OrderbookWorkerMessage>) => {
  logger.info("worker.onmessage", event.data);
};

worker.onmessageerror = (event) => {
  logger.info("PARENT_SIDE_ERROR_MESSAGE: ", event.data);
};

worker.onerror = (event) => {
  logger.info("PARENT_SIDE_ERROR: ", event.error);
};
