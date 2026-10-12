import { RPCHandler } from "@orpc/server/fetch";
import { CORSPlugin } from "@orpc/server/plugins";

import { startLastPriceScheduler } from "./last-price/last-price.scheduler";
import { logger } from "./logger";
import { router } from "./router";

const handler = new RPCHandler(router, {
    plugins: [new CORSPlugin({ origin: "*" })],
});

startLastPriceScheduler();

Bun.serve({
    async fetch(request: Request) {
        console.log(request.method, request.url, request.destination);
        try {
            const { response } = await handler.handle(request, {
                context: {}, // Provide initial context if needed
            });
            if (!response) {
                return new Response("NOT FOUND", {
                    status: 404,
                });
            }

            return response;
        } catch (error) {
            console.log(error);
            return new Response("INTERNAL SERVER ERROR", { status: 500 });
        }
    },
    port: 3001,
});

logger.info(`listening on port 3001`);
