import { createLogger } from "@arbitrator/logger";

import { app } from "./app";

const logger = createLogger("arbitrator/sender");

app.listen(3002, ({ hostname, port }) => {
  logger.info(`listening on http://${hostname}:${port}`);
});
