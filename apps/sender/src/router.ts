import { os } from "@orpc/server";
import { z } from "zod";

import { BaseCurrency, Exchange } from "./constants";
import { type WorkerState } from "./types";
import { split_symbols } from "./utils";

type workerConfig = {
  exchange: Exchange;
  base_currency: BaseCurrency;
  max_subscriptions_each_connection: number;
};

type workersState = {
  exchange: string;
  threadId: string;
  symbols: Array<{ symbol: string; cmcId: number }>;
  state: WorkerState;
};

const workersStore = new Map<string, Worker>();
const workersState: workersState[] = [];
const workersPath = "src/workers/orderbooks";
const workersConfigs: workerConfig[] = [
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

const WorkerStateStore = new Map<Exchange, WorkerState>();

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
  .handler(async ({ input, errors }) => {
    const { exchange } = input;
    // start a worker if the length of the started exchanges is > than 1
    // e.g started binance, it does nothing. after the user started gate-io
    // it will send request to get coin metadata to @arbitrator/lister service
    // and it's going to get the coin list that are transferrable between those exchanges.
    //
    // the conditions of transferrable coins are:
    // - on Market (relation between exchange and coin) has tradable on
    // - on Market Chain (relation between exchange and coin and chain)
    //   has withdrawEnabled from exchange a and depositEnabled from b and same chain
    //   and vice versa
    //
    //   if it's not transferrable from a to b and b to a. no need to query this
    //   because our workers will not subscribe to this.
    //
    // if there's a 3rd ex
  });
