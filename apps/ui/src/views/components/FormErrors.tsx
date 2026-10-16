import type { ValidationMessage } from "../../utils";

/**
 * Persistent inline validation region for a form. It is always in the DOM (so
 * fields can point `aria-describedby` at it) and hidden by `empty:hidden`
 * until the server fills it. `role="alert"` announces the error copy when it
 * appears.
 */
export const FormErrorRegion = ({ id }: { id: string }) => (
    <div
        id={id}
        role="alert"
        aria-live="polite"
        class="empty:hidden alert alert-error alert-soft text-sm"
    />
);

/** The server-side error body swapped into a `FormErrorRegion`. */
export const ValidationErrorList = ({
    messages,
}: {
    messages: ValidationMessage[];
}) => (
    <ul class="list-inside list-disc">
        {messages.map(({ message }) => (
            <li safe>{message}</li>
        ))}
    </ul>
);

/**
 * Inline handler for a server-sent validation event. The server names the
 * offending fields in `HX-Trigger` detail; the handler only mirrors that onto
 * `aria-invalid` for the form's own controls, so assistive tech hears which
 * fields failed. It never issues a request or builds a URL.
 */
export function ariaInvalidHandler(): string {
    return [
        `const fields = (event.detail && event.detail.fields) || [];`,
        `this.querySelectorAll("input[name],select[name],textarea[name]").forEach((el) => {`,
        `el.setAttribute("aria-invalid", String(fields.includes(el.name)));`,
        `});`,
    ].join("");
}
