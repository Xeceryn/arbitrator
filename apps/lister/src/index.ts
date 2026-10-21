import { inAotBuild } from "elysia";

import { app } from "./app";
import { startLastPriceScheduler } from "./last-price/last-price.scheduler";
import { logger } from "./logger";

/**
 * Entry point. The app instance is exported so `@elysia/openapi`'s AOT plugin
 * can compile it; side effects (listening, cron) are skipped during that build.
 */
export { app };
export default app;

if (!inAotBuild()) {
    startLastPriceScheduler();

    app.listen(3001, ({ hostname, port }) => {
        logger.info(`listening on http://${hostname}:${port}`);
    });
}
