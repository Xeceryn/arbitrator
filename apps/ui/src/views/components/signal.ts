import type { OpportunitySignal } from "@arbitrator/lister/types";

type BaseCurrency = OpportunitySignal["buyExchange"]["baseCurrency"];

/**
 * Signal colour keyed by the buy/sell base-currency pair. The classes live in
 * `assets/styles/styles.css` and only set `--signal-color`, so the meaning is
 * carried by text as well as colour.
 */
export function signalColorClass(
    buy: BaseCurrency,
    sell: BaseCurrency,
): string {
    return `signal-${buy}-${sell}`;
}

/** Textual cue for the pair, so colour is never the only carrier. */
export function signalPairLabel(buy: BaseCurrency, sell: BaseCurrency): string {
    return `${buy.toUpperCase()} → ${sell.toUpperCase()}`;
}
