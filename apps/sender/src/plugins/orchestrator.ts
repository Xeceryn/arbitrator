import { Elysia } from "elysia";

import type { Orchestrator } from "../orchestrator/service";

/**
 * Provides the orchestrator to every handler and kicks off the first reconcile
 * when the server starts. Registered so any plugin/controller can read it from
 * context instead of importing the singleton.
 */
export const orchestratorPlugin = (orchestrator: Orchestrator) =>
  new Elysia({ name: "orchestrator" })
    .decorate({ orchestrator })
    .onStart(() => {
      void orchestrator.runReconcile();
    });
