import type { ZodError } from "zod";

export const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
    timeStyle: "short",
});

export function getElapsedTime(date: Date) {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);

        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
        }
    }

    return "just now";
}

export function capitalizeFirstLetter(str: string) {
    return str
        .split(" ")
        .map((word) => {
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
}

export function createPushURL<
    T extends Record<string, string | number | undefined>,
>(url: string, kv: T): string {
    const params = Object.entries(kv)
        .map(([key, value]) => `${key}=${value || ""}`)
        .join("&");

    return `${url}?${params}`;
}

export function timeAgo(date: Date) {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const seconds = (date.getTime() - new Date().getTime()) / 1000;
    const units: [Intl.RelativeTimeFormatUnit, number][] = [
        ["year", 60 * 60 * 24 * 365],
        ["month", 60 * 60 * 24 * 30],
        ["day", 60 * 60 * 24],
        ["hour", 60 * 60],
        ["minute", 60],
        ["second", 1],
    ];

    for (const [unit, value] of units) {
        if (Math.abs(seconds) >= value || unit === "second") {
            return rtf.format(Math.round(seconds / value), unit);
        }
    }
}

/* -------------------------------------------------------------------------- */
/* Signal formatting (en-ID: 1.234.567,89; compact volume: 277,45M)            */
/* -------------------------------------------------------------------------- */

const priceFormatter = new Intl.NumberFormat("en-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

/**
 * Below 1, two decimals would round sub-cent prices to `0`; keep their real
 * digits instead. At or above 1, two decimals is enough (e.g. `1,23`), and the
 * trailing zeros are kept (e.g. `2,00`).
 */
const precisePriceFormatter = new Intl.NumberFormat("en-ID", {
    maximumFractionDigits: 20,
});

const volumeFormatter = new Intl.NumberFormat("id-ID", {
    notation: "compact",
    style: "currency",
    currency: "IDR",
    // maximumFractionDigits: 2,
    compactDisplay: "short",
});

/** Full price, e.g. `74.518.227,55`; sub-1 prices keep their significant digits. */
export function formatPrice(value: number): string {
    const formatter =
        Math.abs(value) < 1 ? precisePriceFormatter : priceFormatter;
    return formatter.format(value);
}

/** Compact volume, e.g. `277,45M` (K/M/B). */
export function formatCompact(value: number): string {
    return volumeFormatter.format(value);
}

/** Ratio (`0.0085`) as a percentage string (`0.85 %`). */
export function formatProfitPercentage(ratio: number): string {
    return `${(ratio * 100).toFixed(2)} %`;
}

/* -------------------------------------------------------------------------- */
/* Inline form validation                                                     */
/* -------------------------------------------------------------------------- */

export type ValidationMessage = { field: string; message: string };

/** Turn a zod failure into field-scoped messages for inline rendering. */
export function validationMessages(error: ZodError): ValidationMessage[] {
    return error.issues.map((issue) => ({
        field: issue.path.map(String).join("."),
        message: issue.message,
    }));
}

/**
 * Map an upstream "add" failure to a user-facing message and, when the cause
 * is obvious, the field to mark invalid. The API only exposes raw strings, so
 * this keeps duplicate-value errors actionable instead of showing
 * "Internal Server Error".
 */
export function addErrorMessage(
    entity: string,
    error: { message?: string } | null | undefined,
): ValidationMessage {
    const raw = error?.message ?? "";
    if (/cmc\s*id/i.test(raw)) {
        return {
            field: "cmcId",
            message:
                "That CMC ID is already in use. Check the ID and try again.",
        };
    }
    if (/\bslug\b/i.test(raw)) {
        return {
            field: "slug",
            message:
                "That slug is already in use. Pick another slug and try again.",
        };
    }
    if (/\bcode\b/i.test(raw)) {
        return {
            field: "code",
            message:
                "That code is already in use. Pick another code and try again.",
        };
    }
    return {
        field: "",
        message: `Could not add the ${entity}. Check the details are unique, then try again.`,
    };
}
