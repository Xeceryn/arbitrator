import { UNMAPPED_CHAIN } from "./config";
import type { Snapshot } from "./types";

/**
 * Print a human-readable digest of a snapshot: per-exchange counts plus the
 * most common *unmapped* chain labels, which is the queue of naming debt the
 * operator can fold into `src/chains.ts`.
 */
export function printSnapshotReport(snapshot: Snapshot): void {
    console.log("");
    console.log(
        `snapshot from ${snapshot.scrapedAt}: ${snapshot.networks.length} network entries`,
    );

    for (const exchange of snapshot.exchanges) {
        const status =
            exchange.status === "ok"
                ? ""
                : `  [${exchange.status}${exchange.message ? `: ${exchange.message}` : ""}]`;
        console.log(
            `  ${exchange.slug.padEnd(10)} coins:${String(exchange.coins).padStart(4)} networks:${String(exchange.networks).padStart(5)}${status}`,
        );
    }

    const unknown = snapshot.networks.filter((row) => row.unknown);
    const unmapped = snapshot.networks.filter(
        (row) => row.unmapped && !row.unknown,
    );

    const unmappedCodes = new Set(unmapped.map((row) => row.chainCode));
    console.log(
        `  unmapped: ${unmappedCodes.size} distinct labels across ${unmapped.length} entries`,
    );
    if (unknown.length > 0) {
        console.log(
            `  unknown (no chain data → ${UNMAPPED_CHAIN.code}): ${unknown.length} entries`,
        );
    }

    const counts = new Map<string, number>();
    for (const row of unmapped) {
        counts.set(row.chainCode, (counts.get(row.chainCode) ?? 0) + 1);
    }

    const top = [...counts.entries()]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 15);

    if (top.length > 0) {
        console.log("  top unmapped chain codes:");
        for (const [code, count] of top) {
            console.log(`    ${code.padEnd(24)} ${count}`);
        }
    }
}
