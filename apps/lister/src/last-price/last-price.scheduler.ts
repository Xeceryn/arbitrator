import { lastPriceKey } from "@arbitrator/contracts";
import { redis } from "bun";

import { logger } from "../logger";

/** Indodax publishes every IDR pair with its most recent traded price. */
const INDODAX_TICKER_ALL_URL = "https://indodax.com/api/ticker_all";

/** Keep the cache warm: the receiver tolerates staleness, not downtime. */
const REFRESH_CRON = "*/5 * * * *";

type IndodaxTickerAllResponse = {
    tickers: Record<string, { last: string }>;
};

/**
 * Refresh the last-price cache from Indodax. Every `<symbol>_idr` ticker
 * becomes a `last-price:<symbol>` entry holding its latest price in IDR.
 */
export async function refreshLastPrices(): Promise<void> {
    const response = await fetch(INDODAX_TICKER_ALL_URL);
    if (!response.ok) {
        throw new Error(`indodax ticker_all responded ${response.status}`);
    }
    const data = (await response.json()) as IndodaxTickerAllResponse;

    const writes: Promise<unknown>[] = [];
    let written = 0;
    for (const [pair, ticker] of Object.entries(data.tickers)) {
        if (!pair.endsWith("_idr")) continue;

        const price = Number(ticker.last);
        if (!Number.isFinite(price) || price <= 0) continue;

        const symbol = pair.slice(0, -"_idr".length);
        writes.push(redis.set(lastPriceKey(symbol), String(price)));
        written++;
    }
    await Promise.all(writes);

    logger.info(`last prices refreshed from indodax (${written} symbols)`);
}

/**
 * Start the last-price refresh loop. Runs once immediately so a fresh cache is
 * available without waiting for the first tick, then every five minutes.
 */
export function startLastPriceScheduler(): void {
    void refreshLastPrices().catch((error) => {
        logger.warn(`initial last price refresh failed: ${String(error)}`);
    });

    Bun.cron(REFRESH_CRON, async () => {
        try {
            await refreshLastPrices();
        } catch (error) {
            // Keep the previous prices; stale beats empty.
            logger.warn(`last price refresh failed: ${String(error)}`);
        }
    });
}
