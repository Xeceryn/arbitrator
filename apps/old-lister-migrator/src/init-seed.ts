import { listerClient } from "@arbitrator/sdk";
import { ORPCError } from "@orpc/client";

import {
    CoinMarketCapExchange,
    get_exchange_cmc_details,
    get_old_data,
} from "./lib/data-utils";

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
            market.slug === "indodax" || market.slug === "bittime"
                ? "idr"
                : "usdt",
    });

    if (error) {
        if (error instanceof ORPCError) {
            console.error(
                `Error adding ${market.name} because ${error.message}`,
            );
        } else {
            console.error("something wrong when adding exchange");
            process.exit(1);
        }
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

const [getExchangeError, markets] = await listerClient.exchange.list({
    limit: -1,
});
if (getExchangeError) {
    console.error(getExchangeError);
    process.exit(1);
}
console.log(markets.data.map((x) => x.slug));

// add all old data coins

for (const coin of old_data) {
    await listerClient.cryptocurrency.add({
        cmcId: coin.cmcId,
        slug: coin.slug,
        name: coin.name,
        logo: coin.logo,
        symbol: coin.symbol,
    });
}

// get all current cryptocurrencies
const [cryptoCurrencyListError, coins] = await listerClient.cryptocurrency.list(
    { limit: -1 },
);
if (cryptoCurrencyListError) {
    console.error("cryptoCurrencyListError", cryptoCurrencyListError);
    process.exit(1);
}
console.log(`total coin in database ${coins.data.length}`);

// manage assignment from old data fields into coins and markets inserted as assignment
for (const coin of old_data) {
    if (coin.indodaxAlternateSymbol !== "") {
        const coinId = coins.data.find((c) => c.slug === coin.slug)!.id;
        const marketId = markets.data.find(
            (m) => m.slug === CoinMarketCapExchange.Indodax,
        )!.id;

        await listerClient.market.assign({
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
        await listerClient.market.assign({
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
        await listerClient.market.assign({
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
        await listerClient.market.assign({
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
        await listerClient.market.assign({
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
        await listerClient.market.assign({
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
        await listerClient.market.assign({
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
        await listerClient.market.assign({
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
        await listerClient.market.assign({
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
        await listerClient.market.assign({
            exchangeId: marketId,
            cryptocurrencyId: coinId,
            exchangeSymbol: coin.bitgetAlternateSymbol,
            tradeEnabled: true,
        });
    }

    if (coin.pintuAlternateSymbol !== "") {
        const coinId = coins.data.find((c) => c.slug === coin.slug)!.id;
        const marketId = markets.data.find((m) => m.slug === "pintu")!.id;
        await listerClient.market.assign({
            exchangeId: marketId,
            cryptocurrencyId: coinId,
            exchangeSymbol: coin.pintuAlternateSymbol,
            tradeEnabled: true,
        });
    }
}
console.info("Data seeding completed");

process.exit(0);
