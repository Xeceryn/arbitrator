import { env } from "@arbitrator/env-loader";
import type { router } from "@arbitrator/lister/router";
import { createORPCClient, createSafeClient } from "@orpc/client";
import {} from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { type RouterClient } from "@orpc/server";

const url = () => env.LISTER_URL;

const link = new RPCLink({
    fetch: fetch,
    url: "/",
    origin: url(),
});

const listerUnsafeClient: RouterClient<typeof router> = createORPCClient(link);

export const listerClient = createSafeClient(listerUnsafeClient);
