import { createORPCClient, createSafeClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { type RouterClient } from "@orpc/server";
import { router } from "@arbitrator/lister";

const link = new RPCLink({
  url: "http://localhost:3000",
});

const a = createORPCClient<RouterClient<typeof router>>(link);

const client = createSafeClient(
  createORPCClient<RouterClient<typeof router>>(link),
);

const [error, result] = await client.exchange.list();
if (error) {
  console.log(error.message);
}
console.log(result);
