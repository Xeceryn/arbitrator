#!/usr/bin/env bun
import { formatError } from "./cmc";
import { EXCHANGE_TARGETS } from "./config";
import { scrape } from "./scrape";
import { defaultDataDir, readSnapshot, writeSnapshot } from "./storage";

type Mode = "scrape" | "import" | "all";

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
    const wantsScrape = argv.includes("--scrape") || wantsAll;
    const wantsImport = argv.includes("--import") || wantsAll;

    let mode: Mode = "scrape";
    if (wantsImport && wantsScrape) mode = "all";
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
    console.log(`cmc-collector — scrape CoinMarketCap and sync it into lister

Usage:
  bun run src/index.ts [options]

Modes (default: --scrape):
  --scrape           Scrape CMC and write the snapshot to the data directory.
  --import           Import the stored snapshot into the lister database.
  --all              Scrape, then import.

Import options:
  --prune            Delete delisted markets instead of disabling trading.
                     (Deleting cascades the market's chain links.)
  --dry-run          Print the diff without writing.
  --no-unmapped-chain
                     Do not link new markets to the placeholder UNMPD chain.

General:
  --data-dir <path>  Snapshot directory (default: <app>/data).
  -h, --help         Show this help.

Environment:
  DATABASE_URL       lister database (required for --import).

All scraping is keyless: it uses CMC's public data-api, so no API key is
needed.`);
}

async function runScrape(dataDir: string): Promise<void> {
    console.log(`scraping ${EXCHANGE_TARGETS.length} exchanges from CMC...`);
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

    const prefix = summary.dryRun ? "[dry-run] " : "";
    console.log(`${prefix}import complete.`);
    console.log(
        `${prefix}exchanges:       +${summary.exchanges.created} ~${summary.exchanges.updated}`,
    );
    console.log(
        `${prefix}cryptocurrencies: +${summary.cryptocurrencies.created} ~${summary.cryptocurrencies.updated}`,
    );
    console.log(
        `${prefix}markets:          +${summary.markets.created} ~${summary.markets.updated} ` +
            `disabled:${summary.markets.disabled} removed:${summary.markets.removed}`,
    );
    console.log(`${prefix}chain links:      +${summary.chainLinks.created}`);
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
}

main()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(`cmc-collector failed: ${formatError(error)}`);
        process.exit(1);
    });
