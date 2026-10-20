import { createLogger } from "@arbitrator/logger";
import { Elysia } from "elysia";

import type { Orchestrator } from "../orchestrator/service";

const logger = createLogger("arbitrator/sender/orchestrator");

/**
 * Provides the orchestrator to every handler and kicks off the first reconcile
 * when the server starts. Registered so any plugin/controller can read it from
 * context instead of importing the singleton.
 */
export const orchestratorPlugin = (orchestrator: Orchestrator) =>
    new Elysia({ name: "orchestrator" })
        .decorate({ orchestrator })
        .onStart(() => {
            // Eden rejects instead of returning an error tuple; the first
            // reconcile must not crash the server when lister is unreachable.
            void orchestrator.runReconcile().catch((error: unknown) => {
                logger.error(
                    `initial reconcile failed: ${
                        error instanceof Error ? error.message : String(error)
                    }`,
                );
            });
        });
