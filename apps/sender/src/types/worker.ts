export { WorkerState } from "@arbitrator/contracts";

/**
 * Legacy message kinds still referenced by the un-migrated exchange workers.
 * Migrated workers use the discriminated unions in `@arbitrator/contracts`.
 */
export const WorkerMessageType = {
    StateChange: "state-change",
    Data: "data",
} as const;
