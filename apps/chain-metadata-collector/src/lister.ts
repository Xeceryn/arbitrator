import { lister } from "@arbitrator/sdk";

/** Eden reports a failure as `{ status, value }`; render it readably. */
export function formatEdenError(error: unknown): string {
    if (error && typeof error === "object" && "value" in error) {
        const value = (error as { value?: unknown }).value;
        if (value !== undefined && value !== null) {
            if (
                typeof value === "object" &&
                "message" in value &&
                typeof (value as { message?: unknown }).message === "string"
            ) {
                return (value as { message: string }).message;
            }
            return typeof value === "string" ? value : JSON.stringify(value);
        }
    }
    return String(error);
}

/**
 * Every lister call resolves to Eden's `{ data, error }` result. `must` unwraps
 * it and turns a failed call into a thrown error.
 */
export type Outcome<T> = { data: T | null; error: unknown };

export function must<T>(label: string, result: Outcome<T>): T {
    if (result.error) {
        throw new Error(`${label}: ${formatEdenError(result.error)}`);
    }
    if (result.data === null) {
        throw new Error(`${label}: lister returned no data`);
    }
    return result.data;
}

/** Confirm the lister service is reachable before doing any work. */
export async function pingLister(): Promise<void> {
    must("ping lister", await lister.utility.ping.get());
}
