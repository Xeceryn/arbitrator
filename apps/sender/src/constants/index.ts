export const Exchange = {
  Indodax: "indodax",
  Pintu: "pintu",
  Huobi: "huobi",
  Binance: "binance",
  GateIO: "gate",
  Mexc: "mexc",
  Bitget: "bitget",
  Kucoin: "kucoin",
  Bitmart: "bitmart",
} as const;
export type Exchange = (typeof Exchange)[keyof typeof Exchange];

export const BaseCurrency = {
  USDT: "usdt",
  IDR: "idr",
} as const;
export type BaseCurrency = (typeof BaseCurrency)[keyof typeof BaseCurrency];

export const ExchangeBaseCurrencyMap = new Map<Exchange, BaseCurrency>([
  [Exchange.Indodax, BaseCurrency.IDR],
  [Exchange.Pintu, BaseCurrency.IDR],

  [Exchange.Binance, BaseCurrency.USDT],
  [Exchange.Huobi, BaseCurrency.USDT],
  [Exchange.GateIO, BaseCurrency.USDT],
  [Exchange.Mexc, BaseCurrency.USDT],
  [Exchange.Bitget, BaseCurrency.USDT],
  [Exchange.Kucoin, BaseCurrency.USDT],
  [Exchange.Bitmart, BaseCurrency.USDT],
]);

export * from "./calculation";
