import {
    PINTU_CURRENCIES_URL,
    PINTU_MARKETS_URL,
    PINTU_SYMBOLS_URL,
    PINTU_TARGET,
    QuoteCurrency,
} from "./config";
import type {
    CryptocurrencySnapshot,
    ExchangeSnapshot,
    MarketSnapshot,
    Snapshot,
} from "./types";

/**
 * Pintu does not publish a documented public API and is not registered on
 * CoinMarketCap. The Pro web terminal still fetches its own keyless endpoints:
 *
 * - `get-symbols-reference` is the authoritative list of pairs Pro can trade
 *   (IDR only), including tokenized stocks in a separate `is_tokenized` flag.
 * - `transaction/market/list` carries the display name, logo and trading state
 *   for the retail market catalogue.
 * - `wallet/supportedCurrencies` carries the wallet/chain catalogue and fills
 *   metadata gaps for Pro-only symbols the retail catalogue hides.
 *
 * Identity is the ticker (`base_asset`), because Pintu has no CMC ids. The
 * dedicated `--pintu` scan resolves those tickers against lister.
 */

/** The subset of `get-symbols-reference` this collector consumes. */
export type PintuSymbolReference = {
    symbol: string;
    quote_asset: string;
    base_asset: string;
    is_tokenized?: boolean;
};

type PintuSymbolsResponse = {
    code?: number;
    message?: string;
    data?: { symbols?: PintuSymbolReference[] };
};

/** The subset of `transaction/market/list` this collector consumes. */
export type PintuMarket = {
    currency_group: string;
    currency_symbol: string;
    name: string;
    logo: string;
    is_trading_enabled?: boolean;
    is_market_visible?: boolean;
    is_upcoming?: boolean;
    market_detail_url?: string;
};

type PintuMarketsResponse = {
    data?: { markets?: PintuMarket[] };
};

/** The subset of `wallet/supportedCurrencies` used for metadata fallback. */
export type PintuCurrency = {
    currencyGroup: string;
    currencySymbol: string;
    name: string;
    logo: string;
    is_tokenized?: boolean;
    category_type?: string;
};

type PintuCurrenciesResponse = {
    code?: string;
    message?: string;
    payload?: PintuCurrency[];
};

/** A Pro-tradable spot coin, normalized for the snapshot. */
export type PintuCoin = {
    /** Base ticker, e.g. `BTC`; also the Pro orderbook channel prefix. */
    symbol: string;
    name: string;
    slug: string;
    logo: string;
    tradeEnabled: boolean;
};

export type PintuSkippedCoin = {
    symbol: string;
    reason: string;
};

export type NormalizedPintuCoins = {
    coins: PintuCoin[];
    skipped: PintuSkippedCoin[];
};

/**
 * Metadata for Pro-only symbols that neither the retail market list nor the
 * wallet catalogue carries. `MKR` still has a live Pro book (`MKR-IDR`) even
 * though it is hidden from the retail app.
 */
export const PINTU_COIN_FALLBACKS: Readonly<
    Record<string, { name: string; slug: string; logo: string }>
> = {
    MKR: {
        name: "Maker",
        slug: "maker",
        logo: "https://assets.pintu.co.id/frontend/static/assets/images/logo/circle_MKR.svg",
    },
};

/**
 * Manual disambiguations for tickers shared by several lister coins. These are
 * the canonical ids of the coin Pintu actually lists:
 *
 * - `DOGE` -> Dogecoin, not the many "Department of Government Efficiency"
 *   tokens that share the ticker.
 * - `MEME` -> Memecoin, not "A Meme Coin".
 * - `PUMP` -> Pump.fun, not PumpBTC's governance token.
 *
 * Review `data/pintu-symbols.json` after a scan; add to this map when a new
 * collision appears instead of letting the resolver guess.
 */
export const PINTU_SYMBOL_ALIASES: ReadonlyMap<string, number> = new Map([
    ["DOGE", 74],
    ["MEME", 28301],
    ["PUMP", 36507],
]);

/** A lister coin as returned by `GET /cryptocurrency?limit=-1`. */
export type PintuDbCoin = {
    cmcId: number;
    symbol: string;
    name: string;
    slug: string;
};

/** Where a resolved coin's CMC id came from. */
export type PintuResolutionSource = "db" | "alias" | "synthetic";

