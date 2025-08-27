import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin } from "@orpc/server/plugins";
import { createLogger } from "@arbitrator/logger";
import { router } from "./router";

const logger = createLogger("arbitrator/lister");

const handler = new RPCHandler(router, {
  plugins: [new CORSPlugin({ origin: "*" })],
});

Bun.serve({
  async fetch(request: Request) {
    const { response } = await handler.handle(request, {
      context: {}, // Provide initial context if needed
    });
    if (!response) {
      return new Response("NOT FOUND", {
        status: 404,
      });
    }

    return response;
  },
  port: 3000,
});

logger.info(`listening on port 3000`);
