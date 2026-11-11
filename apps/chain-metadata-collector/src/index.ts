#!/usr/bin/env bun
import { analyzeNetworks, printAnalysis, writeAnalysis } from "./analyze";
import { normalizeExchangeSlug, type ExchangeSlug } from "./config";
import { formatError } from "./http";
import { importSnapshot, type ImportSummary } from "./import";
import { pingLister } from "./lister";
import { printSnapshotReport } from "./report";
import { scrape } from "./scrape";
import { defaultDataDir, readSnapshot, writeSnapshot } from "./storage";
import type { Snapshot } from "./types";

type Mode = "scrape" | "import" | "all" | "analyze";

type CliOptions = {
    mode: Mode;
    dryRun: boolean;
    canonicalize: boolean;
    replaceUnmapped: boolean;
    only: ExchangeSlug[];
    dataDir: string;
    help: boolean;
};

const KNOWN_FLAGS = new Set([
    "--scrape",
    "--import",
    "--all",
    "--analyze",
    "--dry-run",
    "--no-canonicalize",
    "--replace-unmapped",
    "--only",
    "--data-dir",
    "--dataDir",
    "--help",
    "-h",
]);

function flagValue(argv: string[], name: string): string | undefined {
    const index = argv.indexOf(name);
    if (index !== -1) {
        const value = argv[index + 1];
        if (value && !value.startsWith("-")) return value;
    }
    const inline = argv.find((arg) => arg.startsWith(`${name}=`));
    if (inline) return inline.slice(name.length + 1);
    return undefined;
}

function parseOnly(argv: string[]): ExchangeSlug[] {
    const raw = flagValue(argv, "--only");
    if (!raw) return [];

    const wanted = raw
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean);

    const normalized: ExchangeSlug[] = [];
    const invalid: string[] = [];
    for (const slug of wanted) {
        const value = normalizeExchangeSlug(slug);
        if (value) normalized.push(value);
        else invalid.push(slug);
    }

    if (invalid.length > 0) {
        throw new Error(`unknown exchange(s) in --only: ${invalid.join(", ")}`);
    }

    return [...new Set(normalized)];
}

function parseArgs(argv: string[]): CliOptions {
    const wantsAll = argv.includes("--all");
    const wantsScrape = argv.includes("--scrape") || wantsAll;
    const wantsImport = argv.includes("--import") || wantsAll;
    const wantsAnalyze = argv.includes("--analyze");

    let mode: Mode = "scrape";
    if (wantsAnalyze) mode = "analyze";
    else if (wantsImport && wantsScrape) mode = "all";
    else if (wantsImport) mode = "import";

    let dataDir = defaultDataDir();
    const dataDirValue =
        flagValue(argv, "--data-dir") ?? flagValue(argv, "--dataDir");
    if (dataDirValue) dataDir = dataDirValue;

    for (const arg of argv) {
        if (
            arg.startsWith("-") &&
            !KNOWN_FLAGS.has(arg) &&
            !arg.startsWith("--only=")
        ) {
            console.warn(`warning: unknown argument "${arg}"`);
        }
    }

    return {
        mode,
        dryRun: argv.includes("--dry-run"),
        canonicalize: !argv.includes("--no-canonicalize"),
        replaceUnmapped: argv.includes("--replace-unmapped"),
        only: parseOnly(argv),
        dataDir,
        help: argv.includes("--help") || argv.includes("-h"),
    };
}

