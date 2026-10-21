import { lister } from "@arbitrator/sdk";
import { Elysia } from "elysia";

/**
 * Resource plugin: the Eden treaty client to lister, decorated on the context as
 * `lister` so handlers and other plugins read it from `context` instead of
 * importing the SDK singleton in a handler body.
 *
 * The same instance is handed to the orchestrator at bootstrap (`app.ts`), so
 * both sides talk to the one treaty client (and resolve the one `elysia` copy).
 * Every call returns `{ data, error }`; Eden rejects on transport errors.
 */
export const listerClient = lister;

export const listerPlugin = new Elysia({ name: "lister" }).decorate(
    "lister",
    listerClient,
);
