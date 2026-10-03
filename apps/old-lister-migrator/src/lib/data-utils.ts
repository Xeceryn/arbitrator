import type { CmcExchangeDetail, OldActiveCoinData } from "../types";

const cmc_exchange_slugs = [
  "indodax",
  "bittime",

  "binance",
  "kucoin",
  "gate",
  "okx",
  "bitmart",
  "htx",
  "mexc",
  "bitget",
];

export enum CoinMarketCapExchange {
  Indodax = "indodax",
  Bittime = "bittime",
  Binance = "binance",
  Kucoin = "kucoin",
  GateIO = "gate",
  Okx = "okx",
  Bitmart = "bitmart",
  Htx = "htx",
  MEXC = "mexc",
  Bitget = "bitget",
}

/**
 * Fetches the details of the exchanges from coinmarketcap
 */
export async function get_exchange_cmc_details(): Promise<CmcExchangeDetail> {
  const response = await fetch(
    "https://pro-api.coinmarketcap.com/v1/exchange/info" +
      "?slug=" +
      cmc_exchange_slugs.join(","),
    {
      method: "GET",
      headers: {
        "X-CMC_PRO_API_KEY": Bun.env.CMC_API_KEY!,
      },
    },
  );
  if (!response.ok) {
    console.error(`Failed to fetch cmc details: ${response.statusText}`);
    process.exit(1);
  }
  const cmc_details = (await response.json()) as any;
  return Object.values(cmc_details.data) as CmcExchangeDetail;
}

export async function get_old_data() {
  const requestFromOldServices = await fetch(
    "http://192.168.110.120:4000/api/v1/active-coin",
    // "http://192.168.1.4:8080/api/v1/active-coin",
  );
  console.log(requestFromOldServices);

  const { data } = (await requestFromOldServices.json()) as OldActiveCoinData;
  console.log("TOTAL_OLD_DATA", data.length);

  // before insert find any duplicate on slug because it's a unique
  const duplicate = data.filter(
    (coin, index, self) =>
      self.findIndex((t) => t.slug === coin.slug) !== index,
  );
  if (duplicate.length) {
    console.error("Duplicate slug found", duplicate);
    process.exit(1);
  }

  return data;
}
