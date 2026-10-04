import { listerClient } from "@arbitrator/sdk";

const [error, markets] = await listerClient.market.list({});

if (error) {
  process.exit(1);
}

const [umappedChainExistsError, unmappedChainExists] =
  await listerClient.chain.list({
    searchBy: "code",
    search: "unmapped",
  });
if (umappedChainExistsError) {
  console.error("unmappedChainExistsError", umappedChainExistsError);
  process.exit(1);
}

if (unmappedChainExists.data.length < 1) {
  const [addError, addedChain] = await listerClient.chain.add({
    name: "Unmapped Chain",
    code: "UNMPD",
  });
  console.log("adding", addError, addedChain);
}
console.log("unmappedChainExists", unmappedChainExists);

const [targetChainError, targetChain] = await listerClient.chain.list({
  searchBy: "code",
  search: "UNMPD",
});
console.log(targetChain);
const target = targetChain?.data[0];
console.log(target);
if (targetChainError || !target) {
  console.error("targetChainError", targetChainError);
  process.exit(1);
}

for (const coin of markets) {
  const [error, result] = await listerClient.chainLink.add({
    chainId: target.id,
    marketId: coin.id,
    withdrawEnabled: true,
    depositEnabled: true,
  });
  if (error) {
    console.error("assinging error", error);
  }
  console.log("result", result);
}
