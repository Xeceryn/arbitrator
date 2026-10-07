import {
    type NormalizedOrderbookEvent,
    Queues,
    RoutingKeys,
} from "@arbitrator/contracts";
import { Opportunity } from "@arbitrator/lister/core/opportunity/opportunity";
import { createLogger } from "@arbitrator/logger";
import { subscribe } from "@arbitrator/messaging";
import { listerClient } from "@arbitrator/sdk";

const logger = createLogger("arbitrator/receiver");

// ---------------------------------------------------------------- config
const SEARCH_VOLUME_TARGET = 2_000_000;
const FLUSH_MS = 50; // how often pending markets are pushed to the DB
const MAX_INFLIGHT = 64; // max concurrent market writes per process
const STATS_MS = 1000;
const SHUTDOWN_TIMEOUT_MS = 5000;

// binance quotes some tickers per 1M / per 1000 units.
const DIVIDERS: Record<string, Record<number, number>> = {
    binance: {
        10407: 1_000_000, // 1mbabydoge
        28194: 1000, // 1000sats
        33280: 1000, // 1000cheems
    },
};

// ---------------------------------------------------------------- startup
const [error, exchanges] = await listerClient.exchange.list({ limit: -1 });
if (error) {
    logger.error(`failed to load exchanges: ${String(error)}`);
    process.exit(1);
}
const exchangeSlugIdMap = new Map<string, number>();
for (const exchange of exchanges.data) {
    exchangeSlugIdMap.set(exchange.slug, exchange.id);
}

// ---------------------------------------------------------------- idr rate
const IDR_REFRESH_MS = 1000 * 60 * 5;
const IDR_FALLBACK = 17950;

// Swap the body for Redis later, nothing else changes.
// e.g. const v = await redis.get("idr:price"); return Number(v);
async function fetchIdrPrice(): Promise<number> {
    return IDR_FALLBACK;
}

let idrRate = IDR_FALLBACK; // hot path reads this directly, never awaits
let refreshing = false;

async function refreshIdrRate() {
    if (refreshing) return; // don't overlap if a fetch is slow
    refreshing = true;
    try {
        const next = await fetchIdrPrice();
        if (Number.isFinite(next) && next > 0) {
            idrRate = next;
        } else {
            logger.warn(`ignoring invalid idr price: ${next}`);
        }
    } catch (e) {
        // keep the last good value; stale beats crashing or zeroing prices
        logger.warn(`idr refresh failed, keeping ${idrRate}: ${String(e)}`);
    } finally {
        refreshing = false;
    }
}

await refreshIdrRate(); // load once before we start consuming
setInterval(refreshIdrRate, IDR_REFRESH_MS);

// ---------------------------------------------------------------- stats
const c = {
    received: 0, // messages pulled off RabbitMQ
    unknown: 0, // dropped: unknown exchange
    computed: 0, // convert+search runs (one fused pass)
    unchanged: 0, // skipped: same result as last accepted one
    coalesced: 0, // overwrote a pending (not yet written) snapshot
    upserted: 0, // market writes that COMPLETED
    errors: 0, // decode or DB failures
};

function resetStats() {
    c.received = c.unknown = c.computed = 0;
    c.unchanged = c.coalesced = c.upserted = c.errors = 0;
}

let lastStatsAt = performance.now();
setInterval(() => {
    const now = performance.now();
    const elapsedMs = now - lastStatsAt;
    const sec = elapsedMs / 1000;
    const lagMs = Math.max(0, elapsedMs - STATS_MS); // event loop lag
    lastStatsAt = now;

    const r = (n: number) => Math.round(n / sec);
    logger.info(
        `[pid ${process.pid}] ` +
            `recv ${r(c.received)}/s | computed ${r(c.computed)}/s | ` +
            `unchanged ${r(c.unchanged)}/s | coalesced ${r(c.coalesced)}/s | ` +
            `upserted ${r(c.upserted)}/s | unknown ${r(c.unknown)}/s | ` +
            `errors ${r(c.errors)}/s | inflight ${inflight} | ` +
            `pending ${dirty.size} | idr ${idrRate} | lag ${lagMs.toFixed(1)}ms`,
    );
    resetStats();
}, STATS_MS);

// ---------------------------------------------------------------- core
type Job = {
    exchangeId: number;
    cmcId: number;
    askPrice: number; // price paid to BUY on this exchange (asks)
    askVol: number;
    bidPrice: number; // price received to SELL on this exchange (bids)
    bidVol: number;
};

// Fused convert + search. `factor` is applied only to the levels we walk,
// the input is never mutated, and nothing is async.
function buildJob(
    ob: NormalizedOrderbookEvent,
    exchangeId: number,
    factor: number,
): Job {
    const asks = ob.asks;
    let askVol = 0;
    let askPrice = 0;
    for (let i = 0, len = asks.length; i < len; i++) {
        const level = asks[i]!;
        const p = level[0] * factor;
        askVol += p * level[1];
        if (askVol >= SEARCH_VOLUME_TARGET) {
            askPrice = p;
            break;
        }
    }

    const bids = ob.bids;
    let bidVol = 0;
    let bidPrice = 0;
    for (let i = 0, len = bids.length; i < len; i++) {
        const level = bids[i]!;
        const p = level[0] * factor;
        bidVol += p * level[1];
        if (bidVol >= SEARCH_VOLUME_TARGET) {
            bidPrice = p;
            break;
        }
    }

    return { exchangeId, cmcId: ob.cmcId, askPrice, askVol, bidPrice, bidVol };
}

