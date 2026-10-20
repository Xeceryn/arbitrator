import { lister } from "@arbitrator/sdk";

import { formatEdenError } from "./client";

const markets = await lister.market.get({ query: {} });

if (markets.error) {
    console.error("marketListError", formatEdenError(markets.error));
    process.exit(1);
}

const unmappedChainExists = await lister.chain.get({
    query: { searchBy: "code", search: "unmapped" },
});
if (unmappedChainExists.error) {
    console.error(
        "unmappedChainExistsError",
        formatEdenError(unmappedChainExists.error),
    );
    process.exit(1);
}

if (unmappedChainExists.data.data.length < 1) {
    const addedChain = await lister.chain.post({
        name: "Unmapped Chain",
        code: "UNMPD",
    });
    console.log("adding", addedChain.error, addedChain.data);
}
console.log("unmappedChainExists", unmappedChainExists.data);

const targetChain = await lister.chain.get({
    query: { searchBy: "code", search: "UNMPD" },
});
console.log(targetChain.data);
const target = targetChain.data?.data[0];
console.log(target);
if (targetChain.error || !target) {
    console.error(
        "targetChainError",
        targetChain.error && formatEdenError(targetChain.error),
    );
    process.exit(1);
}

for (const coin of markets.data) {
    const result = await lister["chain-link"].post({
        chainId: target.id,
        marketId: coin.id,
        withdrawEnabled: true,
        depositEnabled: true,
    });
    if (result.error) {
        console.error("assinging error", formatEdenError(result.error));
    }
    console.log("result", result.data);
}
