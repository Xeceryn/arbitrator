/**
 * Close a native `<details>` dropdown once one of its options is chosen.
 *
 * The theme picker is a `<details class="dropdown">` whose options are
 * `[data-set-theme]` buttons handled by theme-change. Selecting one does not
 * toggle the `<details>`, so without this the menu stays open over the page.
 */
document.addEventListener("click", (event) => {
  const option = (event.target as Element | null)?.closest("[data-set-theme]");
  option?.closest("details")?.removeAttribute("open");
});
