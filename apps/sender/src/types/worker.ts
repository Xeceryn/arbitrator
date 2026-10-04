import type { SymbolInfo } from "./metadata";

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

export type WorkerState = (typeof WorkerState)[keyof typeof WorkerState];

export type WorkerMessage = {
  threadId: string;
  exchange: string;
  state: WorkerState;
  subscriptions: Array<SymbolInfo>;
};
