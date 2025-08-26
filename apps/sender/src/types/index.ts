export const WorkerMessageType = {
  StateChange: "state-change",
  Data: "data",
} as const;

export const WorkerState = {
  Connected: "connected",
  Closed: "closed",
  Reconnecting: "reconnecting",
  Reconnected: "reconnected",
  Disconnected: "disconnected",
  Error: "error",
} as const;
type WorkerState = (typeof WorkerState)[keyof typeof WorkerState];

export type WorkerStateChangeContent = {
  state: WorkerState;
};

export type OrderbookMessageContent = {
  cmcId: number;
  asks: number[][];
  bids: number[][];
};

export type SearchedOrderMessageContent = {
  buyPrice: number;
  buyVolume: number;
  sellPrice: number;
  sellVolume: number;
};

export type OrderbookWorkerMessage = {
  type: typeof WorkerMessageType.StateChange;
  threadId: string;
  exchange: string;
  content: WorkerStateChangeContent;
};
