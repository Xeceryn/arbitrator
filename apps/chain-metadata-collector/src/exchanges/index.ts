import type { ExchangeSlug } from "../config";
import { binanceAdapter } from "./binance";
import { bitgetAdapter } from "./bitget";
import { bybitAdapter } from "./bybit";
import { gateIoAdapter } from "./gate-io";
import { indodaxAdapter } from "./indodax";
import { kucoinAdapter } from "./kucoin";
import { mexcAdapter } from "./mexc";
import { okxAdapter } from "./okx";
import type { ExchangeAdapter } from "./types";

const ADAPTERS: Record<ExchangeSlug, ExchangeAdapter> = {
    binance: binanceAdapter,
    gate: gateIoAdapter,
    indodax: indodaxAdapter,
    kucoin: kucoinAdapter,
    mexc: mexcAdapter,
    okx: okxAdapter,
    bybit: bybitAdapter,
    bitget: bitgetAdapter,
};

export function getAdapter(slug: ExchangeSlug): ExchangeAdapter {
    return ADAPTERS[slug];
}

export type { ExchangeAdapter } from "./types";
