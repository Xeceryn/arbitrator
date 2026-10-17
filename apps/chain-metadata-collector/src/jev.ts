/**
 * Minimal client for the TypeSafe AI "System One" endpoint (the Jev model),
 * used only by the opt-in `--resolve` step to propose canonical chain mappings
 * for labels the deterministic alias table does not know.
 *
 * We call the HTTP API directly (the wire format is stable and documented)
 * instead of pulling in `@typesafe-ai/sdk`; `fetchJson` already gives us
 * timeouts and retry/backoff on 429/5xx. The key is read from
 * `TYPESAFE_API_KEY`, falling back to the older `JEV_API_KEY`.
 */

import { typeSafeApiKey } from "@arbitrator/env-loader";

import { fetchJson } from "./http";

const JEV_URL = "https://api.typesafe.ai/v1/systemone";

export const JEV_DEFAULT_MODEL = "jev-latest";

const API_KEY_ENVS = ["TYPESAFE_API_KEY", "JEV_API_KEY"] as const;

/** A `choice` answer: one option, its full distribution, and confidence. */
export type JevChoiceAnswer = {
    type: "choice";
    choice: string;
    probabilities: Record<string, number>;
    confidence: number;
};

/** A `score` answer: a probability-weighted position across ordered levels. */
export type JevScoreAnswer = {
    type: "score";
    score: number;
    legend: Record<string, string>;
    probabilities: Record<string, number>;
    confidence: number;
};

export type JevAnswer = JevChoiceAnswer | JevScoreAnswer;

export type JevResponse = {
    model: string;
    answers: Record<string, JevAnswer>;
    usage: { input_tokens: number; output_tokens: number };
};

export type JevChoiceQuestion = {
    type: "choice";
    instructions: string;
    criteria: Record<string, string | null>;
};

export type JevScoreQuestion = {
    type: "score";
    instructions: string;
    criteria: string[];
};

export type JevQuestion = JevChoiceQuestion | JevScoreQuestion;

/** Thrown when no TypeSafe/Jev API key is configured. */
export class MissingJevKeyError extends Error {
    constructor() {
        super(
            `Jev API key missing; set ${API_KEY_ENVS.join(" or ")} to use --resolve.`,
        );
        this.name = "MissingJevKeyError";
    }
}

export function jevApiKey(): string | undefined {
    return typeSafeApiKey();
}

/**
 * Ask a batch of typed questions in one request. Every question is answered
 * independently against the shared `state`, which is how several labels get
 * resolved per call.
 */
export async function askQuestions(input: {
    state: unknown;
    questions: Record<string, JevQuestion>;
    model?: string;
}): Promise<JevResponse> {
    const apiKey = jevApiKey();
    if (!apiKey) throw new MissingJevKeyError();

    return fetchJson<JevResponse>(JEV_URL, {
        method: "POST",
        headers: {
            authorization: `Bearer ${apiKey}`,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            model: input.model ?? JEV_DEFAULT_MODEL,
            state: input.state,
            questions: input.questions,
        }),
    });
}
