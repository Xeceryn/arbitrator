declare namespace JSX {
    interface HtmlTag {
        // For hyperscript to work properly with JSX types
        classes?: string;
        _?: string;
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
