/**
 * Small fetch helper for the exchange public APIs.
 *
 * Every adapter returns JSON. Requests are retried with exponential backoff on
 * rate limits (429) and transient 5xx errors, because a few of these venues
 * throttle aggressively; a permanent error surfaces the status and a truncated
 * body so a blocked/geo-restricted venue is obvious in the logs rather than
 * silently producing an empty snapshot.
 */

import { HTTP_TIMEOUT_MS, USER_AGENT } from "./config";

export type FetchJsonOptions = RequestInit & {
    /** Extra attempts after the first. Default 3. */
    retries?: number;
};

const BASE_BACKOFF_MS = 1_000;
const MAX_BACKOFF_MS = 15_000;

const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

function backoffMs(attempt: number): number {
    return Math.min(BASE_BACKOFF_MS * 2 ** attempt, MAX_BACKOFF_MS);
}

/** Honor `Retry-After` when the server sends it, else exponential backoff. */
function retryDelayMs(response: Response, attempt: number): number {
    const header = response.headers.get("retry-after");
    if (header) {
        const seconds = Number(header);
        if (Number.isFinite(seconds) && seconds >= 0) {
            return Math.min(seconds * 1_000, MAX_BACKOFF_MS);
        }
    }
    return backoffMs(attempt);
}

export async function fetchJson<T>(
    url: string,
    init: FetchJsonOptions = {},
): Promise<T> {
    const { retries = 3, ...requestInit } = init;

    for (let attempt = 0; ; attempt += 1) {
        let response: Response;

        try {
            response = await fetch(url, {
                ...requestInit,
                headers: {
                    accept: "application/json",
                    "user-agent": USER_AGENT,
                    ...requestInit.headers,
                },
                signal:
                    requestInit.signal ?? AbortSignal.timeout(HTTP_TIMEOUT_MS),
            });
        } catch (error) {
            if (attempt >= retries) throw error;
            await sleep(backoffMs(attempt));
            continue;
        }

        if (response.ok) {
            return (await response.json()) as T;
        }

        const retryable = response.status === 429 || response.status >= 500;
        if (!retryable || attempt >= retries) {
            const body = await response.text().catch(() => "");
            const detail = body ? `: ${body.slice(0, 200)}` : "";
            throw new Error(
                `HTTP ${response.status} ${response.statusText} for ${url}${detail}`,
            );
        }

        await sleep(retryDelayMs(response, attempt));
    }
}

/** Best-effort, log-friendly rendering of an error value. */
export function formatError(error: unknown): string {
    if (error instanceof Error) {
        return error.message;
    }

    try {
        return JSON.stringify(error);
    } catch {
        return String(error);
    }
}