function printHelp(): void {
    console.log(`chain-metadata-collector — crawl exchange coin/chain state into lister

Usage:
  bun run src/index.ts [options]

Modes (default: --scrape):
  --scrape             Crawl each exchange's API and write a snapshot.
  --import             Import the stored snapshot into lister.
  --analyze            Build the cross-exchange network-equivalence report
                       (contract-address + naming evidence) from the snapshot;
                       writes network-equivalence.json. Read-only.
  --all                Scrape, then import.

Scrape options:
  --only <a,b>         Only crawl these exchanges.
                       (binance, gate, indodax, kucoin, mexc, okx, bybit,
                       bitget; gate-io is an alias)
  --no-canonicalize    Keep each exchange's raw chain label (skip alias rules).

Import options:
  --dry-run            Print the diff without writing.
  --replace-unmapped   Also delete a market's UNMPD placeholder link once a
                       real chain link exists. Off by default: the placeholder
                       marks "not yet verified" and the operator removes it by
                       hand, since only they can confirm two venues settle on
                       the same network.

General:
  --data-dir <path>    Snapshot directory (default: <app>/data).
  -h, --help           Show this help.

Environment:
  LISTER_URL           lister service (default: http://localhost:3001).
  MEXC_API_KEY         MEXC API key (required to crawl MEXC).
  MEXC_API_SECRET      MEXC API secret.

Chain names are resolved deterministically (src/chains.ts): the alias table
plus qualifier rules (XETH/XEVM -> X, Bitcoin SegWit/BRC/Runes -> BTC). Labels
that still do not resolve become their own chain.

Other exchanges are crawled keylessly. Indodax publishes no chain data, so its
coins are kept on the UNMPD placeholder.`);
}

async function runScrape(options: CliOptions): Promise<Snapshot> {
    const snapshot = await scrape({
        only: options.only,
        canonicalize: options.canonicalize,
    });

    printSnapshotReport(snapshot);

    return snapshot;
}

function printImportSummary(summary: ImportSummary): void {
    const prefix = summary.dryRun ? "[dry-run] " : "";
    console.log(`\n${prefix}import complete.`);
    console.log(
        `${prefix}chains:   +${summary.chains.created} reused:${summary.chains.reused}`,
    );
    console.log(
        `${prefix}links:    +${summary.links.created} ~${summary.links.updated} =${summary.links.unchanged}`,
    );
    console.log(`${prefix}unmapped links removed: ${summary.unmappedRemoved}`);
    console.log(
        `${prefix}skipped:  exchanges:${summary.skipped.exchange} markets:${summary.skipped.market}`,
    );
    if (summary.warnings.length > 0) {
        console.log(`${prefix}warnings: ${summary.warnings.length}`);
    }
}

async function runImport(options: CliOptions): Promise<void> {
    console.log(`\nreading snapshot from ${options.dataDir}...`);
    const snapshot = await readSnapshot(options.dataDir);

    await pingLister();
    const summary = await importSnapshot(snapshot, {
        dryRun: options.dryRun,
        replaceUnmapped: options.replaceUnmapped,
        only: options.only,
    });

    printImportSummary(summary);
}

async function runAnalyze(options: CliOptions): Promise<void> {
    console.log(`\nreading snapshot from ${options.dataDir}...`);
    const snapshot = await readSnapshot(options.dataDir);

    const analysis = analyzeNetworks(snapshot);
    printAnalysis(analysis);

    if (!options.dryRun) {
        await writeAnalysis(options.dataDir, analysis);
        console.log(
            `\nanalysis written to ${options.dataDir}/network-equivalence.json`,
        );
    }
}

async function main(): Promise<void> {
    const options = parseArgs(process.argv.slice(2));

    if (options.help) {
        printHelp();
        return;
    }

    if (options.mode === "scrape") {
        const snapshot = await runScrape(options);
        await writeSnapshot(options.dataDir, snapshot);
        console.log(`\nsnapshot written to ${options.dataDir}`);
    } else if (options.mode === "import") {
        await runImport(options);
    } else if (options.mode === "analyze") {
        await runAnalyze(options);
    } else {
        // --all: scrape, persist for audit, then import in one pass.
        const snapshot = await runScrape(options);
        await writeSnapshot(options.dataDir, snapshot);
        console.log(`\nsnapshot written to ${options.dataDir}`);

        await pingLister();
        const summary = await importSnapshot(snapshot, {
            dryRun: options.dryRun,
            replaceUnmapped: options.replaceUnmapped,
            only: options.only,
        });
        printImportSummary(summary);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
        console.error(`chain-metadata-collector failed: ${formatError(error)}`);
        process.exit(1);
    });
