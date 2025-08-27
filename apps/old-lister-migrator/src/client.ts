import { createORPCClient, createSafeClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { type RouterClient } from "@orpc/server";
import { router } from "@arbitrator/lister";

const link = new RPCLink({
  url: "http://localhost:3000",
});

const listerUnsafeClient: RouterClient<typeof router> = createORPCClient(link);
export const listerClient = createSafeClient(listerUnsafeClient);
