import { Elysia } from "elysia";

import { publishMetadataChanged } from "../events";

/**
 * Side-channel resources for route handlers. Mutations call
 * `void events.publishMetadataChanged({...})` from the handler context instead
 * of importing the events module, so the HTTP edge declares its dependencies.
 */
export const eventsPlugin = new Elysia({ name: "events" }).decorate("events", {
    publishMetadataChanged,
});
