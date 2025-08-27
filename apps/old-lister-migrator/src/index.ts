import { createORPCClient, createSafeClient, onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { type RouterClient } from "@orpc/server";
import { router } from "@arbitrator/lister";

const link = new RPCLink({
  url: "http://localhost:3000",
});

// Create a client for your router
const unsafeClient: RouterClient<typeof router> = createORPCClient(link);
const client = createSafeClient(unsafeClient);

const [error, result] = await client.exchange.list();
if (error) {
  console.log(error.message);
}
console.log(result);
// console.log(result);
// Or, create a client using a contract
