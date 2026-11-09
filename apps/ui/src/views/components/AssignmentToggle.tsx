/** Explicit on/off text keeps a saved setting legible without relying on color. */
export const AssignmentToggle = ({
    label,
    name,
    enabled,
    url,
    field,
    compact = false,
}: {
    label: string;
    name: string;
    enabled: boolean;
    url: string;
    field: "tradeEnabled" | "depositEnabled" | "withdrawEnabled";
    compact?: boolean;
}) => (
    <label
        class={
            compact
                ? "flex min-h-11 w-fit cursor-pointer flex-col items-start gap-1 text-sm sm:flex-row sm:items-center sm:gap-2"
                : "flex min-h-11 cursor-pointer flex-col items-start gap-2 rounded-field bg-base-200 p-3 text-sm md:flex-row md:items-center md:gap-3"
        }
    >
        <span class={compact ? "text-xs sm:sr-only" : undefined}>{label}</span>
        <span class="flex items-center gap-2">
            <input
                type="checkbox"
                role="switch"
                class={`toggle peer ${compact ? "toggle-sm" : ""}`}
                aria-label={name}
                checked={enabled}
                data-saved-checked={String(enabled)}
                hx-patch={url}
                hx-trigger="change"
                hx-vals={`js:{ ${field}: this.checked }`}
                hx-swap="none"
                data-hx-disable="this"
                hx-indicator="#coin-assignment-indicator"
                hx-on:assignment-toggle-error={`if(event.detail.${field}!==undefined)this.checked=event.detail.${field}`}
                {...{ "hx-status:5xx": "swap:none" }}
            />
            <span
                class={`${compact ? "hidden md:inline" : ""} w-5 text-xs text-base-content/70 peer-checked:hidden`}
                aria-hidden="true"
            >
                Off
            </span>
            <span
                class={`hidden w-5 text-xs ${compact ? "md:peer-checked:inline" : "peer-checked:inline"}`}
                aria-hidden="true"
            >
                On
            </span>
        </span>
    </label>
);
