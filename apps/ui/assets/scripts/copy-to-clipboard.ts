import ClipboardJS from "clipboard";

/**
 * Click-to-copy backed by clipboard.js.
 *
 * `ClipboardJS` is constructed with a selector, so it delegates from
 * `document.body` and keeps working after htmx morphs the signal board.
 * Copyable elements declare their value with `data-clipboard-text`.
 */

type ToastLevel = "info" | "success" | "warning" | "error";

function toast(level: ToastLevel, message: string) {
    document.dispatchEvent(
        new CustomEvent("make-toast", { detail: { level, message } }),
    );
}

function init() {
    // Constructed with a selector, clipboard.js delegates from `document.body`,
    // so it must wait until the body exists.
    const clipboard = new ClipboardJS("[data-clipboard-text]");

    clipboard.on("success", (event) => {
        event.clearSelection();
        toast("success", `Copied ${event.text}`);
    });

    clipboard.on("error", () => {
        toast("error", "Copy failed");
    });
}

// clipboard.js only listens for clicks, so mirror activation for the
// `role="button"` badges when they are triggered from the keyboard.
document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!target.matches("[data-clipboard-text]")) return;

    event.preventDefault();
    target.click();
});

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
