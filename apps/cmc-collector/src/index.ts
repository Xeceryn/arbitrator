#!/usr/bin/env bun
import { formatError } from "./cmc";
import { EXCHANGE_TARGETS, INDODAX_TARGET } from "./config";
import type { ImportSummary } from "./import";
import { scrape } from "./scrape";
import { defaultDataDir, readSnapshot, writeSnapshot } from "./storage";

type Mode =
    | "scrape"
    | "import"
    | "all"
    | "indodax"
    | "indodax-symbols"
    | "pintu";

type CliOptions = {
    mode: Mode;
    prune: boolean;
    dryRun: boolean;
    unmappedChain: boolean;
    dataDir: string;
    outPath: string | undefined;
    help: boolean;
};

function parseArgs(argv: string[]): CliOptions {
    const wantsHelp = argv.includes("--help") || argv.includes("-h");
    const wantsAll = argv.includes("--all");
    const wantsIndodax =
        argv.includes("--indodax") || argv.includes("--indodax-scan");
    const wantsSymbols = argv.includes("--indodax-symbols");
    const wantsPintu = argv.includes("--pintu");
    const wantsScrape = argv.includes("--scrape") || wantsAll;
    const wantsImport = argv.includes("--import") || wantsAll;

    let mode: Mode = "scrape";
    if (wantsPintu) mode = "pintu";
    else if (wantsSymbols) mode = "indodax-symbols";
    else if (wantsIndodax) mode = "indodax";
    else if (wantsImport && wantsScrape) mode = "all";
    else if (wantsImport) mode = "import";

    let dataDir = defaultDataDir();
    const dataDirIndex = argv.findIndex(
        (arg) => arg === "--data-dir" || arg === "--dataDir",
    );
    if (dataDirIndex !== -1) {
        const value = argv[dataDirIndex + 1];
        if (value && !value.startsWith("-")) dataDir = value;
    }

    const outIndex = argv.findIndex((arg) => arg === "--out");
    const outValue = outIndex === -1 ? undefined : argv[outIndex + 1];
    const outPath =
        outValue && !outValue.startsWith("-") ? outValue : undefined;

    const known = new Set([
        "--scrape",
        "--import",
        "--all",
        "--indodax",
        "--indodax-scan",
        "--indodax-symbols",
        "--pintu",
        "--prune",
        "--dry-run",
        "--no-unmapped-chain",
        "--data-dir",
        "--dataDir",
        "--out",
        "--help",
        "-h",
    ]);
    for (const arg of argv) {
        if (
            arg.startsWith("-") &&
            !known.has(arg) &&
            arg !== dataDir &&
            arg !== outPath
        ) {
            console.warn(`warning: unknown argument "${arg}"`);
        }
    }

    return {
        mode,
        prune: argv.includes("--prune"),
        dryRun: argv.includes("--dry-run"),
        unmappedChain: !argv.includes("--no-unmapped-chain"),
        dataDir,
        outPath,
        help: wantsHelp,
    };
}

function printHelp(): void {
    console.log(`cmc-collector — scrape CoinMarketCap + Indodax + Pintu into lister

Usage:
  bun run src/index.ts [options]

Modes (default: --scrape):
  --scrape           Scrape CMC and write the snapshot to the data directory.
  --import           Import the stored snapshot into the lister database.
  --all              Scrape, then import.
  --indodax          Scan https://indodax.com/api/pairs live and reconcile only
                     Indodax: toggle trade and every chain's withdraw/deposit
                     from is_market_suspended/is_maintenance, delete markets no
                     longer listed, and delete coins left with no market.
                     Always prunes; no CMC pair scrape.
  --indodax-symbols  Regenerate the sender worker's Indodax websocket pair
                     table (apps/sender/src/workers/orderbooks/
                     indodax-symbols.ts) from https://indodax.com/api/pairs.
                     Uses the same IDR-only filter, CMC id aliases and
                     old_ticker_id preference as the importer.
  --pintu            Scan Pintu Pro live. Pintu is not on CMC, so its tickers
                     are matched against lister coins; a ticker with several
                     candidates is reported and skipped, an unmatched one gets
                     a synthetic CMC id in the reserved 1,999,000+ range.
                     Tokenized stocks and non-IDR pairs are skipped. The
                     resolution audit is written to data/pintu-symbols.json.
                     Missing markets are left untouched unless --prune.

Import options:
  --prune            Delete delisted markets instead of disabling trading.
                     (Deleting cascades the market's chain links.) With
                     --pintu it also enables deleting absent markets; without
                     it they are left untouched.
  --dry-run          Print the diff without writing (also works with --indodax
                     and --pintu).
  --out <path>       With --indodax-symbols: write somewhere other than the
                     sender worker file.
  --no-unmapped-chain
                     Do not link new markets to the placeholder UNMPD chain.

General:
  --data-dir <path>  Snapshot directory (default: <app>/data).
  -h, --help         Show this help.

Environment:
  DATABASE_URL       lister database (required for --import/--indodax/--pintu).

All scraping is keyless: CMC's public data-api for the CMC venues, Indodax's
public pair list, and Pintu's Pro web APIs.`);
}

