/**
 * Persists the sidebar state across full page loads.
 *
 * The drawer's `#left-drawer` checkbox is the single source of truth. We
 * remember it so a reload keeps the desktop rail expanded/collapsed.
 *
 * Restore is desktop-only: below `lg` an "open" drawer is a full-screen
 * overlay, so it should always start closed there.
 */
const STORAGE_KEY = "arbitrator:drawer";
const DESKTOP_QUERY = "(min-width: 64rem)";

function initDrawerState() {
    const toggle = document.querySelector<HTMLInputElement>("#left-drawer");
    if (!toggle) return;

    if (
        window.matchMedia(DESKTOP_QUERY).matches &&
        localStorage.getItem(STORAGE_KEY) === "open"
    ) {
        toggle.checked = true;
    }

    toggle.addEventListener("change", () => {
        localStorage.setItem(STORAGE_KEY, toggle.checked ? "open" : "closed");
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
