import { BaseCurrency, Exchange, ExchangeBaseCurrencyMap } from "./constants";
import {
  WorkerMessageType,
  type WorkerState,
  type OrderbookWorkerMessage,
} from "./types";
import { split_symbols } from "./utils";

type CrawlerWorkerConfig = {
  exchange: Exchange;
  base_currency: BaseCurrency;
  max_subscriptions_each_connection: number;
};
type CrawlerWorkerState = {
  exchange: string;
  threadId: string;
  state: WorkerState;
};

// date processing worker
const price_search_worker = new Worker("src/workers/price-search.ts");
const converter_worker = new Worker("src/workers/converter.ts");

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

for (const {
  exchange,
  max_subscriptions_each_connection,
} of crawlerWorkerConfigs) {
  const coin_list_request = await fetch(
    `http://localhost:3001/assignments/market/${exchange}/coin`,
  );

  const coin_list_response = (await coin_list_request.json()) as {
    cmcId: number;
    symbol: string;
    marketSymbol: string;
  }[];

  const symbols_each_connection = split_symbols(
    coin_list_response.map(({ cmcId, marketSymbol }) => ({
      cmcId,
      symbol: marketSymbol,
    })),
    max_subscriptions_each_connection,
  );
  for (const symbols of symbols_each_connection) {
    const argv = symbols
      .map(({ cmcId, symbol }) => `${cmcId}-${symbol}`)
      .join(",");

    const worker = new Worker(`${crawlerWorkerPath}/${exchange}.ts`, {
      argv: [argv],
    });

    worker.onmessage = (event: Bun.MessageEvent<OrderbookWorkerMessage>) => {
      const data = event.data;
      if (data.type === "state-change") {
        const base_currency = ExchangeBaseCurrencyMap.get(exchange)!;
        if (base_currency === BaseCurrency.IDR) {
          price_search_worker.postMessage(data);
          return;
        }
        if (base_currency === BaseCurrency.USDT) {
          converter_worker.postMessage(data);
          return;
        }
        return;
      }
      if (data.type === WorkerMessageType.StateChange) {
        const { exchange, content, threadId } = data;
        const state = content.state;
        const existing_worker = crawlerConfigState.find(
          (x) => x.threadId === threadId,
        );
        if (existing_worker) {
          existing_worker.state = state;
        } else {
          crawlerConfigState.push({
            exchange,
            threadId,
            state,
          });
        }
      }
      return;
    };

    // crawler_worker_state.push({
    //   exchange,
    //   threadId: `${exchange}-${worker.threadId}`,
    //   state: WorkerState.Closed,
    // });
  }
}
