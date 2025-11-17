import { os } from "@orpc/server";
import { z } from "zod";

import { BaseCurrency, Exchange } from "./constants";
import { type WorkerState } from "./types";
import { split_symbols } from "./utils";

type CrawlerWorkerConfig = {
  exchange: Exchange;
  base_currency: BaseCurrency;
  max_subscriptions_each_connection: number;
};

type CrawlerWorkerState = {
  exchange: string;
  threadId: string;
  symbols: Array<{ symbol: string; cmcId: number }>;
  state: WorkerState;
};

const workerStore = new Map<string, Worker>();
const crawlerConfigState: CrawlerWorkerState[] = [];
const crawlerWorkerPath = "src/workers/orderbooks";
const crawlerWorkerConfigs: CrawlerWorkerConfig[] = [
  {
    exchange: Exchange.Indodax,
    base_currency: BaseCurrency.IDR,
    max_subscriptions_each_connection: 30,
  },
  {
    exchange: Exchange.Binance,
    base_currency: BaseCurrency.USDT,
    max_subscriptions_each_connection: 100,
  },
  {
    exchange: Exchange.GateIO,
    base_currency: BaseCurrency.USDT,
    max_subscriptions_each_connection: 100,
  },
  {
    exchange: Exchange.Mexc,
    base_currency: BaseCurrency.USDT,
    max_subscriptions_each_connection: 20,
  },
];

export const router = os
  .input(
    z.object({
      exchange: z.enum(Exchange),
    }),
  )
  .errors({
    ALREADY_STARTED: {
      message: "exchange is already started",
      status: 400,
    },
  })
  .output(z.void())
  .handler(async ({ input, errors }) => {
  });