// Numeric key: no string allocation in the hot path.
const marketKey = (exchangeId: number, cmcId: number) =>
    exchangeId * 10_000_000 + cmcId;

const lastSeen = new Map<number, Job>(); // last result accepted per market
const dirty = new Map<number, Job>(); // newest snapshot waiting to be written
const busy = new Set<number>(); // markets with a write in flight
let inflight = 0;

// Drains `dirty` under two rules:
//  - at most MAX_INFLIGHT concurrent writes (backpressure)
//  - at most one write per market at a time (no out-of-order overwrites);
//    a busy market stays in `dirty` and its snapshot keeps being replaced.
function flush() {
    if (dirty.size === 0) return;
    for (const [key, job] of dirty) {
        if (inflight >= MAX_INFLIGHT) break;
        if (busy.has(key)) continue;
        dirty.delete(key); // deleting during Map iteration is safe
        busy.add(key);
        inflight++;
        void write(key, job);
    }
}
setInterval(flush, FLUSH_MS);

async function write(key: number, job: Job) {
    try {
        // The sender owns creating/deleting opportunity rows (`opportunity.sync`),
        // so we only update legs that already exist. A zero-row update is expected
        // after a metadata change removed a leg.
        //
        // The buy leg pays the ASK on this exchange; the sell leg receives the BID.
        await Promise.all([
            Opportunity.updateBuySide({
                exchangeId: job.exchangeId,
                cmcId: job.cmcId,
                price: job.askPrice,
                volume: job.askVol,
            }),
            Opportunity.updateSellSide({
                exchangeId: job.exchangeId,
                cmcId: job.cmcId,
                price: job.bidPrice,
                volume: job.bidVol,
            }),
        ]);
        c.upserted++;
    } catch (e) {
        c.errors++;
        lastSeen.delete(key); // so an identical next snapshot isn't skipped
        logger.warn(`write failed for market ${key}: ${String(e)}`);
    } finally {
        busy.delete(key);
        inflight--;
    }
}

// ---------------------------------------------------------------- subscribe
// Workers already normalize; this subscribes to the single normalized stream.
// `main-concurrent.ts` runs one of these per CPU on a shared queue, so each
// message is handled by exactly one process.
const subscription = subscribe({
    queue: Queues.orderbook,
    patterns: [RoutingKeys.orderbookNormalizedAll],
    prefetch: MAX_INFLIGHT,
    // A live orderbook feed is worthless once nobody is reading it; drop it
    // rather than grow a durable backlog while every receiver is down. (RabbitMQ
    // 4 forbids transient non-exclusive queues, so the queue is durable and
    // auto-deletes when the last consumer leaves.)
    durable: true,
    autoDelete: true,
    maxLength: 50_000,
});
logger.info(
    `receiver-${process.pid} listening on ${RoutingKeys.orderbookNormalizedAll}`,
);

// Idempotent: Ctrl+C reaches the worker directly AND via the cluster parent,
// so the same process can get two signals. Closing twice is a no-op.
let shuttingDown = false;
function shutdown(signal: string) {
    if (shuttingDown) return;
    shuttingDown = true;
    logger.info(`[pid ${process.pid}] ${signal} received, draining`);
    subscription
        .close()
        .catch((e) => logger.warn(`drain failed: ${String(e)}`));
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Message handler is fully synchronous: decode, compute, stash. No DB awaits.
for await (const delivery of subscription) {
    c.received++;

    let ob: NormalizedOrderbookEvent;
    try {
        ob = delivery.json<NormalizedOrderbookEvent>();
    } catch {
        c.errors++;
        delivery.ack(); // poison payload; redelivery cannot fix it
        continue;
    }

    // The sender carries the canonical exchange identity on the payload, so we
    // never parse routing-key tokens here.
    const exchangeId = exchangeSlugIdMap.get(ob.exchange);
    if (exchangeId === undefined) {
        c.unknown++;
        delivery.ack();
        continue;
    }

    // Normal tickers are multiplied by the IDR rate; special tickers
    // (1mbabydoge, 1000sats) use divider / idrRate instead.
    const divider = DIVIDERS[ob.exchange]?.[ob.cmcId];
    const factor = divider !== undefined ? divider / idrRate : idrRate;

    const job = buildJob(ob, exchangeId, factor);
    c.computed++;

    const key = marketKey(exchangeId, ob.cmcId);
    const prev = lastSeen.get(key);
    if (
        prev !== undefined &&
        prev.askPrice === job.askPrice &&
        prev.bidPrice === job.bidPrice &&
        prev.askVol === job.askVol &&
        prev.bidVol === job.bidVol
    ) {
        c.unchanged++;
        delivery.ack();
        continue;
    }

    lastSeen.set(key, job);
    if (dirty.has(key)) c.coalesced++;
    dirty.set(key, job);
    // Ack once the snapshot is stashed; the actual DB write is batched below.
    // DB failures are retried by the next snapshot of the same market.
    delivery.ack();
}

// Graceful shutdown: finish pending writes, but never hang forever.
const deadline = Date.now() + SHUTDOWN_TIMEOUT_MS;
while ((dirty.size > 0 || inflight > 0) && Date.now() < deadline) {
    flush();
    await Bun.sleep(10);
}
if (dirty.size > 0 || inflight > 0) {
    logger.warn(`exiting with ${dirty.size} pending, ${inflight} inflight`);
}
process.exit(0);
