import type { PropsWithChildren } from "@kitajs/html";

type Props = PropsWithChildren<{
    /** id of the filter form this button submits. */
    form: string;
    page: number;
    disabled: boolean;
}>;

/**
 * A pagination submit button that lives outside the filter form and submits
 * it through the native `form` attribute.
 */
export const PageButton = ({ form, page, disabled, children }: Props) => (
    <button
        type="submit"
        form={form}
        name="page"
        value={page.toString()}
        disabled={disabled}
        class="join-item btn btn-outline"
    >
        {children}
    </button>
);
