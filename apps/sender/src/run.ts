// this is only for testing

import { MEXC_ORDERBOOK_WORKER } from "./workers/orderbooks/mexc";

const worker = new Worker(MEXC_ORDERBOOK_WORKER, {
  argv: ["1-btc"],
  env: { NODE_TLS_REJECT_UNAUTHORIZED: "0" },
});

worker.onmessage = (event) => {
  console.log("PARENT_SIDE_MESSAGE: ", event.data);
};

worker.onmessageerror = (event) => {
  console.log("PARENT_SIDE_ERROR_MESSAGE: ", event.data);
};

worker.onerror = (event) => {
  console.log("PARENT_SIDE_ERROR: ", event.error);
};
