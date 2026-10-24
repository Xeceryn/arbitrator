import { coinLogoUrl, exchangeLogoUrl } from "./cmc";
import {
    type CmcExchangeTarget,
    type ExchangeTarget,
    type IndodaxExchangeTarget,
    QuoteCurrency,
} from "./config";
import { fetchIndodaxPairs, normalizeIndodaxPairs } from "./indodax";
import { fetchMarketPairs } from "./market-pairs";
import { fetchCoinMap } from "./metadata";
import type {
    CryptocurrencySnapshot,
    ExchangeSnapshot,
    MarketSnapshot,
    Snapshot,
} from "./types";

/** Coin metadata used when CMC's coin map does not know an id. */
type CoinFallback = {
    name: string;
    symbol: string;
    slug: string;
    logo: string;
};

type TargetResult = {
    exchange: ExchangeSnapshot;
    markets: MarketSnapshot[];
    coins: Map<number, CoinFallback>;
};

/**
 * Scrape every target exchange into a single normalized snapshot: exchanges,
 * their cryptocurrencies, and the market assignments (with per-exchange
 * tickers) that lister consumes.
 *
 * Most venues come from CMC's keyless public data-api: coin identity from the
 * coin map, each market's `exchangeSymbol` from that exchange's own
 * market-pairs response. Indodax is scraped from its own `api/pairs` endpoint
 * because CMC does not carry the ticker Indodax's websocket uses (see
 * `src/indodax.ts`).
 */
export async function scrape(targets: ExchangeTarget[]): Promise<Snapshot> {
    const exchanges = new Map<number, ExchangeSnapshot>();
    const markets = new Map<string, MarketSnapshot>();
    const fallbacks = new Map<number, CoinFallback>();

    for (const target of targets) {
        console.log(`scraping ${target.slug}...`);
        const result =
            target.source === "indodax"
                ? await scrapeIndodax(target)
                : await scrapeCmc(target);

        // An exchange that returned nothing is omitted from the snapshot: the
        // importer leaves exchanges it does not know about untouched, so a
        // transient empty upstream response cannot disable a whole venue.
        if (!result) continue;

        exchanges.set(result.exchange.cmcId, result.exchange);

        for (const market of result.markets) {
            const key = `${market.exchangeCmcId}:${market.cryptocurrencyCmcId}`;
            if (!markets.has(key)) markets.set(key, market);
        }

        for (const [cmcId, fallback] of result.coins) {
            if (!fallbacks.has(cmcId)) fallbacks.set(cmcId, fallback);
        }

        console.log(
            `  ${result.exchange.name}: ${result.markets.length} ${target.baseCurrency} spot pairs`,
        );
    }

    const sortedCoinIds = [...fallbacks.keys()].sort((a, b) => a - b);
    const coinMap = await fetchCoinMap(new Set(sortedCoinIds));

    const cryptocurrencies: CryptocurrencySnapshot[] = [];
    for (const id of sortedCoinIds) {
        const meta = coinMap.get(id);
        const fallback = fallbacks.get(id);

        if (!meta && !fallback) {
            console.warn(`no metadata for coin ${id}; skipping`);
            continue;
        }

        cryptocurrencies.push({
            cmcId: id,
            name: meta?.name ?? fallback?.name ?? `Coin ${id}`,
            // Fall back to the exchange ticker only if the coin map missed it.
            symbol: meta?.symbol ?? fallback?.symbol ?? String(id),
            slug: meta?.slug ?? fallback?.slug ?? String(id),
            logo: meta ? coinLogoUrl(id) : fallback?.logo || coinLogoUrl(id),
        });
    }

    return {
        scrapedAt: new Date().toISOString(),
        source: snapshotSource(targets),
        exchanges: [...exchanges.values()],
        cryptocurrencies,
        markets: [...markets.values()],
    };
}

/** Which sources actually contributed to this snapshot. */
function snapshotSource(targets: ExchangeTarget[]): Snapshot["source"] {
    const cmc = targets.some((target) => target.source === "cmc");
    const indodax = targets.some((target) => target.source === "indodax");

    if (cmc && indodax) return "coinmarketcap-public+indodax-public";
    if (indodax) return "indodax-public";
    return "coinmarketcap-public";
}

/** A CMC-sourced venue: one market-pairs walk, quoted in the target currency. */
async function scrapeCmc(
    target: CmcExchangeTarget,
): Promise<TargetResult | undefined> {
    const page = await fetchMarketPairs(target.slug, target.quoteCurrencyId);

    if (page.pairs.length === 0) {
        console.warn(
            `  ${page.exchangeName}: no ${target.baseCurrency} spot pairs ` +
                "returned; skipping (existing lister rows stay untouched)",
        );
        return undefined;
    }

    const markets: MarketSnapshot[] = [];
    const coins = new Map<number, CoinFallback>();

    for (const pair of page.pairs) {
        markets.push({
            exchangeCmcId: page.exchangeId,
            exchangeSlug: page.exchangeSlug,
            cryptocurrencyCmcId: pair.baseCurrencyId,
            exchangeSymbol: pair.exchangeSymbol,
            quoteCurrencyId: target.quoteCurrencyId,
            tradeEnabled: true,
        });

        if (!coins.has(pair.baseCurrencyId)) {
            coins.set(pair.baseCurrencyId, {
                name: pair.baseCurrencyName ?? `Coin ${pair.baseCurrencyId}`,
                symbol: pair.exchangeSymbol,
                slug: pair.baseCurrencySlug ?? String(pair.baseCurrencyId),
                logo: coinLogoUrl(pair.baseCurrencyId),
            });
        }
    }

    return {
        exchange: {
            cmcId: page.exchangeId,
            name: page.exchangeName,
            slug: page.exchangeSlug,
            logo: exchangeLogoUrl(page.exchangeId),
            baseCurrency: target.baseCurrency,
        },
        markets,
        coins,
    };
}

/**
 * Indodax: one pair list, no pagination. The display ticker becomes
 * `exchangeSymbol`; `is_market_suspended` disables trading and `is_maintenance`
 * flags the market so the importer suspends all of its chain links.
 */
async function scrapeIndodax(
    target: IndodaxExchangeTarget,
): Promise<TargetResult | undefined> {
    const pairs = await fetchIndodaxPairs();
    const { coins, skipped } = normalizeIndodaxPairs(pairs);

    for (const item of skipped) {
        console.warn(`  skipping indodax pair ${item.id}: ${item.reason}`);
    }

    if (coins.length === 0) {
        console.warn(
            "  Indodax: no IDR pairs returned; skipping " +
                "(existing lister rows stay untouched)",
        );
        return undefined;
    }

    const markets: MarketSnapshot[] = coins.map((coin) => ({
        exchangeCmcId: target.exchangeCmcId,
        exchangeSlug: target.slug,
        cryptocurrencyCmcId: coin.cmcId,
        exchangeSymbol: coin.exchangeSymbol,
        quoteCurrencyId: QuoteCurrency.IDR,
        tradeEnabled: coin.tradeEnabled,
        chainSuspended: coin.chainSuspended,
        depositEnabled: coin.depositEnabled,
    }));

    return {
        exchange: {
            cmcId: target.exchangeCmcId,
            name: target.name,
            slug: target.slug,
            logo: exchangeLogoUrl(target.exchangeCmcId),
            baseCurrency: target.baseCurrency,
        },
        markets,
        coins: new Map(
            coins.map((coin) => [
                coin.cmcId,
                {
                    name: coin.name,
                    symbol: coin.exchangeSymbol,
                    slug: coin.slug,
                    logo: coin.logo,
                },
            ]),
        ),
    };
}