export type PintuResolvedCoin = {
    coin: PintuCoin;
    cmcId: number;
    source: PintuResolutionSource;
    /** The lister row when the id was already known; absent for synthetic ids. */
    dbCoin?: PintuDbCoin;
};

export type PintuConflict = {
    symbol: string;
    candidates: PintuDbCoin[];
};

export type PintuAlias = {
    symbol: string;
    cmcId: number;
    /** Every lister coin that shared the ticker, for manual review. */
    candidates: PintuDbCoin[];
};

export type PintuResolution = {
    resolved: PintuResolvedCoin[];
    conflicts: PintuConflict[];
    synthetic: PintuResolvedCoin[];
    aliases: PintuAlias[];
};

export type PintuReport = {
    scannedAt: string;
    exchange: { name: string; slug: string; cmcId: number };
    totals: {
        proCoins: number;
        resolved: number;
        fromDb: number;
        fromAlias: number;
        synthetic: number;
        conflicts: number;
        skipped: number;
    };
    resolved: Array<{
        symbol: string;
        name: string;
        cmcId: number;
        source: PintuResolutionSource;
    }>;
    conflicts: PintuConflict[];
    skipped: PintuSkippedCoin[];
    synthetic: Array<{ symbol: string; name: string; cmcId: number }>;
    aliases: PintuAlias[];
};

/**
 * Reserved CMC-id range for coins that only exist on Pintu. Starting at 1999
 * would collide with real CMC ids (2010 is ADA, 2011 is XTZ), so the range is
 * the 1,999,000–2,998,999 block instead: clearly synthetic, far above every
 * real id, and still inside a 32-bit Postgres integer.
 */
export const PINTU_SYNTHETIC_CMC_ID_START = 1_999_000;
export const PINTU_SYNTHETIC_CMC_ID_RANGE = 1_000_000;

/** FNV-1a, used only to make synthetic ids stable across runs. */
function fnv1a32(value: string): number {
    let hash = 0x811c9dc5;

    for (const character of value) {
        hash ^= character.codePointAt(0) ?? 0;
        hash = Math.imul(hash, 0x01000193);
    }

    return hash >>> 0;
}

/**
 * Pick a stable synthetic id for `symbol`, skipping ids already used in lister.
 * The same symbol yields the same id on every run unless it collides with a
 * real coin, so repeat scans do not create duplicate cryptocurrency rows.
 */
export function allocatePintuSyntheticCmcId(
    symbol: string,
    used: ReadonlySet<number>,
): number {
    const key = symbol.trim().toUpperCase();

    for (let probe = 0; probe < PINTU_SYNTHETIC_CMC_ID_RANGE; probe += 1) {
        const id =
            PINTU_SYNTHETIC_CMC_ID_START +
            ((fnv1a32(key) + probe) % PINTU_SYNTHETIC_CMC_ID_RANGE);

        if (!used.has(id)) return id;
    }

    throw new Error(`no free synthetic CMC id left for ${key}`);
}

async function fetchPintuJson<T>(url: string, label: string): Promise<T> {
    const response = await fetch(url, {
        headers: { accept: "application/json" },
    });

    if (!response.ok) {
        throw new Error(`${label} failed: HTTP ${response.status}`);
    }

    return (await response.json()) as T;
}

/** Fetch the Pro symbol reference (all IDR pairs, tokenized stocks included). */
export async function fetchPintuSymbols(): Promise<PintuSymbolReference[]> {
    const body = await fetchPintuJson<PintuSymbolsResponse>(
        PINTU_SYMBOLS_URL,
        "pintu symbols",
    );

    if (body.code !== undefined && body.code !== 0) {
        throw new Error(
            `pintu symbols: ${body.message ?? `code ${body.code}`}`,
        );
    }

    const symbols = body.data?.symbols;
    if (!Array.isArray(symbols)) {
        throw new Error("pintu symbols: expected data.symbols array");
    }

    return symbols;
}

/** Fetch the retail market catalogue (display names, logos, trade state). */
export async function fetchPintuMarkets(): Promise<PintuMarket[]> {
    const body = await fetchPintuJson<PintuMarketsResponse>(
        PINTU_MARKETS_URL,
        "pintu markets",
    );

    const markets = body.data?.markets;
    if (!Array.isArray(markets)) {
        throw new Error("pintu markets: expected data.markets array");
    }

    return markets;
}

