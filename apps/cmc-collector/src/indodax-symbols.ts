import { resolve } from "node:path";

import {
    fetchIndodaxPairs,
    type IndodaxPair,
    normalizeIndodaxPairs,
} from "./indodax";

/**
 * Generates the sender worker's Indodax subscription table
 * (`apps/sender/src/workers/orderbooks/indodax-symbols.ts`).
 *
 * lister stores Indodax's display ticker (`traded_currency_unit`, e.g. `T` for
 * Threshold) but the orderbook websocket publishes under the pair id (`id`, or
 * `old_ticker_id` for renamed markets, e.g. `lendidr` for AAVE). The worker only
 * receives a cmcId plus the display ticker, so it needs a CMC id -> pair id
 * table. That table is derived here from the same normalized pair list the
 * importer uses, keeping the two sides in sync.
 */

/** The sender worker file this generator owns. */
export function indodaxSymbolsFilePath(): string {
    return resolve(
        import.meta.dir,
        "..",
        "..",
        "sender",
        "src",
        "workers",
        "orderbooks",
        "indodax-symbols.ts",
    );
}

/**
 * CMC id -> websocket pair id, sorted by CMC id.
 *
 * Built through `normalizeIndodaxPairs`, so it inherits the IDR-only filter,
 * the `INDODAX_CMC_ID_ALIASES` folding (3890 MATIC -> 28321 POL) and the
 * `old_ticker_id` preference.
 */
export function buildIndodaxSubscriptionTable(
    pairs: readonly IndodaxPair[],
): Map<number, string> {
    const { coins } = normalizeIndodaxPairs(pairs);
    const table = new Map<number, string>();

    for (const coin of coins) table.set(coin.cmcId, coin.subscribeSymbol);

    return new Map([...table].sort(([a], [b]) => a - b));
}

/** Render the generated TypeScript module (rows sorted by CMC id). */
export function renderIndodaxSymbolsModule(
    table: ReadonlyMap<number, string>,
    generatedAt: Date = new Date(),
): string {
    const generatedOn = generatedAt.toISOString().slice(0, 10);
    const rows = [...table]
        .sort(([a], [b]) => a - b)
        .map(([cmcId, pairId]) => `    ${cmcId}: ${JSON.stringify(pairId)},`)
        .join("\n");

    return `/**
 * Indodax websocket pair ids, keyed by CMC id.
 *
 * Indodax displays \`traded_currency_unit\` (what lister stores as
 * \`market.exchangeSymbol\`) but subscribes with the pair \`id\`, and the two
 * differ for a number of coins (e.g. Threshold displays \`T\` and subscribes
 * \`thresholdidr\`). lister only hands the worker a cmcId plus the display
 * ticker, so this table bridges the gap.
 *
 * Renamed markets keep their original channel: \`old_ticker_id\` wins whenever
 * the pair list exposes one (AAVE is \`aaveidr\` but only \`lendidr\` publishes).
 *
 * Generated from https://indodax.com/api/pairs on ${generatedOn} (IDR pairs only).
 * Do not edit by hand: run \`bun run indodax:symbols\` in apps/cmc-collector
 * (or \`--indodax-symbols\`). An unknown id falls back to \`<ticker>idr\`, which
 * is right whenever the unit matches \`traded_currency\`. The collector's
 * \`INDODAX_CMC_ID_ALIASES\` (3890 MATIC -> 28321 POL) is already applied.
 */
export const INDODAX_SUBSCRIBE_PAIR_ID_BY_CMC_ID: Readonly<
    Record<number, string>
> = {
${rows}
};
`;
}

/** Fetch the live pair list, build the table and write the sender module. */
export async function regenerateIndodaxSymbols(options: {
    filePath?: string;
    pairs?: readonly IndodaxPair[];
    generatedAt?: Date;
}): Promise<{
    filePath: string;
    count: number;
    content: string;
}> {
    const pairs = options.pairs ?? (await fetchIndodaxPairs());
    const table = buildIndodaxSubscriptionTable(pairs);
    const content = renderIndodaxSymbolsModule(table, options.generatedAt);
    const filePath = options.filePath ?? indodaxSymbolsFilePath();

    await Bun.write(filePath, content);

    return { filePath, count: table.size, content };
}
