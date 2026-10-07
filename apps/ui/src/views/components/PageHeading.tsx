type Props = {
    heading: string;
    /** Set on an htmx response to update the navbar title out-of-band. */
    oob?: boolean;
};

/**
 * The page title. Rendered in the navbar by `BaseLayout`; htmx responses
 * render it again with `oob` so the title follows in-app navigation.
 */
export const PageHeading = ({ heading, oob }: Props) => (
    <h1
        id="page-heading"
        class="truncate text-xl font-semibold"
        {...(oob ? { "hx-swap-oob": "true" } : {})}
        safe
    >
        {heading}
    </h1>
);
