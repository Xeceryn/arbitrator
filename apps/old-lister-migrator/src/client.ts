import { router } from "@arbitrator/lister/router";
import { createORPCClient, createSafeClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";

const link = new RPCLink({
  url: "http://localhost:3001",
});
