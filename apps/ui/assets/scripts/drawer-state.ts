/**
 * Persists the sidebar state across full page loads and keeps the navbar
 * toggle's `aria-expanded` in sync.
 *
 * The drawer's `#left-drawer` checkbox is the single source of truth. We
 * remember it so a reload keeps the desktop rail expanded/collapsed.
 *
 * Restore is desktop-only: below `lg` an "open" drawer is a full-screen
 * overlay, so it should always start closed there.
 *
 * `Navbar` renders a real `<button>` (keyboard reachable) instead of a
 * pointer-only `<label for="left-drawer">`. The button forwards its click to
 * the checkbox, so `change` still fires and the native drawer behaviour is
 * untouched.
 */
const STORAGE_KEY = "arbitrator:drawer";
const DESKTOP_QUERY = "(min-width: 64rem)";

function initDrawerState() {
    const toggle = document.querySelector<HTMLInputElement>("#left-drawer");
    if (!toggle) return;

    const button =
        document.querySelector<HTMLButtonElement>("#sidebar-toggle");

    // daisyUI's drawer toggle is visually hidden but still an <input>, so it
    // would otherwise be the first tab stop after the skip link. The navbar
    // button is the accessible control; keep the checkbox out of the tab order.
    toggle.tabIndex = -1;

    const syncExpanded = () => {
        button?.setAttribute("aria-expanded", String(toggle.checked));
    };

    if (
        window.matchMedia(DESKTOP_QUERY).matches &&
        localStorage.getItem(STORAGE_KEY) === "open"
    ) {
        toggle.checked = true;
    }

    syncExpanded();

    toggle.addEventListener("change", () => {
        localStorage.setItem(STORAGE_KEY, toggle.checked ? "open" : "closed");
        syncExpanded();
    });

    button?.addEventListener("click", () => {
        // `.click()` toggles `checked` and fires `change`, which keeps the
        // persisted state and `aria-expanded` in step with the drawer.
        toggle.click();
    });

    closeOverlayOnNavigate(toggle);
}

/**
 * Close the drawer after an in-app navigation.
 *
 * Below `lg` the drawer is an off-canvas overlay, so if it is left checked it
 * keeps covering the page that was just navigated to. At `lg` the sidebar is
 * persistent and its width is the only thing the checkbox changes, so we leave
 * it (and the remembered desktop state) alone.
 */
function closeOverlayOnNavigate(toggle: HTMLInputElement) {
    document.addEventListener("click", (event) => {
        if (window.matchMedia(DESKTOP_QUERY).matches) return;

        const target = event.target as Element | null;
        if (!target?.closest(".drawer-side a[hx-get]")) return;

        toggle.checked = false;
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDrawerState);
} else {
    initDrawerState();
}