/** Fetch the wallet currency catalogue (metadata fallback for hidden coins). */
export async function fetchPintuCurrencies(): Promise<PintuCurrency[]> {
    const body = await fetchPintuJson<PintuCurrenciesResponse>(
        PINTU_CURRENCIES_URL,
        "pintu currencies",
    );

    if (body.code !== undefined && body.code !== "success") {
        throw new Error(
            `pintu currencies: ${body.message || `code ${body.code}`}`,
        );
    }

    const currencies = body.payload;
    if (!Array.isArray(currencies)) {
        throw new Error("pintu currencies: expected payload array");
    }

    return currencies;
}

/**
 * Fetch the Pro symbol list and normalize the spot universe. The two metadata
 * catalogues are best-effort: the symbol list is the only source that decides
 * which markets exist, so a metadata outage must not abort the scan (new coins
 * simply fall back to their ticker and an empty logo).
 */
export async function fetchPintuCoins(): Promise<NormalizedPintuCoins> {
    const symbols = await fetchPintuSymbols();
    const [markets, currencies] = await Promise.allSettled([
        fetchPintuMarkets(),
        fetchPintuCurrencies(),
    ]);

    if (markets.status === "rejected") {
        console.warn(
            `pintu market metadata unavailable: ${describeError(markets.reason)}`,
        );
    }
    if (currencies.status === "rejected") {
        console.warn(
            `pintu currency metadata unavailable: ${describeError(currencies.reason)}`,
        );
    }

    return normalizePintuCoins(
        symbols,
        markets.status === "fulfilled" ? markets.value : [],
        currencies.status === "fulfilled" ? currencies.value : [],
    );
}

