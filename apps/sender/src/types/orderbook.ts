export type OrderbookMessageContent = {
  exchange: string;
  cmcId: number;
  asks: number[][];
  bids: number[][];
};
