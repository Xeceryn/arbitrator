import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import { lister } from "@arbitrator/sdk";

import { importSnapshot, must, pingLister, type ImportSummary } from "./import";
import {
    buildPintuReport,
    buildPintuSnapshot,
    fetchPintuCoins,
    renderPintuReport,
    resolvePintuCoins,
    type PintuReport,
} from "./pintu";

export type PintuScanOptions = {
    dryRun: boolean;
    /** Delete Pintu markets missing from the live symbol list. */
    prune: boolean;
    /** Link fresh markets to the `UNMPD` placeholder chain. */
    unmappedChain: boolean;
    dataDir: string;
};

export type PintuScanResult = {
    summary: ImportSummary;
    report: PintuReport;
    reportPath: string;
};

/**
 * Live Pintu Pro reconcile.
 *
 * Pintu has no CMC ids, so the scan resolves its ticker list against lister
 * first. Conflicts and synthetic ids are written to `data/pintu-symbols.json`
 * for review; the import then only sees ordinary CMC-id-shaped rows.
 *
 * Missing markets are left untouched unless `--prune` is passed: a ticker that
 * became ambiguous (two lister coins) must not silently disable an existing
 * market on the next scan.
 */
export async function runPintuScan(
    options: PintuScanOptions,
): Promise<PintuScanResult> {
    await pingLister();
    console.log("scanning pintu...");

    const normalized = await fetchPintuCoins();
    const dbCoins = must(
        "list cryptocurrencies",
        await lister.cryptocurrency.get({ query: { limit: -1 } }),
    ).data;
    const resolution = resolvePintuCoins(normalized.coins, dbCoins);
    const report = buildPintuReport(normalized, resolution);

    process.stdout.write(renderPintuReport(report));

    const reportPath = await writePintuReport(options.dataDir, report);

    if (resolution.resolved.length === 0) {
        throw new Error("pintu: no symbols resolved; nothing to import");
    }

    const summary = await importSnapshot(buildPintuSnapshot(resolution), {
        prune: options.prune,
        pruneOrphanCoins: options.prune,
        dryRun: options.dryRun,
        unmappedChain: options.unmappedChain,
        keepMissingMarkets: !options.prune,
    });

    return { summary, report, reportPath };
}

/** Persist the resolution audit next to the other collector snapshots. */
async function writePintuReport(
    dataDir: string,
    report: PintuReport,
): Promise<string> {
    await mkdir(dataDir, { recursive: true });

    const filePath = join(dataDir, "pintu-symbols.json");
    await Bun.write(filePath, `${JSON.stringify(report, null, 2)}\n`);

    return filePath;
}
