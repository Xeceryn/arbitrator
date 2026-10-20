import { lister } from "@arbitrator/sdk";
import { Elysia } from "elysia";

import { senderClient } from "../sender.client";

/**
 * Provides the lister (Eden) and sender (Eden) clients to every handler through
 * context. Registered globally so controllers never import the clients.
 */
export const clientsPlugin = new Elysia({ name: "clients" }).decorate({
    lister,
    sender: senderClient,
});

export type AppClients = {
    lister: typeof lister;
    sender: typeof senderClient;
};