function describeError(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function upper(value: string | undefined): string {
    return (value ?? "").trim().toUpperCase();
}

function marketSlug(market: PintuMarket | undefined): string | undefined {
    const url = market?.market_detail_url?.trim();
    if (!url) return undefined;

    try {
        const path = new URL(url).pathname.replace(/\/+$/, "");
        const slug = path.split("/").pop()?.trim();
        return slug ? slug.toLowerCase() : undefined;
    } catch {
        return undefined;
    }
}

function isTradeEnabled(market: PintuMarket | undefined): boolean {
    if (!market) return true;
    return (
        market.is_trading_enabled !== false &&
        market.is_market_visible !== false &&
        market.is_upcoming !== true
    );
}

/**
 * Normalize Pintu's three catalogues into one row per Pro spot coin.
 *
 * Only IDR pairs are kept and tokenized stocks are skipped: lister is a
 * cryptocurrency book and the sender worker subscribes `<ticker>-IDR`. Duplicate
 * base assets are reported instead of silently overwriting each other.
 */
export function normalizePintuCoins(
    symbols: readonly PintuSymbolReference[],
    markets: readonly PintuMarket[] = [],
    currencies: readonly PintuCurrency[] = [],
): NormalizedPintuCoins {
    const marketByGroup = new Map<string, PintuMarket>();
    const marketBySymbol = new Map<string, PintuMarket>();
    for (const market of markets) {
        const group = upper(market.currency_group);
        const ticker = upper(market.currency_symbol);
        if (group && !marketByGroup.has(group))
            marketByGroup.set(group, market);
        if (ticker && !marketBySymbol.has(ticker)) {
            marketBySymbol.set(ticker, market);
        }
    }

    const currencyByGroup = new Map<string, PintuCurrency>();
    const currencyBySymbol = new Map<string, PintuCurrency>();
    for (const currency of currencies) {
        const group = upper(currency.currencyGroup);
        const ticker = upper(currency.currencySymbol);
        if (group && !currencyByGroup.has(group)) {
            currencyByGroup.set(group, currency);
        }
        if (ticker && !currencyBySymbol.has(ticker)) {
            currencyBySymbol.set(ticker, currency);
        }
    }

    const coins = new Map<string, PintuCoin>();
    const skipped: PintuSkippedCoin[] = [];

    for (const reference of symbols) {
        const symbol = upper(reference.base_asset);
        const quote = upper(reference.quote_asset);

        if (quote !== "IDR") {
            skipped.push({
                symbol: symbol || "?",
                reason: `quote ${quote || "?"}`,
            });
            continue;
        }
        if (!symbol) {
            skipped.push({ symbol: "?", reason: "missing base asset" });
            continue;
        }
        if (reference.is_tokenized) {
            skipped.push({ symbol, reason: "tokenized stock" });
            continue;
        }
        if (coins.has(symbol)) {
            skipped.push({ symbol, reason: "duplicate base asset" });
            continue;
        }

        const market = marketByGroup.get(symbol) ?? marketBySymbol.get(symbol);
        const currency =
            currencyByGroup.get(symbol) ?? currencyBySymbol.get(symbol);
        const fallback = PINTU_COIN_FALLBACKS[symbol];

        coins.set(symbol, {
            symbol,
            name:
                market?.name?.trim() ||
                currency?.name?.trim() ||
                fallback?.name ||
                symbol,
            slug: marketSlug(market) ?? fallback?.slug ?? symbol.toLowerCase(),
            logo:
                market?.logo?.trim() ||
                currency?.logo?.trim() ||
                fallback?.logo ||
                "",
            tradeEnabled: isTradeEnabled(market),
        });
    }

    return {
        coins: [...coins.values()].sort((a, b) =>
            a.symbol.localeCompare(b.symbol),
        ),
        skipped,
    };
}

/**
 * Resolve Pintu's ticker-only universe against lister's coins.
 *
 * Order of preference:
 * 1. an explicit `PINTU_SYMBOL_ALIASES` entry (manual review);
 * 2. exactly one lister coin with the same ticker;
 * 3. a stable synthetic CMC id in the reserved range.
 *
 * A ticker with more than one lister candidate is a conflict: it is reported
 * and skipped, never guessed. The same CMC id cannot back two Pintu markets.
 */
export function resolvePintuCoins(
    coins: readonly PintuCoin[],
    dbCoins: readonly PintuDbCoin[],
    aliases: ReadonlyMap<string, number> = PINTU_SYMBOL_ALIASES,
): PintuResolution {
    const bySymbol = new Map<string, PintuDbCoin[]>();
    for (const coin of dbCoins) {
        const symbol = upper(coin.symbol);
        if (!symbol) continue;
        const bucket = bySymbol.get(symbol) ?? [];
        bucket.push(coin);
        bySymbol.set(symbol, bucket);
    }

    const byCmcId = new Map(dbCoins.map((coin) => [coin.cmcId, coin]));
    const normalizedAliases = new Map(
        [...aliases].map(([symbol, cmcId]) => [upper(symbol), cmcId]),
    );
    const used = new Set(dbCoins.map((coin) => coin.cmcId));
    const seen = new Set<number>();
    const resolved: PintuResolvedCoin[] = [];
    const conflicts: PintuConflict[] = [];
    const synthetic: PintuResolvedCoin[] = [];
    const appliedAliases: PintuAlias[] = [];

    for (const coin of [...coins].sort((a, b) =>
        a.symbol.localeCompare(b.symbol),
    )) {
        const symbol = upper(coin.symbol);
        const alias = normalizedAliases.get(symbol);
        const candidates = bySymbol.get(symbol) ?? [];

        let cmcId: number;
        let source: PintuResolutionSource;

        if (alias !== undefined) {
            cmcId = alias;
            source = "alias";
            appliedAliases.push({ symbol, cmcId, candidates });
        } else {
            if (candidates.length === 1) {
                cmcId = candidates[0]!.cmcId;
                source = "db";
            } else if (candidates.length > 1) {
                conflicts.push({ symbol, candidates });
                continue;
            } else {
                cmcId = allocatePintuSyntheticCmcId(symbol, used);
                used.add(cmcId);
                source = "synthetic";
            }
        }

        if (seen.has(cmcId)) {
            const existing = byCmcId.get(cmcId);
            conflicts.push({
                symbol,
                candidates: existing ? [existing] : [],
            });
            continue;
        }
        seen.add(cmcId);

        const entry: PintuResolvedCoin = {
            coin: { ...coin, symbol },
            cmcId,
            source,
            ...(byCmcId.has(cmcId) ? { dbCoin: byCmcId.get(cmcId)! } : {}),
        };

        resolved.push(entry);
        if (source === "synthetic") synthetic.push(entry);
    }

    return {
        resolved,
        conflicts,
        synthetic,
        aliases: appliedAliases,
    };
}

/** Build the lister snapshot for the resolved Pintu markets. */
export function buildPintuSnapshot(resolution: PintuResolution): Snapshot {
    const exchange: ExchangeSnapshot = {
        cmcId: PINTU_TARGET.exchangeCmcId,
        name: PINTU_TARGET.name,
        slug: PINTU_TARGET.slug,
        logo: PINTU_TARGET.logo,
        baseCurrency: PINTU_TARGET.baseCurrency,
        registeredOnCmc: false,
    };

    const markets: MarketSnapshot[] = [];
    const cryptocurrencies = new Map<number, CryptocurrencySnapshot>();

    for (const item of resolution.resolved) {
        markets.push({
            exchangeCmcId: exchange.cmcId,
            exchangeSlug: exchange.slug,
            cryptocurrencyCmcId: item.cmcId,
            exchangeSymbol: item.coin.symbol,
            quoteCurrencyId: QuoteCurrency.IDR,
            tradeEnabled: item.coin.tradeEnabled,
        });

        // Existing rows keep their canonical metadata; only a coin that lister
        // does not know yet is created from Pintu's catalogue.
        if (!item.dbCoin) {
            cryptocurrencies.set(item.cmcId, {
                cmcId: item.cmcId,
                name: item.coin.name,
                symbol: item.coin.symbol,
                slug: item.coin.slug,
                logo: item.coin.logo,
            });
        }
    }

    return {
        scrapedAt: new Date().toISOString(),
        source: "pintu-public",
        exchanges: [exchange],
        cryptocurrencies: [...cryptocurrencies.values()],
        markets,
    };
}

/** Assemble the audit report printed by `--pintu` and written to disk. */
export function buildPintuReport(
    normalized: NormalizedPintuCoins,
    resolution: PintuResolution,
    scannedAt: Date = new Date(),
): PintuReport {
    const fromDb = resolution.resolved.filter(
        (item) => item.source === "db",
    ).length;
    const fromAlias = resolution.resolved.filter(
        (item) => item.source === "alias",
    ).length;

    return {
        scannedAt: scannedAt.toISOString(),
        exchange: {
            name: PINTU_TARGET.name,
            slug: PINTU_TARGET.slug,
            cmcId: PINTU_TARGET.exchangeCmcId,
        },
        totals: {
            proCoins: normalized.coins.length + normalized.skipped.length,
            resolved: resolution.resolved.length,
            fromDb,
            fromAlias,
            synthetic: resolution.synthetic.length,
            conflicts: resolution.conflicts.length,
            skipped: normalized.skipped.length,
        },
        resolved: resolution.resolved.map((item) => ({
            symbol: item.coin.symbol,
            name: item.coin.name,
            cmcId: item.cmcId,
            source: item.source,
        })),
        conflicts: resolution.conflicts,
        skipped: normalized.skipped,
        synthetic: resolution.synthetic.map((item) => ({
            symbol: item.coin.symbol,
            name: item.coin.name,
            cmcId: item.cmcId,
        })),
        aliases: resolution.aliases,
    };
}

/** Render the report for a terminal. */
export function renderPintuReport(report: PintuReport): string {
    const lines = [
        `pintu: ${report.totals.proCoins} Pro symbols`,
        `  resolved: ${report.totals.resolved} ` +
            `(db ${report.totals.fromDb}, alias ${report.totals.fromAlias}, ` +
            `synthetic ${report.totals.synthetic})`,
        `  skipped:  ${report.totals.skipped} ` +
            `(tokenized stocks and non-IDR pairs)`,
    ];

    if (report.aliases.length > 0) {
        lines.push(
            `  aliases:  ${report.aliases
                .map((item) => {
                    const suffix =
                        item.candidates.length > 1
                            ? ` (${item.candidates.length} candidates)`
                            : "";
                    return `${item.symbol}->${item.cmcId}${suffix}`;
                })
                .join(", ")}`,
        );
    }

    if (report.synthetic.length > 0) {
        lines.push(
            `  synthetic ids: ${report.synthetic
                .map((item) => `${item.symbol}->${item.cmcId}`)
                .join(", ")}`,
        );
    }

    if (report.conflicts.length > 0) {
        lines.push("  conflicts (skipped, resolve manually):");
        for (const conflict of report.conflicts) {
            const candidates = conflict.candidates
                .map((coin) => `${coin.cmcId} ${coin.name} (${coin.slug})`)
                .join(" | ");
            lines.push(`    ${conflict.symbol}: ${candidates}`);
        }
    }

    if (report.skipped.length > 0) {
        lines.push(
            `  skipped symbols: ${report.skipped
                .map((item) => `${item.symbol} (${item.reason})`)
                .join(", ")}`,
        );
    }

    return `${lines.join("\n")}\n`;
}
