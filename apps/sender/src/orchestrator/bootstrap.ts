import { createLogger } from "@arbitrator/logger";

import { createListerGateway, type ListerClient } from "./lister";
import { WorkerPool, spawnThreadWorker } from "./pool";
import { Orchestrator } from "./service";

const logger = createLogger("arbitrator/sender/orchestrator");

/**
 * Worker reconnection/retry is the worker's own concern: it retries its exchange
 * socket internally and reports its state up, which fans out as a status push
 * over `/exchanges/ws`. So a worker failure is deliberately NOT turned into a
 * metadata reconcile — only real `metadata.changed` events and start/stop do.
 *
 * The pool callbacks below only exist so thread-level events land in the sender
 * logs; a worker that dies is respawned by the pool, not by a reconcile.
 * `onChanged` forwards every pool mutation to the orchestrator's subscribers.
 */
export function createOrchestrator(lister: ListerClient): Orchestrator {
    const holder: { current: Orchestrator | undefined } = {
        current: undefined,
    };

    const pool = new WorkerPool(spawnThreadWorker, {
        // A dead thread can only be recovered by the parent, but never for an
        // exchange the user has since stopped.
        shouldRespawn: (slug) => holder.current?.isStarted(slug) ?? false,
        onChanged: () => holder.current?.handlePoolChanged(),
        onWorkerEvent: (workerId, event) => {
            if (typeof event !== "object" || event === null) return;
            const record = event as Record<string, unknown>;
            if (record.type === "error") {
                logger.error(
                    `[${workerId}] worker reported: ${String(record.message)}`,
                );
                return;
            }
            if (record.type === "state") {
                logger.info(`[${workerId}] state=${String(record.state)}`);
            }
        },
        onWorkerFailure: (workerId, exchangeSlug, code) => {
            logger.error(
                `[${workerId}] worker died unexpectedly (${exchangeSlug}) exitCode=${code ?? "unknown"}`,
            );
        },
    });

    const orchestrator = new Orchestrator(pool, createListerGateway(lister));
    holder.current = orchestrator;
    return orchestrator;
}
