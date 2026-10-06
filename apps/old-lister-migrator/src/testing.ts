import { get_exchange_cmc_details } from "./lib/data-utils";

const exchanges = await get_exchange_cmc_details();
console.log(exchanges.find((e) => e.slug === "indodax"));
