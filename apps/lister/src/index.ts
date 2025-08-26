import { CompressionPlugin, RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin } from "@orpc/server/plugins";
import { createLogger } from "@arbitrator/logger";
import { exchangeRouter } from "./core/exchange/exchange.router";

const logger = createLogger("arbitrator/lister");
const router = {
  exchange: exchangeRouter,
};

const handler = new RPCHandler(router, {
  plugins: [new CORSPlugin({ origin: "*" }), new CompressionPlugin()],
});

Bun.serve({
  async fetch(request: Request) {
    const { matched, response } = await handler.handle(request, {
      prefix: "/rpc",
      context: {}, // Provide initial context if needed
    });

    if (matched) {
      return response;
    }

    return new Response("Not found", { status: 404 });
  },
  port: 3000,
});

logger.info(`listening on port 3000`);
