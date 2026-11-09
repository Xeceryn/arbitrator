import type { PropsWithChildren } from "@kitajs/html";

import { ariaInvalidHandler, FormErrorRegion } from "./FormErrors";
import { XIcon } from "./icons";

/** Shared editing vocabulary; values and validation stay in the server form. */
export const EditForm = ({
    entity,
    name,
    url,
    target,
    dialog,
    event,
    children,
}: PropsWithChildren<{
    entity: string;
    name?: string;
    url: string;
    target: string;
    dialog: string;
    event: string;
}>) => (
    <form
        hx-patch={url}
        hx-target={target}
        hx-swap="outerHTML"
        data-hx-disable="find button[type=submit]"
        hx-indicator={`#${entity}-save-indicator`}
        {...{
            "hx-status:422": `target:#edit-${entity}-error swap:innerHTML`,
            "hx-status:5xx": "swap:none",
            [`hx-on:${event}-validation-error`]: ariaInvalidHandler(),
            [`hx-on:${event}-updated`]: `document.getElementById('${dialog}').close()`,
        }}
        class="flex flex-col gap-5"
    >
        <header class="flex items-start justify-between gap-3">
            <div class="min-w-0">
                <h2 id={`edit-${entity}-title`} class="text-lg font-semibold">
                    Edit {entity}
                </h2>
                <p class="mt-1 break-words text-sm text-base-content/70">
                    {name}
                </p>
            </div>
            <button
                type="button"
                class="btn btn-square btn-ghost btn-sm"
                aria-label={`Close ${entity} editor`}
                onclick={`document.getElementById('${dialog}').close()`}
            >
                <XIcon />
            </button>
        </header>
        <FormErrorRegion id={`edit-${entity}-error`} />
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
        <div class="modal-action mt-1 border-t border-base-300 pt-4">
            <button
                type="button"
                class="btn btn-ghost"
                onclick={`document.getElementById('${dialog}').close()`}
            >
                Cancel
            </button>
            <button type="submit" class="btn btn-primary">
                <span
                    id={`${entity}-save-indicator`}
                    class="htmx-indicator loading loading-spinner loading-xs"
                    aria-hidden="true"
                ></span>
                Save changes
            </button>
        </div>
    </form>
);

export const TextField = ({
    entity,
    name,
    label,
    value,
    type = "text",
    wide = false,
    placeholder,
}: {
    entity: string;
    name: string;
    label: string;
    value?: string | number;
    type?: "text" | "number" | "url";
    wide?: boolean;
    placeholder?: string;
}) => (
    <label
        class={`flex min-w-0 flex-col gap-1.5 ${wide ? "sm:col-span-2" : ""}`}
    >
        <span class="text-sm font-medium">{label}</span>
        <input
            class="input w-full"
            name={name}
            type={type}
            value={value?.toString() ?? ""}
            placeholder={placeholder}
            autocomplete="off"
            required
            min={type === "number" ? "1" : undefined}
            step={type === "number" ? "1" : undefined}
            aria-describedby={`edit-${entity}-error edit-${entity}-${name}-error`}
        />
        <span
            id={`edit-${entity}-${name}-error`}
            data-field-error={name}
            class="text-sm text-error"
            hidden
        ></span>
    </label>
);
