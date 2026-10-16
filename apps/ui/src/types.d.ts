declare namespace JSX {
    interface HtmlTag {
        classes?: string;
    }

    interface IntrinsicElements {
        /**
         * htmx 4 partial: routes part of a response to its own target. The
         * server renders it instead of an out-of-band wrapper when it knows
         * the exact region that should change. `hx-target`/`hx-swap` come from
         * the htmx attribute augmentation on `HtmlTag`.
         *
         * @see https://four.htmx.org/docs#partials-hx-partial
         */
        "hx-partial": JSX.HtmlTag;
    }
}

// declare global {
//   interface HTMLElementEventMap {
//     "make-toast": CustomEvent<{
//       level: "info" | "success" | "warning" | "danger";
//       message: string;
//     }>;
//   }
// }
