# UI guide

Notes for building the remaining screens so they match the management pages
that already ship: `coins`, `markets`, `chain`.

## Stack

- Server-rendered JSX via `@kitajs/html`, served by Elysia.
- Interactivity via htmx. A little hyperscript for local toggles.
- Tailwind CSS v4 + daisyUI 5. `themes: all` is enabled, so only semantic
  daisy classes (`base-100`, `base-200`, `base-300`, `primary`, `error`, …)
  are safe. A raw hex or a `gray-*`/`zinc-*` class breaks the theme switch.

## Where things live

| Path                               | Holds                                                                      |
| ---------------------------------- | -------------------------------------------------------------------------- |
| `src/controllers/*.controller.tsx` | Routes, htmx responses, modals                                             |
| `src/views/pages/*.tsx`            | Full-page content, data fetching                                           |
| `src/views/components/*.tsx`       | Reusable pieces (`PageHeading`, `PageButton`, `icons`, table rows, modals) |
| `src/helpers/BaseLayout.tsx`       | Document shell: drawer, navbar, `<main>`, footer, toasts                   |
| `assets/styles/styles.css`         | Tailwind source. `public/css/styles.css` is **generated**                  |

`public/css/styles.css` is build output. Never edit it by hand — edit
`assets/styles/styles.css` (or a component's classes) and run
`bun run build:tailwind` from `apps/ui`. `bun run dev` rebuilds it on restart.

## The shell

`BaseLayout` owns the chrome and the only `<main id="main-content">`:

- drawer + `Sidebar`
- `Navbar` (menu button, page heading, theme picker)
- `<main class="… p-4 sm:p-6 lg:p-8">`
- footer
- `#toast-container`

The sidebar uses daisyUI's `is-drawer-close` / `is-drawer-open` variants:

- The `#left-drawer` checkbox is the single source of truth, toggled by the
  `Toggle sidebar` label in `Navbar` at every width.
- Below `lg`: unchecked is off-canvas (hidden), checked is the overlay.
- At `lg`: `lg:drawer-open` keeps the sidebar persistent, while the variants
  switch its width — unchecked is a `w-14` icon rail, checked is `w-64` with
  labels.
- `Sidebar` items carry `is-drawer-close:tooltip is-drawer-close:tooltip-right`
  and `data-tip`, and their label `<span>` is `is-drawer-close:hidden`.

No custom CSS is involved; the variants are defined by the daisyUI plugin and
key off `.drawer-toggle:checked ~ .drawer-side`.

The state is persisted across full reloads by
`assets/scripts/drawer-state.ts` (bundled to `public/dist/drawer-state.js`):
it mirrors the checkbox to `localStorage` under `arbitrator:drawer` and
restores it on load, desktop-only so mobile always starts closed.

**The navbar owns the page `<h1>`.** Pass `heading` to `BaseLayout`:

```tsx
<BaseLayout title="arbitmage - Exchanges" heading="Exchanges">
  <MarketPage {...query} />
</BaseLayout>
```

For htmx navigation the heading has to be updated out-of-band, because the
navbar sits outside `#main-content`. Every htmx response repeats it:

```tsx
return (
  <>
    <PageHeading heading="Exchanges" oob />
    <title>Exchanges</title>
    <MarketPage {...query} />
  </>
);
```

A page renders **content only**:

- No `<main>`, no page padding, no `bg-base-200` — the layout supplies them.
- No `<h1>` — `Navbar` renders `PageHeading`.
- Modals live in the page wrapper (`MarketPage`), **outside** the htmx swap
  unit, so a list refresh never destroys an open dialog.

## Management page skeleton

Copy `src/views/pages/CryptocurrencyPage.tsx` (or `MarketPage.tsx` /
`ChainPage.tsx`). Every CRUD screen is a static card with a swappable results
fragment:

```
<section id="…-list">
  <div class="card w-full bg-base-100 shadow-xl">
    <div class="card-body p-4 sm:p-8">
      <form id="…-filter" hx-target="#…-list-results">…</form>
      <div id="…-list-results">          ← the only htmx swap unit
        <input type="hidden" form="…-filter" name="orderBy" … />
        <input type="hidden" form="…-filter" name="order" … />
        <div class="overflow-x-auto w-full">
          <table class="table w-full table-pin-rows table-pin-cols">…</table>
        </div>
        <footer>…</footer>               ← "Showing x to y of z" + pagination
      </div>
    </div>
  </div>
</section>
```

Rules that keep it working:

- **The filter bar is static; the `…Results` fragment is the only swap
  unit.** The list endpoint returns exactly the
  `<div id="…-list-results">`, and the form points its `hx-target` at it. A
  request therefore never re-renders the search input, so it keeps focus and
  caret while you type.
- **Pagination buttons sit outside the form** but submit it with the native
  `form="…-filter"` attribute plus `type="submit"` and `name="page"`. Use the
  shared `PageButton` component.
- **Hidden sort inputs live in the results**, not in the static form, so a
  new sort is picked up on the next swap. The native `form="…-filter"`
  attribute keeps them associated with the form, so search and pagination
  still carry the sort even though the inputs are not descendants of it.
- **Every button inside a form needs `type="button"`** unless it should
  submit. `<button>` defaults to `type="submit"`. The `Add …` button is
  `type="button"` and calls `showModal()`.
- **Empty state is a table row**, not a separate block, so `#…-table-body`
  always exists for `hx-target`. Give it a heading, one line of orientation
  and the primary action.
- Keep the existing htmx attributes (`hx-get`, `hx-target`, `hx-swap`,
  `hx-indicator`, `hx-sync`) when moving markup; they are load-bearing.
- Put `form` bodies through `z.coerce` before the API call; HTML sends
  strings. See the `exchangeBody` / `chainBody` schemas in the controllers.

## Sorting

Every data column header is a `SortableHeader` (`src/views/components/`). It
renders a `<th aria-sort>` wrapping a button that re-requests the list with
`orderBy`/`order` into `#…-list-results`.

- The button lives **outside** the filter form, so it uses
  `hx-include="#…-filter"` to carry the current search/limit and `hx-vals`
  to override `orderBy`/`order`. htmx merges `hx-vals` last, so the
  overrides win over the included hidden inputs.
- The hidden `orderBy`/`order` inputs live in the results fragment and are
  associated back to the form with `form="…-filter"`. They are refreshed on
  every swap, so searching, changing the limit and paginating all preserve
  the sort. `page` is not part of the form, so sorting intentionally jumps
  back to page one.
- `aria-sort="ascending" | "descending" | "none"` sits on the `<th>`, and
  the button's `aria-label` names the column plus the direction the click
  will apply.
- `orderBy` keys come from the entity's `*OrderByOptions` in
  `@arbitrator/lister/constants`; the API schema already validates them.
- Pass the same responsive/width classes you would put on a plain `<th>`
  through the component's `class` prop.

## Responsive tables

Data tables are the one place that overflows. Keep them inside the
`card-body` in a plain `<div class="overflow-x-auto w-full">`, then:

- Hide low-value columns on small screens: `hidden sm:table-cell`,
  `hidden md:table-cell`, `hidden lg:table-cell`. Add the same class to the
  `<th>` **and** the `<td>`.
- The visible columns plus actions must fit 320px. The `card-body` padding
  squeezes the table on mobile, so use `p-4 sm:p-8` on the body, shrink the
  avatar and the row buttons with `size-8 sm:size-10` / `btn-xs sm:btn-sm`,
  and override daisy's `.table` cell padding per table with
  `[&_td]:px-2 [&_th]:px-2 sm:[&_td]:px-4 sm:[&_th]:px-4`.
- daisy `.select` is `width: clamp(3rem, 20rem, 100%)` — a standalone select
  needs an explicit width (`w-40`), or it will stretch to 320px.
- Verify at 320px: the last action must sit inside the card, not past a
  horizontal scroll edge.

## Accessibility baseline

- One `<h1>` per page, rendered by `Navbar` from the `heading` prop.
- Label every control. A wrapping `<label class="input">`/`<label
class="select">` with a `<span class="sr-only">` name is enough for
  toolbars. A placeholder is never a label.
- Icon-only buttons need `aria-label` that names the item, e.g.
  `Edit Bitcoin`, and `type="button"`.
- Decorative images get `alt=""`; the logo next to its name is decorative.
- Use native `<dialog>` + `showModal()` for modals (focus trap and inert are
  free), with a `modal-backdrop` form and `aria-labelledby` pointing at the
  dialog heading.
- Focus must stay visible: check `:focus-visible` on any custom control.
  daisy menu items in a closed `<details class="dropdown">` need an explicit
  `[&:not([open])>.dropdown-content]:hidden` or their buttons stay focusable
  while invisible.
- A pointer-only `<label>` hamburger is not keyboard reachable. Use a
  `<button>` that toggles `#left-drawer` (see `Navbar`).
- Toasts: `role="status"` for info/success, `role="alert"` only for errors.
- Respect `prefers-reduced-motion` for anything that animates.

## Copy

- Sentence case for headings, labels and buttons.
- Buttons start with a verb: `Add coin`, `Save changes`, `Delete coin`.
- Errors say what to do next, next to the field: `Choose a password with at
least 8 characters`, not `Invalid`.
- Empty states orient and offer one action. Never park information there.

## Verification before you call it done

```bash
cd apps/ui
bun run build:tailwind      # regenerate public/css/styles.css
bunx tsc --noEmit           # pre-existing lister lib errors are unrelated
```

Then render the page and check: 320px, 390px and desktop widths; keyboard tab
order from the top (skip link first, visible focus at every stop); open and
close each modal; that the last table action is not clipped at 320px; and
that the navbar heading follows htmx navigation.

## Known gaps for the next pass

- `Home` is the only remaining screen on the old layout; it is reachable from
  the brand logo (`/` redirects to `/home`) but has no sidebar entry.
- The row delete button is styled and labelled but not wired to a request.
  When wiring it, add a confirmation step (`hx-confirm` or a dialog).
