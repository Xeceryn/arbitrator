import { app } from "./app";
import { startLastPriceScheduler } from "./last-price/last-price.scheduler";
import { logger } from "./logger";

startLastPriceScheduler();

app.listen(3001, ({ hostname, port }) => {
    logger.info(`listening on http://${hostname}:${port}`);
});
