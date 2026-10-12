import { coinLogoUrl, exchangeLogoUrl } from "./cmc";
import type { ExchangeTarget } from "./config";
import { fetchMarketPairs, type NormalizedMarketPair } from "./market-pairs";
import { fetchCoinMap } from "./metadata";
import type {
    CryptocurrencySnapshot,
    ExchangeSnapshot,
    MarketSnapshot,
    Snapshot,
} from "./types";

/**
 * Scrape every target exchange into a single normalized snapshot: exchanges,
 * their cryptocurrencies, and the market assignments (with per-exchange
 * tickers) that lister consumes.
 *
 * All requests go to CMC's keyless public data-api. Coin identity comes from
 * the coin map, while each market's `exchangeSymbol` comes from that exchange's
 * own market-pairs response.
 */
export async function scrape(targets: ExchangeTarget[]): Promise<Snapshot> {
    const exchanges = new Map<number, ExchangeSnapshot>();
    const markets = new Map<string, MarketSnapshot>();
    const pairInfoById = new Map<number, NormalizedMarketPair>();
    const coinIds = new Set<number>();

    for (const target of targets) {
        console.log(`scraping ${target.slug}...`);
        const page = await fetchMarketPairs(
            target.slug,
            target.quoteCurrencyId,
        );

        exchanges.set(page.exchangeId, {
            cmcId: page.exchangeId,
            name: page.exchangeName,
            slug: page.exchangeSlug,
            logo: exchangeLogoUrl(page.exchangeId),
            baseCurrency: target.baseCurrency,
        });

        for (const pair of page.pairs) {
            const key = `${page.exchangeId}:${pair.baseCurrencyId}`;
            if (!markets.has(key)) {
                markets.set(key, {
                    exchangeCmcId: page.exchangeId,
                    exchangeSlug: page.exchangeSlug,
                    cryptocurrencyCmcId: pair.baseCurrencyId,
                    exchangeSymbol: pair.exchangeSymbol,
                    quoteCurrencyId: target.quoteCurrencyId,
                    tradeEnabled: true,
                });
            }

            coinIds.add(pair.baseCurrencyId);
            if (!pairInfoById.has(pair.baseCurrencyId)) {
                pairInfoById.set(pair.baseCurrencyId, pair);
            }
        }

        console.log(
            `  ${page.exchangeName}: ${page.pairs.length} ${target.baseCurrency} spot pairs`,
        );
    }

    const sortedCoinIds = [...coinIds].sort((a, b) => a - b);
    const coinMap = await fetchCoinMap(coinIds);

    const cryptocurrencies: CryptocurrencySnapshot[] = [];
    for (const id of sortedCoinIds) {
        const meta = coinMap.get(id);
        const fallback = pairInfoById.get(id);

        if (!meta && !fallback) {
            console.warn(`no metadata for coin ${id}; skipping`);
            continue;
        }

        cryptocurrencies.push({
            cmcId: id,
            name: meta?.name ?? fallback?.baseCurrencyName ?? `Coin ${id}`,
            // Fall back to the exchange ticker only if the coin map missed it.
            symbol: meta?.symbol ?? fallback?.exchangeSymbol ?? String(id),
            slug: meta?.slug ?? fallback?.baseCurrencySlug ?? String(id),
            logo: coinLogoUrl(id),
        });
    }

    return {
        scrapedAt: new Date().toISOString(),
        source: "coinmarketcap-public",
        exchanges: [...exchanges.values()],
        cryptocurrencies,
        markets: [...markets.values()],
    };
}
