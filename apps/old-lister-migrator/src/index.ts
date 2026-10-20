import { lister } from "@arbitrator/sdk";

import { formatEdenError } from "./client";

const coins = await lister.cryptocurrency.get({ query: {} });
if (coins.error) {
    console.log(formatEdenError(coins.error));
}
