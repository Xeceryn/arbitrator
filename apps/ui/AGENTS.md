# apps/ui

Server-rendered htmx app on `:3000`. Elysia + `@kitajs/html` JSX, Tailwind v4 +
daisyUI 5, htmx 4. It reads lister (oRPC) and sender (Eden) and renders them.

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
src/sender.client.ts     Eden treaty client for the sender (typed from App)
src/sender-stream.ts     fans sender WS pushes out to browsers
src/bundler.ts           compiles assets -> public/ (CSS + browser scripts)
assets/styles/styles.css Tailwind source
assets/{lib,scripts}/*   browser entrypoints bundled to public/dist
```

## Non-obvious rules

- **`public/` is generated build output. Never hand-edit
  `public/css/styles.css`.** Edit `assets/styles/styles.css` (or component
  classes) and run `bun run build:tailwind`. oxfmt/oxlint ignore `apps/ui/public`.
- `src/main.ts` bundles client assets on boot unless started with `--cluster`.
- Controllers read the clients from handler context (`clientsPlugin`) — don't
  import `listerClient`/`senderClient` directly inside handlers.
- daisyUI has `themes: all` (see `UI_GUIDE.md`): only semantic classes
  (`base-100`, `primary`, …) are safe. Raw hex or `gray-*`/`zinc-*` breaks theme
  switching.
- htmx error handling is deliberate: a 5xx on an htmx request returns a real 5xx
  body with `HX-Reswap: none` and a `make-toast` trigger, so `hx-status:5xx`
  guards fire. Don't "fix" it into a redirect.
- Tabs use `jsxImportSource: @kitajs/html` with its htmx types (see `tsconfig.json`).
