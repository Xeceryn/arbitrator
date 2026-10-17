import { mkdir } from "node:fs/promises";
import { join } from "node:path";

/**
 * Suggestions produced by the opt-in `--resolve` step (Jev). They are a working
 * artifact, not a source of truth: `accepted` entries can be applied to an
 * import with `--use-suggestions`, and should eventually be folded into the
 * deterministic `CHAIN_ALIASES` table in `chains.ts`.
 */

export const SUGGESTIONS_FILE = "chain-aliases.generated.json";

export type Suggestion = {
    /** Raw exchange network label, e.g. `BEP20(BSC)`. */
    label: string;
    /** Adapter hint, when the venue provides one (KuCoin `chainId`). */
    hint?: string;
    exchangeSlugs: string[];
    sampleSymbols: string[];
    /** Suggested lister chain code, or `none_of_these`. */
    chainCode: string;
    chainName: string;
    /** Verified relation: 0 different, 1 related, 2 same. */
    level: number;
    /** Probability-weighted score behind `level`. */
    score: number;
    confidence: number;
    probabilities: Record<string, number>;
    /** Stage-one Choice confidence that picked this candidate. */
    proposalConfidence: number;
    /** True when the verification said `same` and confidence cleared the floor. */
    accepted: boolean;
};

export type SuggestionsFile = {
    generatedAt: string;
    model: string;
    threshold: number;
    accepted: Suggestion[];
    review: Suggestion[];
};

/**
 * Key a suggestion to the snapshot row it applies to. Rows that share a label
 * and hint share a resolution, so a label may collapse many coins/exchanges.
 */
export function overrideKey(label: string, hint?: string): string {
    return `${label.trim()}||${(hint ?? "").trim()}`;
}

export function suggestionsPath(dataDir: string): string {
    return join(dataDir, SUGGESTIONS_FILE);
}

export async function writeSuggestions(
    dataDir: string,
    file: SuggestionsFile,
): Promise<void> {
    await mkdir(dataDir, { recursive: true });
    await Bun.write(
        suggestionsPath(dataDir),
        `${JSON.stringify(file, null, 2)}\n`,
    );
}
