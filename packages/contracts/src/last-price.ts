/**
 * Last-price cache shared by every service. Lister fills it by polling an
 * exchange's ticker API; the receiver reads it directly over Redis for
 * throughput, and the lister HTTP API answers everyone else. Never write the
 * key literal in a service; import from here.
 *
 * A last price is standalone: one symbol (e.g. `usdt`) maps to its most recent
 * traded price, with no relation to any other entity. Values are stored as the
 * plain decimal string so any client can parse them.
 */
export const LastPricePrefix = "last-price:" as const;

/** Redis key for one symbol's last price, e.g. `last-price:usdt`. */
export const lastPriceKey = (symbol: string) =>
    `${LastPricePrefix}${symbol.toLowerCase()}`;
