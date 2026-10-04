import {
  OrderbookQueue,
  Subjects,
  type NormalizedOrderbookEvent,
} from "@arbitrator/contracts";
import { database } from "@arbitrator/lister/database/connection";
import { createLogger } from "@arbitrator/lister/core/opp";
import { createLogger } from "@arbitrator/logger";
import { connect } from "@nats-io/transport-node";

const logger = createLogger("arbitrator/receiver");

database.insert(

// PERFORMANCE DEBUG
let messageCount = 0;
let conversionCount = 0;
let searchCount = 0;

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
): Promise<NormalizedOrderbookEvent> {
  const idrPrice = await getIdrPrice();

  const asks = orderbook.asks;
  for (let i = 0, len = asks.length; i < len; i++) {
    asks[i]![0] *= idrPrice;
  }

  const bids = orderbook.bids;
  for (let i = 0, len = bids.length; i < len; i++) {
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

setInterval(() => {
  logger.info(
    `received  ${messageCount} / seconds  on process id ${process.pid}`,
  );
  logger.info(
    `converted ${conversionCount} / seconds on process id ${process.pid}`,
  );
  logger.info(
    `searche d ${searchCount} / seconds on process id ${process.pid}`,
  );

  messageCount = 0;
  conversionCount = 0;
  searchCount = 0;
}, 1000);

// Workers already normalize; this subscribes to the single normalized stream.
// `main.ts` runs one of these per CPU under a shared queue group, so each
// message is handled by exactly one process.
const subject = Subjects.orderbookNormalized("*");
const subscription = nc.subscribe(subject, { queue: OrderbookQueue });
logger.info(`receiver-${process.pid} listening on ${subject}`);

for await (const message of subscription) {
  // we don't need zod here, as we are safely know the shape of the message
  // const parsed = normalizedOrderbookSchema.safeParse(message.json());
  // // console.log(parsed.data);
  // if (!parsed.success) {
  //   logger.warn(`dropping malformed orderbook: ${parsed.error.message}`);
  //   continue;
  // }

  const orderbook = message.json<NormalizedOrderbookEvent>();
  messageCount += 1;
  const converted = await convertPrice(orderbook);
  conversionCount += 1;
  const searched = searchOrderbook(converted);
  searchCount += 1;
  // console.log(_);

  // The exchange is the last subject token; the payload carries cmcId/asks/bids.
  // TODO(separate feature): price conversion/lookup + persist to DB.
}
