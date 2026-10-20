import { lister } from "@arbitrator/sdk";

import {
    overrideKey,
    type Suggestion,
    type SuggestionsFile,
    writeSuggestions,
} from "./aliases";
import { CANONICAL_CHAINS } from "./chains";
import {
    askQuestions,
    JEV_DEFAULT_MODEL,
    type JevChoiceAnswer,
    type JevChoiceQuestion,
    type JevScoreAnswer,
    type JevScoreQuestion,
} from "./jev";
import { must } from "./lister";
import type { Snapshot } from "./types";

/**
 * The opt-in, confidence-gated Jev resolver.
 *
 * It looks only at snapshot rows the deterministic alias table could not place
 * (`unmapped` and not `unknown`) and runs two stages:
 *
 * 1. **propose** — a Choice over the candidate chains (lister's, plus the
 *    canonical seed vocabulary) picks the most likely chain per label;
 * 2. **verify** — a three-level Score asks, for the proposed pair, whether the
 *    two are *different*, *related but not the same*, or *one and the same*
 *    network. Only the `same` level is applied; `related` lands in the review
 *    queue rather than being forced into a merge.
 *
 * Verification matters: the Choice stage alone confidently merged unrelated
 * chains (`KMD`→`DCR`, `BTM`→`CKB`). Anything that is not clearly `same` is
 * left for a human, because a wrong chain merge creates a wrong transfer route.
 */

const NONE = "none_of_these";
const DEFAULT_THRESHOLD = 0.5;
const DEFAULT_BATCH_SIZE = 20;
const CANDIDATES_PER_LABEL = 30;
const SAMPLE_SYMBOLS = 5;

/** Ordered verification levels; `SAME_LEVEL` is the only one we apply. */
const SCORE_LEVELS = [
    "They are different blockchain networks.",
    "They are related but not clearly the same network: a variant, a layer-2, a migration, or a name that could plausibly mean either one.",
    "They are one and the same blockchain network.",
];
const SAME_LEVEL = SCORE_LEVELS.length - 1;

export type ResolveOptions = {
    dataDir: string;
    model?: string;
    /** Confidence floor on the `same` verification. */
    minConfidence?: number;
    batchSize?: number;
    /** Do not write the suggestions file; just report. */
    dryRun?: boolean;
};

export type ResolveSummary = {
    distinct: number;
    requests: number;
    accepted: number;
    review: number;
    suggestionsFile: SuggestionsFile;
};

type ChainRow = { id: number; code: string; name: string };

type Group = {
    label: string;
    hint?: string;
    exchangeSlugs: Set<string>;
    sampleSymbols: Set<string>;
};

type Proposal = { group: Group; chosen: ChainRow; confidence: number };

