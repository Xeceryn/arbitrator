# apps/ui

Server-rendered htmx app on `:3000`. Elysia v2 + `@kitajs/html` JSX, Tailwind v4 +
daisyUI 5, htmx 4. It reads lister (Eden, via `@arbitrator/sdk`) and sender (Eden
treaty) and renders them. OpenAPI at `/openapi`, spec at `/openapi/json`.

**Before changing any screen, read [`UI_GUIDE.md`](./UI_GUIDE.md).** It covers the
layout shell, htmx/HATEOAS fragment conventions, accessibility, responsive
tables, and copy rules. This file only adds operational gotchas.

## Run

```bash
bun run dev             # bun run --watch src/main.ts (rebuilds assets on boot)
bun run dev:tailwind    # tailwind --watch only
bun run build:tailwind  # regenerate public/css/styles.css once
bun run build           # build.ts: bundle assets + bundle the server into dist
bun run typecheck       # bun --check
```

## Structure

```
src/main.ts             Elysia app: controllers, error handling, static /public
src/controllers/*.tsx    routes + htmx responses per entity (index.ts re-exports)
src/views/pages/*.tsx    full-page content + data fetching
src/views/components/*   reusable pieces (rows, modals, PageHeading, icons)
src/helpers/BaseLayout.tsx   document shell (drawer, navbar, main, toasts)
src/plugins/clients.ts   decorates context with `lister` + `sender` clients
src/plugins/htmx.ts      vendored htmx plugin (`hx` context; `@gtramontina.com` is v1-only)
src/sender.client.ts     Eden treaty client for the sender (typed from App)
src/sender-stream.ts     fans sender WS pushes out to browsers
src/bundler.ts           compiles assets -> public/ (CSS + browser scripts)
assets/styles/styles.css Tailwind source
assets/{lib,scripts}/*   browser entrypoints bundled to public/dist
```

## Signal alarm

`/signals` beeps when its first card clears 1% profit: the integer part of the
percentage picks the clip (`1.x` → 1 beep … `5%` and above → 5), from
`public/audio/*.mp3` (copied from the old `signal-card-ui` app).

- The `<audio>` tags are rendered by `SignalAlarm` in
  `src/views/pages/SignalPage.tsx`, outside `#signal-board`, so a WebSocket
  swap never kills a playing alarm.
- `assets/scripts/signal-board.ts` owns hide/sort and, on every incoming push,
  emits `signal-board:applied` (`assets/scripts/board-state.ts`) with the card
  that is now first. `assets/scripts/signal-audio.ts` plays the matching clip
  for each push; a clip that is still sounding is left to finish instead of
  being restarted, and a higher track interrupts it.
- Volume/mute live in `SignalControls` and persist in `localStorage`
  (`arbitrator:signal-volume`, `arbitrator:signal-muted`).
- Browsers block unmuted playback until the page has been interacted with, so
  the first alarm may be dropped; it is not an error.
- The board's filters (exchanges, and the four transfer routes
  A–D = IDR→USDT, USDT→IDR, USDT→USDT, IDR→IDR) live in `signal-board.ts` and
  key off `data-buy-slug` / `data-sell-slug` / `data-route` on the card.
  Filtering is client-side, but the state is in the URL — `?orderBy=&hide=&route=`
  — so a filtered board can be reloaded or shared. `/signals` renders the
  checkboxes from those params (`parseRoutes` is lenient: unknown keys are
  dropped) and `signal-board.ts` mirrors changes back with `replaceState`,
  omitting defaults so the canonical view stays a bare `/signals`.
  `#signal-filter-empty` explains a board that the filters emptied.
- `Opportunity.list` stops at the **top 60** rows before the browser filters
  anything. That cap is deliberate (it bounds what the board pulls after the
  sort); do not raise it. The consequence is that a route filter only narrows
  what is already in that top 60, so a route can look sparse or empty while
  matching signals sit below the cut.

## Non-obvious rules

- **`public/` is generated build output. Never hand-edit
  `public/css/styles.css`.** Edit `assets/styles/styles.css` (or component
  classes) and run `bun run build:tailwind`. oxfmt/oxlint ignore `apps/ui/public`.
- `src/main.ts` bundles client assets on boot unless started with `--cluster`.
- Controllers read the clients from handler context (`clientsPlugin`) — don't
  import `lister`/`senderClient` directly inside handlers.
- **`@elysia/html` must not be used here.** Its v2 typing breaks Elysia's route
  overload, which silently turns every later handler's `query`/`hx` into `any`.
  `BaseLayout` already emits `<!DOCTYPE html>` and `main.ts` sets the HTML
  content-type (skipping `/public/*`, so static assets keep their own type).
- `onError` in v2 has no `code` context member: read `error.code`
  (`not-found`, `validation`, `parse`, `internal-server-error`).
- daisyUI has `themes: all` (see `UI_GUIDE.md`): only semantic classes
  (`base-100`, `primary`, …) are safe. Raw hex or `gray-*`/`zinc-*` breaks theme
  switching.
- htmx error handling is deliberate: a 5xx on an htmx request returns a real 5xx
  body with `HX-Reswap: none` and a `make-toast` trigger, so `hx-status:5xx`
  guards fire. Don't "fix" it into a redirect.
- Tabs use `jsxImportSource: @kitajs/html` with its htmx types (see `tsconfig.json`).
