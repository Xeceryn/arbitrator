import {
  OrderbookQueue,
  Subjects,
  type NormalizedOrderbookEvent,
} from "@arbitrator/contracts";
import { Opportunity } from "@arbitrator/lister/core/opportunity/opportunity";
import { createLogger } from "@arbitrator/logger";
import { listerClient } from "@arbitrator/sdk";
import { connect } from "@nats-io/transport-node";

const logger = createLogger("arbitrator/receiver");

const [error, exchanges] = await listerClient.exchange.list({ limit: -1 });
if (error) {
  process.exit(1);
}
const exchangeSlugIdMap = new Map<string, number>();
for (const exchange of exchanges.data) {
  exchangeSlugIdMap.set(exchange.slug, exchange.id);
}

// PERFORMANCE DEBUG
let messageCount = 0;
let conversionCount = 0;
let searchCount = 0;
let update = 0;

const nc = await connect({
  servers: Bun.env.NATS_URL ?? "nats://localhost:4222",
  user: Bun.env.NATS_USER,
  pass: Bun.env.NATS_PASSWORD,
  name: "arbitrator-receiver",
  maxReconnectAttempts: -1,
});

const IDR_PRICE = 17950 as const;
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

  let buyVolume = 0;
  let buyPrice = 0;

  for (let i = 0, len = bids.length; i < len; i++) {
    const level = bids[i]!;

    buyVolume += level[0] * level[1];

    if (buyVolume >= SEARCH_VOLUME_TARGET) {
      buyPrice = level[0];
      break;
    }
  }

  let sellVolume = 0;
  let sellPrice = 0;

  for (let i = 0, len = asks.length; i < len; i++) {
    const level = asks[i]!;

    sellVolume += level[0] * level[1];

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
  conversionCount += 1;
  const searched = searchOrderbook(converted);
  searchCount += 1;

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
  update += 1;
}

setInterval(() => {
  logger.info(
    `received  ${messageCount} / seconds  on process id ${process.pid}`,
  );
  logger.info(
    `converted ${conversionCount} / seconds on process id ${process.pid}`,
  );
  logger.info(
    `searched  ${searchCount} / seconds on process id ${process.pid}`,
  );

  logger.info(`upserted  ${update} / seconds  on process id ${process.pid}`);

  messageCount = 0;
  conversionCount = 0;
  searchCount = 0;
  update = 0;
}, 1000);

// Workers already normalize; this subscribes to the single normalized stream.
// `main.ts` runs one of these per CPU under a shared queue group, so each
// message is handled by exactly one process.
const subject = Subjects.orderbookNormalized("*");
const subscription = nc.subscribe(subject, { queue: OrderbookQueue });
logger.info(`receiver-${process.pid} listening on ${subject}`);

for await (const message of subscription) {
  const orderbook = message.json<NormalizedOrderbookEvent>();
  messageCount += 1;

  // The sender now carries the canonical exchange identity on the payload, so
  // we never parse subject tokens here.
  const exchangeId = exchangeSlugIdMap.get(orderbook.exchange);
  if (exchangeId === undefined) {
    logger.warn(
      `dropping orderbook for unknown exchange: ${orderbook.exchange}`,
    );
    continue;
  }

  // binance has some special multipleid volumes, so we need to divide it.
  if (orderbook.exchange === "binance") {
    // 1mbabydoge 1 million of babydoge
    if (orderbook.cmcId === 10407) {
      await processOrderbook(orderbook, exchangeId, 1_000_000);
      continue;
    }
    // 1000sats 1000 of sats
    if (orderbook.cmcId === 28194) {
      await processOrderbook(orderbook, exchangeId, 1000);
      continue;
    }
    // 1000cheems 100 of cheems
    if (orderbook.cmcId === 33280) {
      await processOrderbook(orderbook, exchangeId, 1000);
      continue;
    }
  }

  // const converted = await convertPrice(orderbook);
  // conversionCount += 1;
  // const searched = searchOrderbook(converted);
  // searchCount += 1;

  // The sender owns creating/deleting opportunity rows (`opportunity.sync`), so
  // here we only update the legs that already exist. A metadata change may have
  // removed a leg since it was last seen, so a zero-row update is expected.
  //
  // `searchOrderbook` labels the book's sides: bids drive its `buyPrice`, asks
  // its `sellPrice`. The acquisition side of a leg is the ask paid on the buy
  // exchange; the disposal side is the bid received on the sell exchange.

  await processOrderbook(orderbook, exchangeId);
  // await Opportunity.updateBuySide({
  //   exchangeId,
  //   cmcId: searched.cmcId,
  //   price: searched.sellPrice,
  //   volume: searched.sellVolume,
  // });
  // await Opportunity.updateSellSide({
  //   exchangeId,
  //   cmcId: searched.cmcId,
  //   price: searched.buyPrice,
  //   volume: searched.buyVolume,
  // });
}