function squash(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function bigrams(value: string): Set<string> {
    const text = squash(value);
    const grams = new Set<string>();
    if (text.length === 0) return grams;
    if (text.length === 1) {
        grams.add(text);
        return grams;
    }
    for (let i = 0; i < text.length - 1; i += 1) {
        grams.add(text.slice(i, i + 2));
    }
    return grams;
}

function jaccard(a: ReadonlySet<string>, b: ReadonlySet<string>): number {
    if (a.size === 0 || b.size === 0) return 0;
    let intersection = 0;
    for (const gram of a) {
        if (b.has(gram)) intersection += 1;
    }
    return intersection / (a.size + b.size - intersection);
}

/** Rank a candidate chain against a raw exchange label. */
function score(label: string, chain: ChainRow): number {
    const text = squash(label);
    const code = squash(chain.code);
    const labelGrams = bigrams(label);

    let result = Math.max(
        jaccard(labelGrams, bigrams(chain.code)),
        jaccard(labelGrams, bigrams(chain.name)),
        jaccard(labelGrams, bigrams(`${chain.code} ${chain.name}`)),
    );

    if (text && text === code) result += 1;
    else if (text && code && (text.includes(code) || code.includes(text))) {
        result += 0.35;
    }

    return result;
}

function candidatesFor(
    label: string,
    chains: ChainRow[],
    limit: number,
): ChainRow[] {
    return chains
        .map((chain) => ({ chain, value: score(label, chain) }))
        .sort(
            (a, b) =>
                b.value - a.value || a.chain.code.localeCompare(b.chain.code),
        )
        .slice(0, limit)
        .map((entry) => entry.chain);
}

/** Collect the distinct unmapped labels, collapsing rows that share a label. */
function collectGroups(snapshot: Snapshot): Group[] {
    const groups = new Map<string, Group>();

    for (const row of snapshot.networks) {
        if (!row.unmapped || row.unknown) continue;
        if (!row.network.trim()) continue;

        const key = overrideKey(row.network, row.networkHint);
        let group = groups.get(key);
        if (!group) {
            group = {
                label: row.network,
                hint: row.networkHint,
                exchangeSlugs: new Set(),
                sampleSymbols: new Set(),
            };
            groups.set(key, group);
        }

        group.exchangeSlugs.add(row.exchangeSlug);
        if (group.sampleSymbols.size < SAMPLE_SYMBOLS) {
            group.sampleSymbols.add(row.exchangeSymbol);
        }
    }

    return [...groups.values()].sort((a, b) => a.label.localeCompare(b.label));
}

function choiceQuestion(
    id: string,
    candidates: ChainRow[],
    hasHint: boolean,
): JevChoiceQuestion {
    const criteria: Record<string, string | null> = {};
    for (const chain of candidates) {
        criteria[chain.code] = chain.code === chain.name ? null : chain.name;
    }
    criteria[NONE] = "A distinct chain not listed among the options.";

    const hintClause = hasHint
        ? ` The venue's machine id hint is \`labels.${id}.hint\`.`
        : "";
    return {
        type: "choice",
        instructions:
            `Which canonical chain does the exchange network label ` +
            `\`labels.${id}.raw\` denote?${hintClause}`,
        criteria,
    };
}

function verifyQuestion(id: string): JevScoreQuestion {
    return {
        type: "score",
        instructions:
            `Do \`pairs.${id}.label\` (an exchange's network label) and ` +
            `\`pairs.${id}.chain\` (a blockchain) refer to one and the same ` +
            `network? Judge the networks themselves, not a token issued on one.`,
        criteria: SCORE_LEVELS,
    };
}

async function proposeBatch(
    batch: Group[],
    chains: ChainRow[],
    model: string | undefined,
): Promise<Map<Group, JevChoiceAnswer>> {
    const labels: Record<
        string,
        { exchange: string; raw: string; hint?: string }
    > = {};
    const questions: Record<string, JevChoiceQuestion> = {};
    const groupById = new Map<string, Group>();

    batch.forEach((group, index) => {
        const id = `q${index}`;
        groupById.set(id, group);
        labels[id] = {
            exchange: [...group.exchangeSlugs].join(", "),
            raw: group.label,
            ...(group.hint ? { hint: group.hint } : {}),
        };
        questions[id] = choiceQuestion(
            id,
            candidatesFor(group.label, chains, CANDIDATES_PER_LABEL),
            group.hint !== undefined,
        );
    });

    const response = await askQuestions({
        state: {
            task: "Map each venue's raw network label to the canonical chain it denotes. Answer none_of_these when it is a distinct chain not offered for that label.",
            labels,
        },
        questions,
        model,
    });

    const answers = new Map<Group, JevChoiceAnswer>();
    for (const [id, group] of groupById) {
        const answer = response.answers[id];
        if (answer?.type === "choice") answers.set(group, answer);
    }
    return answers;
}

async function verifyBatch(
    proposals: Proposal[],
    model: string | undefined,
): Promise<Map<Group, JevScoreAnswer>> {
    const pairs: Record<string, { label: string; chain: string }> = {};
    const questions: Record<string, JevScoreQuestion> = {};
    const groupById = new Map<string, Group>();

    proposals.forEach((proposal, index) => {
        const id = `p${index}`;
        groupById.set(id, proposal.group);
        pairs[id] = {
            label: proposal.group.label,
            chain: `${proposal.chosen.code} (${proposal.chosen.name})`,
        };
        questions[id] = verifyQuestion(id);
    });

    const response = await askQuestions({
        state: { task: "Chain-name verification.", pairs },
        questions,
        model,
    });

    const answers = new Map<Group, JevScoreAnswer>();
    for (const [id, group] of groupById) {
        const answer = response.answers[id];
        if (answer?.type === "score") answers.set(group, answer);
    }
    return answers;
}

function buildSuggestion(
    group: Group,
    proposal: Proposal,
    verification: JevScoreAnswer | undefined,
    threshold: number,
): Suggestion {
    const level = verification
        ? Math.min(Math.round(verification.score), SAME_LEVEL)
        : 0;
    const accepted =
        level === SAME_LEVEL &&
        verification !== undefined &&
        verification.confidence >= threshold;

    return {
        label: group.label,
        ...(group.hint ? { hint: group.hint } : {}),
        exchangeSlugs: [...group.exchangeSlugs],
        sampleSymbols: [...group.sampleSymbols],
        chainCode: proposal.chosen.code,
        chainName: proposal.chosen.name,
        level,
        score: verification?.score ?? 0,
        confidence: verification?.confidence ?? 0,
        probabilities: verification?.probabilities ?? {},
        proposalConfidence: proposal.confidence,
        accepted,
    };
}

function noneSuggestion(group: Group, confidence: number): Suggestion {
    return {
        label: group.label,
        ...(group.hint ? { hint: group.hint } : {}),
        exchangeSlugs: [...group.exchangeSlugs],
        sampleSymbols: [...group.sampleSymbols],
        chainCode: NONE,
        chainName: NONE,
        level: 0,
        score: 0,
        confidence: 0,
        probabilities: {},
        proposalConfidence: confidence,
        accepted: false,
    };
}

export async function resolveAliases(
    snapshot: Snapshot,
    options: ResolveOptions,
): Promise<ResolveSummary> {
    const threshold = options.minConfidence ?? DEFAULT_THRESHOLD;
    const batchSize = options.batchSize ?? DEFAULT_BATCH_SIZE;
    const model = options.model ?? JEV_DEFAULT_MODEL;

    const groups = collectGroups(snapshot);
    const listerChains = must(
        "list chains",
        await lister.chain.get({ query: { limit: -1 } }),
    ).data as ChainRow[];

    // Candidate vocabulary = lister's own chains plus every canonical code the
    // alias table knows, so a label can be proposed a canonical code that
    // lister does not have yet (the accepted suggestion creates it on import).
    const byCode = new Map<string, ChainRow>();
    for (const chain of CANONICAL_CHAINS) {
        byCode.set(chain.code, { id: -1, code: chain.code, name: chain.name });
    }
    for (const chain of listerChains) byCode.set(chain.code, chain);
    const chains = [...byCode.values()];
    const chainByCode = new Map(chains.map((chain) => [chain.code, chain]));

    const accepted: Suggestion[] = [];
    const review: Suggestion[] = [];
    let requests = 0;

    // Stage 1: propose a candidate per label.
    const proposals: Proposal[] = [];
    for (let index = 0; index < groups.length; index += batchSize) {
        const batch = groups.slice(index, index + batchSize);
        const answers = await proposeBatch(batch, chains, model);
        requests += 1;

        for (const group of batch) {
            const answer = answers.get(group);
            const chosen = answer ? chainByCode.get(answer.choice) : undefined;

            if (!answer || answer.choice === NONE || !chosen) {
                review.push(noneSuggestion(group, answer?.confidence ?? 0));
                continue;
            }
            proposals.push({ group, chosen, confidence: answer.confidence });
        }
    }

    // Stage 2: verify each proposal; apply only the `same` level.
    for (let index = 0; index < proposals.length; index += batchSize) {
        const batch = proposals.slice(index, index + batchSize);
        const answers = await verifyBatch(batch, model);
        requests += 1;

        for (const proposal of batch) {
            const suggestion = buildSuggestion(
                proposal.group,
                proposal,
                answers.get(proposal.group),
                threshold,
            );
            (suggestion.accepted ? accepted : review).push(suggestion);
        }
    }

    const suggestionsFile: SuggestionsFile = {
        generatedAt: new Date().toISOString(),
        model,
        threshold,
        accepted,
        review,
    };

    if (!options.dryRun) {
        await writeSuggestions(options.dataDir, suggestionsFile);
    }

    return {
        distinct: groups.length,
        requests,
        accepted: accepted.length,
        review: review.length,
        suggestionsFile,
    };
}
