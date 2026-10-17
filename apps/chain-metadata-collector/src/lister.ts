import { listerClient } from "@arbitrator/sdk";

/**
 * The lister safe client resolves to a discriminated `{ isSuccess, data|error }`
 * result. `must` unwraps it and turns a failed call into a thrown error.
 */
export type Outcome<T> =
    | { isSuccess: true; data: T }
    | { isSuccess: false; error: unknown };

export function must<T>(label: string, result: Outcome<T>): T {
    if (!result.isSuccess) {
        const error = result.error as { message?: string } | undefined;
        throw new Error(`${label}: ${error?.message ?? String(result.error)}`);
    }
    return result.data;
}

/** Confirm the lister service is reachable before doing any work. */
export async function pingLister(): Promise<void> {
    must("ping lister", await listerClient.utility.ping());
}
