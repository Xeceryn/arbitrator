import { Elysia } from "elysia";

import { createOrchestrator } from "./orchestrator/bootstrap";
import type { Orchestrator } from "./orchestrator/service";
import { natsPlugin } from "./plugins/nats";
import { orchestratorPlugin } from "./plugins/orchestrator";

export function createApp(orchestrator: Orchestrator) {
  return new Elysia({ name: "arbitrator-sender" })
    .use(orchestratorPlugin(orchestrator))
    .use(natsPlugin(orchestrator))
    .post("/exchanges/:slug/start", ({ params, orchestrator, set }) => {
      const result = orchestrator.start(params.slug);
      if (!result.ok) {
        set.status = 501;
        return { message: result.reason };
      }
      return { started: params.slug };
    })
    .post("/exchanges/:slug/stop", ({ params, orchestrator }) => {
      orchestrator.stop(params.slug);
      return { stopped: params.slug };
    })
    .get("/exchanges", ({ orchestrator }) => orchestrator.status())
    .get("/workers", ({ orchestrator }) => ({
      workers: orchestrator.status().workers,
    }));
}

export const orchestrator = createOrchestrator();
export const app = createApp(orchestrator);
export type App = typeof app;
