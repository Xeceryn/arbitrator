import { Elysia } from "elysia";

import { createOrchestrator } from "./orchestrator/bootstrap";
import type { Orchestrator } from "./orchestrator/service";
import { eventsPlugin } from "./plugins/events";
import { orchestratorPlugin } from "./plugins/orchestrator";

export function createApp(orchestrator: Orchestrator) {
  return new Elysia({ name: "arbitrator-sender" })
    .use(orchestratorPlugin(orchestrator))
    .use(eventsPlugin(orchestrator))
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
    /**
     * Force a full reconcile from current lister metadata. Safety valve for a
     * missed `metadata.changed` event (e.g. the broker was down when it fired).
     */
    .post("/reconcile", async ({ orchestrator }) => {
      await orchestrator.runReconcile();
      return orchestrator.status();
    })
    .get("/exchanges", ({ orchestrator }) => orchestrator.status())
    .get("/workers", ({ orchestrator }) => ({
      workers: orchestrator.status().workers,
    }));
}

export const orchestrator = createOrchestrator();
export const app = createApp(orchestrator);
export type App = typeof app;
