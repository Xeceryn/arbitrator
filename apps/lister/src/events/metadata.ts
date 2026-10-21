import {
    type MetadataChangedInput,
    RoutingKeys,
    metadataChangedSchema,
} from "@arbitrator/contracts";
import { Value } from "typebox/value";

import { publish } from "./publisher";

/**
 * Emit `metadata.changed` after a committed mutation. Best-effort and
 * fire-and-forget: the sender reconciles from full desired state, so a lost
 * event only delays convergence.
 */
export async function publishMetadataChanged(
    input: MetadataChangedInput,
): Promise<boolean> {
    const candidate = {
        version: 1 as const,
        occurredAt: new Date().toISOString(),
        ...input,
    };

    if (!Value.Check(metadataChangedSchema, candidate)) {
        return false;
    }

    return publish(RoutingKeys.metadataChanged, candidate, {
        persistent: true,
    });
}
