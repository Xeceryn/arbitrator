import { createORPCClient, createSafeClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { type RouterClient } from "@orpc/server";
import { router } from "@arbitrator/lister";
import { EnvLoader } from "@arbitrator/env-loader";

const link = new RPCLink({
  url: EnvLoader.LISTER_HOST_FROM_CLIENT,
});

const listerUnsafeClient: RouterClient<typeof router> = createORPCClient(link);
export const listerClient = createSafeClient(listerUnsafeClient);

const idButton = document.getElementById("test");
idButton?.addEventListener("click", async () => {
  const [error, data] = await listerClient.exchange.list();
  if (error) {
    console.log(error.message);
  }
  console.log(data);
});
