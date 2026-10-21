import { createLogger } from "@arbitrator/logger";
import { inAotBuild } from "elysia";

import { app } from "./app";

const logger = createLogger("arbitrator/sender");

/**
 * The app is exported so an AOT compiler can import the route graph without
 * side effects: no listening socket and no orchestrator bootstrap (first
 * reconcile, RabbitMQ consumer) while `inAotBuild()` is true.
 */
export { app };
export default app;

if (!inAotBuild()) {
    app.listen(3002, ({ hostname, port }) => {
        logger.info(`listening on http://${hostname}:${port}`);
    });
}
