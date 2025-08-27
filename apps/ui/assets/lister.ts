import { createORPCClient, createSafeClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { type RouterClient } from "@orpc/server";
import { router } from "@arbitrator/lister";

const link = new RPCLink({
  url: "http://localhost:3000",
});

const listerUnsafeClient: RouterClient<typeof router> = createORPCClient(link);
export const listerClient = createSafeClient(listerUnsafeClient);

const idButton = document.getElementById("test");
idButton?.addEventListener("click", async () => {
  const [error, data] = await listerClient.exchange.findById(2);
  if (error) {
    console.log(error.message);
  }
  console.log(data);
});
