import z from "zod";

export const metadataEntitySchema = z.enum([
  "exchange",
  "cryptocurrency",
  "chain",
  "market",
  "chain_link",
]);
export type MetadataEntity = z.infer<typeof metadataEntitySchema>;

export const metadataActionSchema = z.enum(["created", "updated", "deleted"]);
export type MetadataAction = z.infer<typeof metadataActionSchema>;

/**
 * Emitted by lister after a committed mutation. Deliberately coarse: the sender
 * re-queries full desired state, so a missed event is a latency bug, not a
 * correctness bug. The id arrays are hints for a targeted re-query.
 */
export const metadataChangedSchema = z.object({
  version: z.literal(1),
  entity: metadataEntitySchema,
  action: metadataActionSchema,
  exchangeIds: z.array(z.number()).optional(),
  cryptocurrencyIds: z.array(z.number()).optional(),
  chainIds: z.array(z.number()).optional(),
  marketIds: z.array(z.number()).optional(),
  occurredAt: z.string().datetime(),
});
export type MetadataChangedEvent = z.infer<typeof metadataChangedSchema>;

export type MetadataChangedInput = Omit<
  MetadataChangedEvent,
  "version" | "occurredAt"
>;
