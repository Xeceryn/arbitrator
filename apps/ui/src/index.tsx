import { serve } from "bun";
import index from "./views/index.html";
import { createLogger } from "@arbitrator/logger";

const logger = createLogger("ui");

serve({
  port: 3001,
  routes: {
    "/": index,
  },
});

logger.info("UI server started at port 3001");
