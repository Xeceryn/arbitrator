export enum WorkerMessageType {
  StateChange = "state-changed",
  Data = "data",
}

export enum WorkerState {
  Connected = "connected",
  Closed = "closed",
  Reconnecting = "reconnecting",
  Reconnected = "reconnected",
  Disconnected = "disconnected",
  Error = "error",
  // Closed,
  // Reconnecting,
  // Reconnected,
  // Disconnected,
  // Error,
}

export type WorkerStateChangeContent = {
  state: WorkerState;
};

export type OrderbookMessageContent = {
  cmcId: number;
  asks: number[][];
  bids: number[][];
};

export type SearchedOrderMessageContent = {
  buy_price: number;
  buy_volume: number;
  sell_price: number;
  sell_volume: number;
};

export type OrderbookWorkerMessage =
  | {
      type: WorkerMessageType.StateChange;
      threadId: string;
      exchange: string;
      content: WorkerStateChangeContent;
    }
  | {
      type: WorkerMessageType.Data;
      threadId: string;
      exchange: string;
      content: OrderbookMessageContent;
    };

export type SearchedOrderbook = {
  buy_price: number;
  sell_price: number;
  buy_volume: number;
  sell_volume: number;
};
