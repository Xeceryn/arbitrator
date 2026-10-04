import { createListerGateway } from "./lister";
import { WorkerPool, spawnThreadWorker } from "./pool";
import { Orchestrator } from "./service";

export function createOrchestrator(): Orchestrator {
  const holder: { current: Orchestrator | undefined } = { current: undefined };

  const pool = new WorkerPool(spawnThreadWorker, {
    onWorkerFailure: () => holder.current?.notifyMetadataChanged(),
  });

  const orchestrator = new Orchestrator(pool, createListerGateway());
  holder.current = orchestrator;
  return orchestrator;
}
