import { mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";

import type { Snapshot, SnapshotManifest } from "./types";

const EXCHANGES_FILE = "exchanges.json";
const CRYPTOCURRENCIES_FILE = "cryptocurrencies.json";
const MARKETS_FILE = "markets.json";
const MANIFEST_FILE = "manifest.json";

/** Default location: `<app>/data`, next to `src`. */
export function defaultDataDir(): string {
    return resolve(import.meta.dir, "..", "data");
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
    await Bun.write(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

/**
 * Persist a snapshot as separate, human-readable files. Splitting by entity
 * keeps diffs reviewable and lets the importer stream one concern at a time.
 */
export async function writeSnapshot(
    dataDir: string,
    snapshot: Snapshot,
): Promise<void> {
    await mkdir(dataDir, { recursive: true });

    const manifest: SnapshotManifest = {
        scrapedAt: snapshot.scrapedAt,
        source: snapshot.source,
        counts: {
            exchanges: snapshot.exchanges.length,
            cryptocurrencies: snapshot.cryptocurrencies.length,
            markets: snapshot.markets.length,
        },
    };

    await Promise.all([
        writeJson(join(dataDir, EXCHANGES_FILE), snapshot.exchanges),
        writeJson(
            join(dataDir, CRYPTOCURRENCIES_FILE),
            snapshot.cryptocurrencies,
        ),
        writeJson(join(dataDir, MARKETS_FILE), snapshot.markets),
        writeJson(join(dataDir, MANIFEST_FILE), manifest),
    ]);
}

async function readJson<T>(filePath: string): Promise<T> {
    const file = Bun.file(filePath);

    if (!(await file.exists())) {
        throw new Error(
            `Snapshot file not found: ${filePath}. Run the collector with --scrape first.`,
        );
    }

    return (await file.json()) as T;
}

/** Read a previously written snapshot from disk. */
export async function readSnapshot(dataDir: string): Promise<Snapshot> {
    const [exchanges, cryptocurrencies, markets, manifest] = await Promise.all([
        readJson<Snapshot["exchanges"]>(join(dataDir, EXCHANGES_FILE)),
        readJson<Snapshot["cryptocurrencies"]>(
            join(dataDir, CRYPTOCURRENCIES_FILE),
        ),
        readJson<Snapshot["markets"]>(join(dataDir, MARKETS_FILE)),
        readJson<SnapshotManifest>(join(dataDir, MANIFEST_FILE)),
    ]);

    return {
        scrapedAt: manifest.scrapedAt,
        source: manifest.source,
        exchanges,
        cryptocurrencies,
        markets,
    };
}
