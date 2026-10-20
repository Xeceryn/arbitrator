import { lister } from "@arbitrator/sdk";

import { errorMessage, formatEdenError } from "./client";
import {
    CoinMarketCapExchange,
    get_exchange_cmc_details,
    get_old_data,
} from "./lib/data-utils";

const ping = await lister.utility.ping.get();
if (ping.error) {
    console.error("Lister service is not online");
    process.exit(1);
}

const raw_markets = await get_exchange_cmc_details();
const old_data = await get_old_data();

raw_markets.forEach(async (market) => {
    const result = await lister.exchange.post({
        name: market.name,
        cmcId: market.id,
        slug: market.slug,
        logo: market.logo,
        baseCurrency:
            market.slug === "indodax" || market.slug === "bittime"
                ? "idr"
                : "usdt",
    });

    if (result.error) {
        const message = errorMessage(result.error);
        if (message !== undefined) {
            console.error(`Error adding ${market.name} because ${message}`);
        } else {
            console.error("something wrong when adding exchange");
            process.exit(1);
        }
    }
    if (result.data) {
        console.log(`Added ${result.data.name}`);
    }
});

// register non cmc exchanges
await lister.exchange.post({
    name: "Pintu Kemana Saja",
    slug: "pintu",
    logo: "https://s2.coinmarketcap.com/static/img/coins/64x64/14179.png",
    cmcId: 42069,
    baseCurrency: "idr",
    registeredOnCmc: false,
});

const exchangeList = await lister.exchange.get({
    query: { limit: -1 },
});
if (exchangeList.error) {
    console.error(formatEdenError(exchangeList.error));
    process.exit(1);
}
const markets = exchangeList.data;
console.log(markets.data.map((x) => x.slug));

// add all old data coins

for (const coin of old_data) {
    await lister.cryptocurrency.post({
        cmcId: coin.cmcId,
        slug: coin.slug,
        name: coin.name,
        logo: coin.logo,
        symbol: coin.symbol,
    });
}

// get all current cryptocurrencies
const coinList = await lister.cryptocurrency.get({ query: { limit: -1 } });
if (coinList.error) {
    console.error("cryptoCurrencyListError", formatEdenError(coinList.error));
    process.exit(1);
}
const coins = coinList.data;
console.log(`total coin in database ${coins.data.length}`);

// manage assignment from old data fields into coins and markets inserted as assignment
for (const coin of old_data) {
    if (coin.indodaxAlternateSymbol !== "") {
        const coinId = coins.data.find((c) => c.slug === coin.slug)!.id;
        const marketId = markets.data.find(
            (m) => m.slug === CoinMarketCapExchange.Indodax,
        )!.id;

        await lister.market.assign.post({
            exchangeId: marketId,
            cryptocurrencyId: coinId,
            exchangeSymbol: coin.indodaxAlternateSymbol,
            tradeEnabled: true,
        });
    }

    if (coin.bittimeAlternateSymbol !== "") {
        const coinId = coins.data.find((c) => c.slug === coin.slug)!.id;
        const marketId = markets.data.find(
            (m) => m.slug === CoinMarketCapExchange.Bittime,
        )!.id;
        await lister.market.assign.post({
            exchangeId: marketId,
            cryptocurrencyId: coinId,
            exchangeSymbol: coin.bittimeAlternateSymbol,
            tradeEnabled: true,
        });
    }

    if (coin.binanceAlternateSymbol !== "") {
        const coinId = coins.data.find((c) => c.slug === coin.slug)!.id;
        const marketId = markets.data.find(
            (m) => m.slug === CoinMarketCapExchange.Binance,
        )!.id;
        await lister.market.assign.post({
            exchangeId: marketId,
            cryptocurrencyId: coinId,
            exchangeSymbol: coin.binanceAlternateSymbol,
            tradeEnabled: true,
        });
    }

    if (coin.kucoinAlternateSymbol !== "") {
        const coinId = coins.data.find((c) => c.slug === coin.slug)!.id;
        const marketId = markets.data.find(
            (m) => m.slug === CoinMarketCapExchange.Kucoin,
        )!.id;
        await lister.market.assign.post({
            exchangeId: marketId,
            cryptocurrencyId: coinId,
            exchangeSymbol: coin.kucoinAlternateSymbol,
            tradeEnabled: true,
        });
    }

    if (coin.gateioAlternateSymbol !== "") {
        const coinId = coins.data.find((c) => c.slug === coin.slug)!.id;
        const marketId = markets.data.find(
            (m) => m.slug === CoinMarketCapExchange.GateIO,
        )!.id;
        await lister.market.assign.post({
            exchangeId: marketId,
            cryptocurrencyId: coinId,
            exchangeSymbol: coin.gateioAlternateSymbol,
            tradeEnabled: true,
        });
    }

    if (coin.okxAlternateSymbol !== "") {
        const coinId = coins.data.find((c) => c.slug === coin.slug)!.id;
        const marketId = markets.data.find(
            (m) => m.slug === CoinMarketCapExchange.Okx,
        )!.id;
        await lister.market.assign.post({
            exchangeId: marketId,
            cryptocurrencyId: coinId,
            exchangeSymbol: coin.okxAlternateSymbol,
            tradeEnabled: true,
        });
    }

    if (coin.bitmartAlternateSymbol !== "") {
        const coinId = coins.data.find((c) => c.slug === coin.slug)!.id;
        const marketId = markets.data.find(
            (m) => m.slug === CoinMarketCapExchange.Bitmart,
        )!.id;
        await lister.market.assign.post({
            exchangeId: marketId,
            cryptocurrencyId: coinId,
            exchangeSymbol: coin.bitmartAlternateSymbol,
            tradeEnabled: true,
        });
    }

    if (coin.huobiAlternateSymbol !== "") {
        const coinId = coins.data.find((c) => c.slug === coin.slug)!.id;
        const marketId = markets.data.find(
            (m) => m.slug === CoinMarketCapExchange.Htx,
        )!.id;
        await lister.market.assign.post({
            exchangeId: marketId,
            cryptocurrencyId: coinId,
            exchangeSymbol: coin.huobiAlternateSymbol,
            tradeEnabled: true,
        });
    }

    if (coin.mexcAlternateSymbol !== "") {
        const coinId = coins.data.find((c) => c.slug === coin.slug)!.id;
        const marketId = markets.data.find(
            (m) => m.slug === CoinMarketCapExchange.MEXC,
        )!.id;
        await lister.market.assign.post({
            exchangeId: marketId,
            cryptocurrencyId: coinId,
            exchangeSymbol: coin.mexcAlternateSymbol,
            tradeEnabled: true,
        });
    }

    if (coin.bitgetAlternateSymbol !== "") {
        const coinId = coins.data.find((c) => c.slug === coin.slug)!.id;
        const marketId = markets.data.find(
            (m) => m.slug === CoinMarketCapExchange.Bitget,
        )!.id;
        await lister.market.assign.post({
            exchangeId: marketId,
            cryptocurrencyId: coinId,
            exchangeSymbol: coin.bitgetAlternateSymbol,
            tradeEnabled: true,
        });
    }

    if (coin.pintuAlternateSymbol !== "") {
        const coinId = coins.data.find((c) => c.slug === coin.slug)!.id;
        const marketId = markets.data.find((m) => m.slug === "pintu")!.id;
        await lister.market.assign.post({
            exchangeId: marketId,
            cryptocurrencyId: coinId,
            exchangeSymbol: coin.pintuAlternateSymbol,
            tradeEnabled: true,
        });
    }
}
console.info("Data seeding completed");

process.exit(0);
