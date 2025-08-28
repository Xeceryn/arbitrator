import { serve } from "bun";
import { createLogger } from "@arbitrator/logger";
import { component } from "./views";

const logger = createLogger("ui");

serve({
	port: 3001,
	routes: {
		"/test": () => {
			return new Response(
				component().toString(),
				{
					headers: {
						"Content-Type": "text/html",
					},
				},
			)
		},
	},
});

logger.info("UI server started at port 3001");
