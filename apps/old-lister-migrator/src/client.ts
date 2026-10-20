/**
 * The `{ message }` a lister route returned, when the error carries one.
 *
 * Eden resolves a failure to `{ status, value }`; declared route statuses
 * (404/409/500) return a `message` body, while a `422` validation failure does
 * not.
 */
export function errorMessage(error: unknown): string | undefined {
    if (error && typeof error === "object" && "value" in error) {
        const value = (error as { value?: unknown }).value;
        if (value && typeof value === "object" && "message" in value) {
            const message = (value as { message?: unknown }).message;
            if (typeof message === "string") return message;
        }
    }
    return undefined;
}

/** Eden reports a failure as `{ status, value }`; render it readably. */
export function formatEdenError(error: unknown): string {
    const message = errorMessage(error);
    if (message !== undefined) return message;

    if (error && typeof error === "object" && "value" in error) {
        const value = (error as { value?: unknown }).value;
        if (value !== undefined && value !== null) {
            return typeof value === "string" ? value : JSON.stringify(value);
        }
    }

    return String(error);
}
