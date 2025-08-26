import { Exchange } from "../constants";
import type { SymbolInfo } from "../types/metadata";

export function split_symbols(
  symbols: { cmcId: number; symbol: string }[],
  max_subscriptions: number,
): SymbolInfo[][] {
  const result: SymbolInfo[][] = [];
  for (let i = 0; i < symbols.length; i += max_subscriptions) {
    result.push(symbols.slice(i, i + max_subscriptions));
  }
  return result;
}

export const filter_solo = (old_coins_info: any) => {
  const active_exchange_count = Exchange.reduce((count, exchange) => {
    return count + (old_coins_info[exchange] === true ? 1 : 0);
  }, 0);

  return active_exchange_count > 1;
};
