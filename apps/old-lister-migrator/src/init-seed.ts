import {
  CoinMarketCapExchange,
  get_exchange_cmc_details,
  get_old_data,
} from "./lib/data-utils";
import { listerClient } from "./client";
import { ORPCError } from "@orpc/client";

const [pingError] = await listerClient.utility.ping();
if (pingError) {
  console.error("Lister service is not online");
  process.exit(1);
}

const raw_markets = await get_exchange_cmc_details();
const old_data = await get_old_data();

raw_markets.forEach(async (market) => {
  const [error, result] = await listerClient.exchange.add({
    name: market.name,
    cmcId: market.id,
    slug: market.slug,
    logo: market.logo,
    baseCurrency:
      market.slug === "indodax" || market.slug === "bittime" ? "idr" : "usdt",
  });

  if (error) {
    if (error instanceof ORPCError) {
      console.error(`Error adding ${market.name} because ${error.message}`);
    }
    process.exit(1);
  }
  if (result) {
    console.log(`Added ${result.name}`);
  }
});

// register non cmc exchanges
await listerClient.exchange.add({
  name: "Pintu Kemana Saja",
  slug: "pintu",
  logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/14179.png",
  cmcId: 42069,
  baseCurrency: "idr",
  registeredOnCmc: false,
});

const [getExchangeError, markets] = await listerClient.exchange.list();
if (getExchangeError) {
  console.error(getExchangeError);
  process.exit(1);
}

const [error, coins] = await listerClient.cryptocurrency.list();
if (error) {
  console.error(error);
  process.exit(1);
}

// const coins = await db.query.coinSchema.findMany();
// const markets = await db.query.marketSchema.findMany();

