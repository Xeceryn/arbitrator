import { EnvLoader } from "@arbitrator/env-loader";
import { router } from "@arbitrator/lister/router";
import { createORPCClient, createSafeClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { type RouterClient } from "@orpc/server";

const url = () => {
  return process.env.LISTER_URL || "http://localhost:3001";
};

const link = new RPCLink({
  url: url(),
  fetch: fetch,
});

const listerUnsafeClient: RouterClient<typeof router> = createORPCClient(link);
export const listerClient = createSafeClient(listerUnsafeClient);
