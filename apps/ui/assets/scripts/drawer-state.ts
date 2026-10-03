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
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDrawerState);
} else {
  initDrawerState();
}