async function runScrape(dataDir: string): Promise<void> {
    console.log(
        `scraping ${EXCHANGE_TARGETS.length} exchanges (CMC + Indodax)...`,
    );
    const snapshot = await scrape(EXCHANGE_TARGETS);
    await writeSnapshot(dataDir, snapshot);

    console.log(
        `snapshot written to ${dataDir}: ` +
            `${snapshot.exchanges.length} exchanges, ` +
            `${snapshot.cryptocurrencies.length} cryptocurrencies, ` +
            `${snapshot.markets.length} markets`,
    );
}

async function runImport(
    dataDir: string,
    options: {
        prune: boolean;
        dryRun: boolean;
        unmappedChain: boolean;
    },
): Promise<void> {
    console.log(`reading snapshot from ${dataDir}...`);
    const snapshot = await readSnapshot(dataDir);
    const { importSnapshot, pingLister } = await import("./import");

    await pingLister();
    const summary = await importSnapshot(snapshot, options);

    printSummary(summary, "import");
}

/**
 * Indodax-only live scan. Unlike `--all`, this never reads a CMC snapshot: it
 * re-fetches Indodax pairs, applies maintenance/suspension to the existing
 * assignments, removes markets the venue delisted (and coins left with no
 * market), and only then falls back to CMC's coin map for canonical metadata.
 */
async function runIndodaxScan(options: {
    dryRun: boolean;
    unmappedChain: boolean;
}): Promise<void> {
    const { importSnapshot, pingLister } = await import("./import");

    await pingLister();
    console.log("scanning indodax...");
    const snapshot = await scrape([INDODAX_TARGET]);
    const summary = await importSnapshot(snapshot, {
        prune: true,
        pruneOrphanCoins: true,
        dryRun: options.dryRun,
        unmappedChain: options.unmappedChain,
    });

    printSummary(summary, "indodax scan");
}

/**
 * Pintu-only live scan. Pintu has no CMC ids, so the scan resolves its tickers
 * against lister first and reports every conflict/synthetic id before importing.
 */
async function runPintuReconcile(options: {
    dryRun: boolean;
    prune: boolean;
    unmappedChain: boolean;
    dataDir: string;
}): Promise<void> {
    const { runPintuScan } = await import("./pintu-scan");

    const { summary, reportPath } = await runPintuScan(options);

    console.log(`pintu report: ${reportPath}`);
    printSummary(summary, "pintu scan");
}

async function runIndodaxSymbols(options: {
    dryRun: boolean;
    outPath: string | undefined;
}): Promise<void> {
    const {
        buildIndodaxSubscriptionTable,
        regenerateIndodaxSymbols,
        renderIndodaxSymbolsModule,
    } = await import("./indodax-symbols");
    const { fetchIndodaxPairs } = await import("./indodax");

    console.log("fetching indodax pairs...");
    const pairs = await fetchIndodaxPairs();

    if (options.dryRun) {
        const table = buildIndodaxSubscriptionTable(pairs);
        process.stdout.write(renderIndodaxSymbolsModule(table));
        return;
    }

    const { filePath, count } = await regenerateIndodaxSymbols({
        filePath: options.outPath,
        pairs,
    });

    console.log(`wrote ${count} indodax pair ids to ${filePath}`);
}

function printSummary(summary: ImportSummary, label: string): void {
    const prefix = summary.dryRun ? "[dry-run] " : "";
    console.log(`${prefix}${label} complete.`);
    console.log(
        `${prefix}exchanges:       +${summary.exchanges.created} ~${summary.exchanges.updated}`,
    );
    console.log(
        `${prefix}cryptocurrencies: +${summary.cryptocurrencies.created} ` +
            `~${summary.cryptocurrencies.updated} -${summary.cryptocurrencies.removed}`,
    );
    console.log(
        `${prefix}markets:          +${summary.markets.created} ~${summary.markets.updated} ` +
            `disabled:${summary.markets.disabled} removed:${summary.markets.removed}`,
    );
    console.log(
        `${prefix}chain links:      +${summary.chainLinks.created} ` +
            `updated:${summary.chainLinks.updated}`,
    );
    if (summary.warnings.length > 0) {
        console.log(`${prefix}warnings: ${summary.warnings.length}`);
    }
}

async function main(): Promise<void> {
    const options = parseArgs(process.argv.slice(2));

    if (options.help) {
        printHelp();
        return;
    }

    if (options.mode === "scrape" || options.mode === "all") {
        await runScrape(options.dataDir);
    }

    if (options.mode === "import" || options.mode === "all") {
        await runImport(options.dataDir, {
            prune: options.prune,
            dryRun: options.dryRun,
            unmappedChain: options.unmappedChain,
        });
    }

    if (options.mode === "indodax") {
        await runIndodaxScan({
            dryRun: options.dryRun,
            unmappedChain: options.unmappedChain,
        });
    }

    if (options.mode === "indodax-symbols") {
        await runIndodaxSymbols({
            dryRun: options.dryRun,
            outPath: options.outPath,
        });
    }

    if (options.mode === "pintu") {
        await runPintuReconcile({
            dryRun: options.dryRun,
            prune: options.prune,
            unmappedChain: options.unmappedChain,
            dataDir: options.dataDir,
        });
    }
}

main()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(`cmc-collector failed: ${formatError(error)}`);
        process.exit(1);
    });
