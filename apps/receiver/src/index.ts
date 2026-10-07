import { type NormalizedOrderbookEvent, Queues } from "@arbitrator/contracts";
import { Opportunity } from "@arbitrator/lister/core/opportunity/opportunity";
import { createLogger } from "@arbitrator/logger";
import { type Delivery, subscribe } from "@arbitrator/messaging";
import { listerClient } from "@arbitrator/sdk";
import { RedisClient } from "bun";

const logger = createLogger("arbitrator/receiver");

const [error, exchanges] = await listerClient.exchange.list({ limit: -1 });
if (error) {
    process.exit(1);
}
const exchangeSlugIdMap = new Map<string, number>();
/** Exchanges that already quote prices in IDR (e.g. Indodax). */
const idrExchangeSlugs = new Set<string>();
for (const exchange of exchanges.data) {
    exchangeSlugIdMap.set(exchange.slug, exchange.id);
    if (exchange.baseCurrency === "idr") idrExchangeSlugs.add(exchange.slug);
}
const IDR_PRICE = 17869 as const;
const CACHED_IDR_TTL = 1000 * 60 * 5;
let cachedAt: number = 0;

export async function getIdrPrice(): Promise<number> {
    const now = Date.now();
    if (now - cachedAt < CACHED_IDR_TTL) {
        return IDR_PRICE;
    }
    const idrPrice = await Promise.resolve(IDR_PRICE);
    cachedAt = now;

    return idrPrice;
}

export type SearchedOrderbook = {
    cmcId: number;
    buyPrice: number;
    sellPrice: number;
    buyVolume: number;
    sellVolume: number;
};

export async function convertPrice(
    orderbook: NormalizedOrderbookEvent,
    // for a case like currencies like 1mbabydoge, 1000sats etc.
    divider?: number,
): Promise<NormalizedOrderbookEvent> {
    // IDR-quoted exchanges (e.g. Indodax) already publish prices in IDR, so there
    // is nothing to convert: leave the book untouched for search/storage.
    if (idrExchangeSlugs.has(orderbook.exchange)) {
        return orderbook;
    }

    const idrPrice = await getIdrPrice();

    const asks = orderbook.asks;
    for (let i = 0, len = asks.length; i < len; i++) {
        if (divider) {
            asks[i]![0] *= divider / idrPrice;
            continue;
        }
        asks[i]![0] *= idrPrice;
    }

    const bids = orderbook.bids;
    for (let i = 0, len = bids.length; i < len; i++) {
        if (divider) {
            bids[i]![0] *= divider / idrPrice;
            continue;
        }
        bids[i]![0] *= idrPrice;
    }

    return orderbook;
}

const SEARCH_VOLUME_TARGET = 2_000_000;
export function searchOrderbook(
    orderbook: NormalizedOrderbookEvent,
): SearchedOrderbook {
    const bids = orderbook.bids;
    const asks = orderbook.asks;

    // IDR-quoted exchanges publish `[price, idr_volume]`, so the second value is
    // already the IDR notional. USDT-quoted books are converted to IDR and carry
    // base volume, so their product is the IDR notional.
    const isIdrQuoted = idrExchangeSlugs.has(orderbook.exchange);

    let buyVolume = 0;
    let buyPrice = 0;

    for (let i = 0, len = bids.length; i < len; i++) {
        const level = bids[i]!;

        buyVolume += isIdrQuoted ? level[1] : level[0] * level[1];

        if (buyVolume >= SEARCH_VOLUME_TARGET) {
            buyPrice = level[0];
            break;
        }
    }

    let sellVolume = 0;
    let sellPrice = 0;

    for (let i = 0, len = asks.length; i < len; i++) {
        const level = asks[i]!;

        sellVolume += isIdrQuoted ? level[1] : level[0] * level[1];

        if (sellVolume >= SEARCH_VOLUME_TARGET) {
            sellPrice = level[0];
            break;
        }
    }

    return {
        cmcId: orderbook.cmcId,
        buyPrice,
        sellPrice,
        buyVolume,
        sellVolume,
    };
}

async function processOrderbook(
    orderbook: NormalizedOrderbookEvent,
    // for a case like currencies like 1mbabydoge, 1000sats etc.
    exchangeId: number,
    divider?: number,
) {
    const converted = await convertPrice(orderbook, divider);
    const searched = searchOrderbook(converted);

    await Promise.all([
        Opportunity.updateBuySide({
            exchangeId,
            cmcId: searched.cmcId,
            price: searched.sellPrice,
            volume: searched.sellVolume,
        }),
        Opportunity.updateSellSide({
            cmcId: searched.cmcId,
            price: searched.buyPrice,
            volume: searched.buyVolume,
            exchangeId,
        }),
    ]);
}

/**
 * Handle one orderbook snapshot end to end. Ack only after the DB write
 * succeeds; a throw leaves the message unacked so the broker redelivers it.
 */
async function handle(delivery: Delivery): Promise<void> {
    const orderbook = delivery.json<NormalizedOrderbookEvent>();
    // The sender carries the canonical exchange identity on the payload, so we
    // never parse routing-key tokens here.
    const exchangeId = exchangeSlugIdMap.get(orderbook.exchange);
    if (exchangeId === undefined) {
        logger.warn(
            `dropping orderbook for unknown exchange: ${orderbook.exchange}`,
        );
        delivery.ack();
        return;
    }

    // binance has some special multipleid volumes, so we need to divide it.
    let divider: number | undefined;
    if (orderbook.exchange === "binance") {
        // 1mbabydoge 1 million of babydoge
        if (orderbook.cmcId === 10407) divider = 1_000_000;
        // 1000sats 1000 of sats
        else if (orderbook.cmcId === 28194) divider = 1000;
        // 1000cheems 100 of cheems
        else if (orderbook.cmcId === 33280) divider = 1000;
        // 1000cat 1000 of cat
        else if (orderbook.cmcId === 32724) divider = 1000;
    }

    await processOrderbook(orderbook, exchangeId, divider);
    delivery.ack();
}

// One durable queue per exchange (`arbitrator.orderbook.<exchange>`), declared
// by the receiver on startup and never auto-deleted. Sender workers send
// straight to their exchange's queue, so a slow exchange cannot head-of-line
// block the others and the broker keeps a per-exchange backlog while no
// receiver is up. `main.ts` runs one of these per CPU, so every process competes
// on every queue.
const subscriptions = exchanges.data.map((exchange) => {
    const queue = Queues.orderbookFor(exchange.slug);
    const consumer = subscribe({
        queue,
        prefetch: 64,
        durable: true,
    });
    logger.info(`receiver-${process.pid} listening on ${queue}`);
    return consumer;
});

await Promise.all(
    subscriptions.map(async (consumer) => {
        for await (const delivery of consumer) {
            await handle(delivery);
        }
    }),
);
