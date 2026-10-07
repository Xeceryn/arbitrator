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
