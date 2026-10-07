// import { router } from "@arbitrator/lister/router";
// import { createORPCClient, createSafeClient } from "@orpc/client";
// import { RPCLink } from "@orpc/client/fetch";
// import { type RouterClient } from "@orpc/server";
//
// const link = new RPCLink({
//   url: "http://localhost:3001",
// });
//
// const a = createORPCClient<RouterClient<typeof router>>(link);
//
// const client = createSafeClient(
//   createORPCClient<RouterClient<typeof router>>(link),
// );
// const [error, result] = await client.cryptocurrency.list({ limit: 10 });
// if (error) {
//   console.log(error.message);
// }
// console.log(result);

import { listerClient } from "@arbitrator/sdk";

const result = await listerClient.cryptocurrency.list({});
if (result.error) {
    console.log(result.error.message);
}
if (result.definedError) {
}
