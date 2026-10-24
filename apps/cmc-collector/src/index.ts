#!/usr/bin/env bun
import { formatError } from "./cmc";
import { EXCHANGE_TARGETS, INDODAX_TARGET } from "./config";
import type { ImportSummary } from "./import";
import { scrape } from "./scrape";
import { defaultDataDir, readSnapshot, writeSnapshot } from "./storage";

type Mode = "scrape" | "import" | "all" | "indodax";

type CliOptions = {
    mode: Mode;
    prune: boolean;
    dryRun: boolean;
    unmappedChain: boolean;
    dataDir: string;
    help: boolean;
};

function parseArgs(argv: string[]): CliOptions {
    const wantsHelp = argv.includes("--help") || argv.includes("-h");
    const wantsAll = argv.includes("--all");
    const wantsIndodax =
        argv.includes("--indodax") || argv.includes("--indodax-scan");
    const wantsScrape = argv.includes("--scrape") || wantsAll;
    const wantsImport = argv.includes("--import") || wantsAll;

    let mode: Mode = "scrape";
    if (wantsIndodax) mode = "indodax";
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

    const known = new Set([
        "--scrape",
        "--import",
        "--all",
        "--indodax",
        "--indodax-scan",
        "--prune",
        "--dry-run",
        "--no-unmapped-chain",
        "--data-dir",
        "--dataDir",
        "--help",
        "-h",
    ]);
    for (const arg of argv) {
        if (arg.startsWith("-") && !known.has(arg) && arg !== dataDir) {
            console.warn(`warning: unknown argument "${arg}"`);
        }
    }

    return {
        mode,
        prune: argv.includes("--prune"),
        dryRun: argv.includes("--dry-run"),
        unmappedChain: !argv.includes("--no-unmapped-chain"),
        dataDir,
        help: wantsHelp,
    };
}

function printHelp(): void {
    console.log(`cmc-collector — scrape CoinMarketCap + Indodax into lister

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

Import options:
  --prune            Delete delisted markets instead of disabling trading.
                     (Deleting cascades the market's chain links.)
  --dry-run          Print the diff without writing (also works with --indodax).
  --no-unmapped-chain
                     Do not link new markets to the placeholder UNMPD chain.

General:
  --data-dir <path>  Snapshot directory (default: <app>/data).
  -h, --help         Show this help.

Environment:
  DATABASE_URL       lister database (required for --import/--indodax).

All scraping is keyless: CMC's public data-api for every venue except Indodax,
which is read from https://indodax.com/api/pairs so its own display tickers and
maintenance/suspension flags are preserved.`);
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
}

main()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(`cmc-collector failed: ${formatError(error)}`);
        process.exit(1);
    });
