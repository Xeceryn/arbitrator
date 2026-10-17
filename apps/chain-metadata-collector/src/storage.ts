import { mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";

import type { Snapshot } from "./types";

const NETWORKS_FILE = "networks.json";
const MANIFEST_FILE = "manifest.json";

type SnapshotManifest = {
    scrapedAt: string;
    source: Snapshot["source"];
    exchanges: Snapshot["exchanges"];
};

/** Default location: `<app>/data`, next to `src`. */
export function defaultDataDir(): string {
    return resolve(import.meta.dir, "..", "data");
}

async function writeJson(filePath: string, value: unknown): Promise<void> {
    await Bun.write(filePath, `${JSON.stringify(value, null, 2)}\n`);
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

/** Persist a snapshot as a manifest plus the flat network rows. */
export async function writeSnapshot(
    dataDir: string,
    snapshot: Snapshot,
): Promise<void> {
    await mkdir(dataDir, { recursive: true });

    const manifest: SnapshotManifest = {
        scrapedAt: snapshot.scrapedAt,
        source: snapshot.source,
        exchanges: snapshot.exchanges,
    };

    await Promise.all([
        writeJson(join(dataDir, NETWORKS_FILE), snapshot.networks),
        writeJson(join(dataDir, MANIFEST_FILE), manifest),
    ]);
}

/** Read a previously written snapshot from disk. */
export async function readSnapshot(dataDir: string): Promise<Snapshot> {
    const [networks, manifest] = await Promise.all([
        readJson<Snapshot["networks"]>(join(dataDir, NETWORKS_FILE)),
        readJson<SnapshotManifest>(join(dataDir, MANIFEST_FILE)),
    ]);

    return {
        scrapedAt: manifest.scrapedAt,
        source: manifest.source,
        exchanges: manifest.exchanges,
        networks,
    };
}
