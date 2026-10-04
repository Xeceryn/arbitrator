import {
  type MetadataChangedInput,
  Subjects,
  metadataChangedSchema,
} from "@arbitrator/contracts";

import { publish } from "./nats";

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

  const parsed = metadataChangedSchema.safeParse(candidate);
  if (!parsed.success) {
    return false;
  }

  return publish(Subjects.metadataChanged, parsed.data);
}
