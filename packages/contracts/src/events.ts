import { type Static, Type as t } from "typebox";

export const metadataEntitySchema = t.Enum([
    "exchange",
    "cryptocurrency",
    "chain",
    "market",
    "chain_link",
]);
export type MetadataEntity = Static<typeof metadataEntitySchema>;

export const metadataActionSchema = t.Enum(["created", "updated", "deleted"]);
export type MetadataAction = Static<typeof metadataActionSchema>;

/**
 * Emitted by lister after a committed mutation. Deliberately coarse: the sender
 * re-queries full desired state, so a missed event is a latency bug, not a
 * correctness bug. The id arrays are hints for a targeted re-query.
 */
export const metadataChangedSchema = t.Object({
    version: t.Literal(1),
    entity: metadataEntitySchema,
    action: metadataActionSchema,
    exchangeIds: t.Optional(t.Array(t.Number())),
    cryptocurrencyIds: t.Optional(t.Array(t.Number())),
    chainIds: t.Optional(t.Array(t.Number())),
    marketIds: t.Optional(t.Array(t.Number())),
    occurredAt: t.String({ format: "date-time" }),
});
export type MetadataChangedEvent = Static<typeof metadataChangedSchema>;

export type MetadataChangedInput = Omit<
    MetadataChangedEvent,
    "version" | "occurredAt"
>;
