import { t } from "elysia";
import type { Static, TSchema } from "typebox";
import { Value } from "typebox/value";

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

/**
 * Validate a posted HTML form against a TypeBox schema and, when it fails, hand
 * back the inline copy for every offending field.
 *
 * HTML posts every value as a string, so the routes keep a *loose* body schema
 * (`t.Optional(t.String())` fields) and validate here instead: `Value.Convert`
 * coerces `"270"` into `270`, and the failure never becomes an Elysia 422
 * envelope, which keeps the form's own error region and `aria-invalid` trigger
 * intact. Each property's `error` option holds the copy `ValidationErrorList`
 * renders, so the rule and its message are declared once and the same option
 * documents the field in OpenAPI.
 */
export function formParse<T extends TSchema>(
    schema: T,
    body: Record<string, unknown>,
):
    | { ok: true; value: Static<T> }
    | { ok: false; messages: ValidationMessage[] } {
    const value = Value.Convert(schema, Value.Clone(body));
    const errors = Value.Errors(schema, value);
    if (errors.length === 0) return { ok: true, value: value as Static<T> };

    const properties =
        (schema as { properties?: Record<string, { error?: unknown }> })
            .properties ?? {};

    // A union reports one error per member (plus the `anyOf` summary), so keep
    // the first failure per field: one line of copy per invalid field.
    const seen = new Set<string>();
    const messages: ValidationMessage[] = [];
    for (const error of errors) {
        const field = error.instancePath.replace(/^\//, "");
        if (seen.has(field)) continue;
        seen.add(field);
        const copy = properties[field]?.error;
        messages.push({
            field,
            message: typeof copy === "string" ? copy : error.message,
        });
    }

    return { ok: false, messages };
}

/**
 * Normalise a form-posted checkbox/select: browsers send `"true"`/`"false"`
 * strings, API clients send real booleans. `Boolean("false")` is `true`, so the
 * two literals are compared explicitly.
 */
export function toBoolean(
    value: string | boolean | undefined,
): boolean | undefined {
    if (value === undefined) return undefined;
    return value === true || value === "true";
}

/**
 * `"true"`/`"false"` from a form, or a real boolean from an API client.
 * Elysia does not coerce booleans in form bodies, so the route schemas accept
 * both shapes and the handlers normalise them with {@link toBoolean}.
 */
export const formBoolean = t.Union([
    t.Literal("true"),
    t.Literal("false"),
    t.Boolean(),
]);

/** A repeated query param arrives as a string, an array, or nothing. */
export function toStringArray(value: string | string[] | undefined): string[] {
    if (value === undefined) return [];
    return Array.isArray(value) ? value : [value];
}

/**
 * Eden treaty never throws on an HTTP failure: it resolves to
 * `{ data: null, error: { status, value } }`. Lister answers errors with
 * `{ message }`, but a proxy or a crash can return a plain string.
 */
export type ApiError = { status: number; value: unknown } | null | undefined;

/** The upstream message of an Eden error, when it carries one. */
export function apiErrorMessage(error: ApiError): string | undefined {
    const value = error?.value;
    if (typeof value === "string") {
        return value.length > 0 ? value : undefined;
    }
    if (value && typeof value === "object") {
        const record = value as { message?: unknown; summary?: unknown };
        if (typeof record.message === "string" && record.message.length > 0) {
            return record.message;
        }
        if (typeof record.summary === "string" && record.summary.length > 0) {
            return record.summary;
        }
    }
    return undefined;
}

/**
 * Map an upstream "add" failure to a user-facing message and, when the cause
 * is obvious, the field to mark invalid. The API only exposes raw strings, so
 * this keeps duplicate-value errors actionable instead of showing
 * "Internal Server Error".
 */
export function addErrorMessage(
    entity: string,
    error: ApiError,
): ValidationMessage {
    const raw = apiErrorMessage(error) ?? "";
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

/**
 * Elysia fills the pagination schema defaults before the handler runs, so every
 * field is present at runtime — only the TypeBox *static* type says `Partial`
 * (fields are `t.Optional` so Eden clients may send `{ limit: -1 }` alone).
 * This is the one place that asserts what the framework already guarantees.
 */
export function resolvedQuery<T extends object>(query: T): Required<T> {
    return query as Required<T>;
}