// manage assignment from old data fields into coins and markets inserted as assignment
// for (const coin of old_data) {
//   if (coin.indodaxAlternateSymbol !== "") {
//     const coinId = coins.find((c) => c.slug === coin.slug)!.id;
//     const marketId = markets.find(
//       (m) => m.slug === CoinMarketCapExchange.Indodax,
//     )!.id;
//     let notes = "";
//     if (coin.reason.toLowerCase().includes("indodax")) {
//       notes += coin.reason;
//     }
//     await db
//       .insert(coinToMarketAssignment)
//       .values({
//         coinId,
//         marketId,
//         marketSymbol: coin.indodaxAlternateSymbol,
//         active: coin.indodax,
//       })
//       .onConflictDoNothing()
//       .execute();
//   }
//
//   if (coin.bittimeAlternateSymbol !== "") {
//     const coinId = coins.find((c) => c.slug === coin.slug)!.id;
//     const marketId = markets.find(
//       (m) => m.slug === CoinMarketCapExchange.Bittime,
//     )!.id;
//     let notes = "";
//     if (coin.reason.toLowerCase().includes("bittime")) {
//       notes += coin.reason;
//     }
//     await db
//       .insert(coinToMarketAssignment)
//       .values({
//         coinId,
//         marketId,
//         marketSymbol: coin.bittimeAlternateSymbol,
//         active: coin.bittime,
//         notes: notes === "" ? null : notes,
//       })
//       .onConflictDoNothing()
//       .execute();
//   }
//
//   if (coin.binanceAlternateSymbol !== "") {
//     const coinId = coins.find((c) => c.slug === coin.slug)!.id;
//     const marketId = markets.find(
//       (m) => m.slug === CoinMarketCapExchange.Binance,
//     )!.id;
//     let notes = "";
//     if (coin.reason.toLowerCase().includes("binance")) {
//       notes += coin.reason;
//     }
//     await db
//       .insert(coinToMarketAssignment)
//       .values({
//         coinId,
//         marketId,
//         marketSymbol: coin.binanceAlternateSymbol,
//         active: coin.binance,
//         notes: notes === "" ? null : notes,
//       })
//       .onConflictDoNothing()
//       .execute();
//   }
//
//   if (coin.kucoinAlternateSymbol !== "") {
//     const coinId = coins.find((c) => c.slug === coin.slug)!.id;
//     const marketId = markets.find(
//       (m) => m.slug === CoinMarketCapExchange.Kucoin,
//     )!.id;
//     let notes = "";
//     if (coin.reason.toLowerCase().includes("kucoin")) {
//       notes += coin.reason;
//     }
//     await db
//       .insert(coinToMarketAssignment)
//       .values({
//         coinId,
//         marketId,
//         marketSymbol: coin.kucoinAlternateSymbol,
//         active: coin.kucoin,
//         notes: notes === "" ? null : notes,
//       })
//       .onConflictDoNothing()
//       .execute();
//   }
//
//   if (coin.gateioAlternateSymbol !== "") {
//     const coinId = coins.find((c) => c.slug === coin.slug)!.id;
//     const marketId = markets.find(
//       (m) => m.slug === CoinMarketCapExchange.GateIO,
//     )!.id;
//     let notes = "";
//     if (coin.reason.toLowerCase().includes("gateio")) {
//       notes += coin.reason;
//     }
//     await db
//       .insert(coinToMarketAssignment)
//       .values({
//         coinId,
//         marketId,
//         marketSymbol: coin.gateioAlternateSymbol,
//         active: coin.gateio,
//         notes: notes === "" ? null : notes,
//       })
//       .onConflictDoNothing()
//       .execute();
//   }
//
//   if (coin.okxAlternateSymbol !== "") {
//     const coinId = coins.find((c) => c.slug === coin.slug)!.id;
//     const marketId = markets.find(
//       (m) => m.slug === CoinMarketCapExchange.Okx,
//     )!.id;
//     let notes = "";
//     if (coin.reason.toLowerCase().includes("okx")) {
//       notes += coin.reason;
//     }
//     await db
//       .insert(coinToMarketAssignment)
//       .values({
//         coinId,
//         marketId,
//         marketSymbol: coin.okxAlternateSymbol,
//         active: coin.okx,
//         notes: notes === "" ? null : notes,
//       })
//       .onConflictDoNothing()
//       .execute();
//   }
//
//   if (coin.bitmartAlternateSymbol !== "") {
//     const coinId = coins.find((c) => c.slug === coin.slug)!.id;
//     const marketId = markets.find(
//       (m) => m.slug === CoinMarketCapExchange.Bitmart,
//     )!.id;
//     let notes = "";
//     if (coin.reason.toLowerCase().includes("bitmart")) {
//       notes += coin.reason;
//     }
//     await db
//       .insert(coinToMarketAssignment)
//       .values({
//         coinId,
//         marketId,
//         marketSymbol: coin.bitmartAlternateSymbol,
//         active: coin.bitmart,
//         notes: notes === "" ? null : notes,
//       })
//       .onConflictDoNothing()
//       .execute();
//   }
//
//   if (coin.huobiAlternateSymbol !== "") {
//     const coinId = coins.find((c) => c.slug === coin.slug)!.id;
//     const marketId = markets.find(
//       (m) => m.slug === CoinMarketCapExchange.Htx,
//     )!.id;
//     let notes = "";
//     if (coin.reason.toLowerCase().includes("huobi")) {
//       notes += coin.reason;
//     }
//     await db
//       .insert(coinToMarketAssignment)
//       .values({
//         coinId,
//         marketId,
//         marketSymbol: coin.huobiAlternateSymbol,
//         active: coin.huobi,
//         notes: notes === "" ? null : notes,
//       })
//       .onConflictDoNothing()
//       .execute();
//   }
//
//   if (coin.mexcAlternateSymbol !== "") {
//     const coinId = coins.find((c) => c.slug === coin.slug)!.id;
//     const marketId = markets.find(
//       (m) => m.slug === CoinMarketCapExchange.MEXC,
//     )!.id;
//     let notes = "";
//     if (coin.reason.toLowerCase().includes("mexc")) {
//       notes += coin.reason;
//     }
//     await db
//       .insert(coinToMarketAssignment)
//       .values({
//         coinId,
//         marketId,
//         marketSymbol: coin.mexcAlternateSymbol,
//         active: coin.mexc,
//         notes: notes === "" ? null : notes,
//       })
//       .onConflictDoNothing()
//       .execute();
//   }
//
//   if (coin.bitgetAlternateSymbol !== "") {
//     const coinId = coins.find((c) => c.slug === coin.slug)!.id;
//     const marketId = markets.find(
//       (m) => m.slug === CoinMarketCapExchange.Bitget,
//     )!.id;
//     let notes = "";
//     if (coin.reason.toLowerCase().includes("bitget")) {
//       notes += coin.reason;
//     }
//     await db
//       .insert(coinToMarketAssignment)
//       .values({
//         coinId,
//         marketId,
//         marketSymbol: coin.bitgetAlternateSymbol,
//         active: coin.bitget,
//         notes: notes === "" ? null : notes,
//       })
//       .onConflictDoNothing()
//       .execute();
//   }
// }
// console.info("Data seeding completed");

process.exit(0);
