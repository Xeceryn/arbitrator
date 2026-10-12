/**
 * Small helpers for the keyless CMC public data-api.
 *
 * Neither coins nor exchanges carry a logo field in the public responses, but
 * CMC serves both from stable id-based URLs.
 */

const COIN_LOGO_BASE = "https://s2.coinmarketcap.com/static/img/coins/64x64";
const EXCHANGE_LOGO_BASE =
    "https://s2.coinmarketcap.com/static/img/exchanges/64x64";

export function coinLogoUrl(cmcId: number): string {
    return `${COIN_LOGO_BASE}/${cmcId}.png`;
}

export function exchangeLogoUrl(cmcId: number): string {
    return `${EXCHANGE_LOGO_BASE}/${cmcId}.png`;
}

/** Best-effort, log-friendly rendering of an error value. */
export function formatError(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    try {
        return JSON.stringify(error);
    } catch {
        return String(error);
    }
}
