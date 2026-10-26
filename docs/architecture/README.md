# Architecture

Four artifacts, three tools, one rule: **a diagram that can drift is worse than
none.** Everything here is either generated, or a model that fails `validate`.

| File                           | Tool                                    | Kind                                                                    |
| ------------------------------ | --------------------------------------- | ----------------------------------------------------------------------- |
| [`model.c4`](./model.c4)       | [LikeC4](https://likec4.dev)            | hand-written C4 model (context, containers, sender/receiver components) |
| [`flows.md`](./flows.md)       | Mermaid                                 | hand-written runtime sequences, rendered by GitHub                      |
| [`topology.d2`](./topology.d2) | [D2](https://d2lang.com)                | **generated** from `packages/contracts/src/messaging.ts`                |
| [`topology.md`](./topology.md) | Mermaid                                 | **generated**, same source, so it renders inline                        |
| `module-graph.svg`             | [madge](https://github.com/pahen/madge) | optional, generated on demand, gitignored — an import-direction lint    |

Why three tools and not one:

- **LikeC4** because the C4 levels are the only ones that survive contact with
  the repo: processes, containers, components. It understands the
  control-plane/data-plane split as first-class relationship kinds, and it
  validates, so a stale element name is a build error rather than a lie.
- **Mermaid** because the ADRs need to embed their own diagram, and GitHub
  renders it with no install. Sequences belong next to the decision they explain.
- **D2** because the broker graph is the part that is mechanically derivable, and
  D2's layout holds up with ~40 worker nodes and a queue family.

## Commands

```sh
bun run arch:preview      # likec4 serve on 0.0.0.0:5173, hot reload
bun run arch:validate     # likec4 validate — syntax + layout, CI-safe
bun run arch:topology     # regenerate topology.d2 + topology.md
bun run arch:modules      # optional madge module graph (needs graphviz dot)
```

### Preview from another machine on the LAN

`arch:preview` passes `--listen 0.0.0.0`, so the dev server is reachable at
`http://<this-host-ip>:5173` — or `http://condor.local:5173` when mDNS is up
(see [`infra/avahi/README.md`](../../infra/avahi/README.md)). That only works
because LikeC4 defaults `allowedHosts` to `*`; no extra `--allowed-host` needed
for an IP.

One caveat: LikeC4 pins the HMR socket to `localhost` (`Enabling HMR:
localhost:24678` in the log), so a **remote** browser draws the diagrams but
never hot-reloads. Refresh the page after editing `model.c4`, or run the preview
on the machine you are editing on. Bind to loopback only if you would rather not
expose it at all:

```sh
bunx likec4 serve docs/architecture --listen 127.0.0.1
```

Port 5173 is taken by another server? Add `--port 5199 --hmr-port 24699`.

Rendering the D2 file (binary is not a repo dependency):

```sh
curl -fsSL https://d2lang.com/install.sh | sh -s --
d2 docs/architecture/topology.d2 topology.svg
```

Exporting the C4 views for a PR or a wiki:

```sh
bunx likec4 export png docs/architecture -o docs/architecture/png
bunx likec4 gen mermaid docs/architecture   # if a viewer only speaks Mermaid
```

## Where to change what

- **New service or package** → add a `container` to `model.c4`, then re-run
  `arch:validate`.
- **New routing key or queue** → change
  `packages/contracts/src/messaging.ts`, re-run `arch:topology`. Never edit
  `topology.d2` / `topology.md`.
- **New message flow (not just a key)** → add a sequence to `flows.md`, and
  reference the ADR that justifies it.
- **Import-direction questions** (`does the sender reach into lister internals?`)
  → `bun run arch:modules`, open the SVG. Nothing to maintain: regenerated and
  gitignored.
- **Anything about ports, replicas, healthchecks, boot order** → it belongs in
  `deploy.compose.yaml`, not here. This directory describes shape, not deployment.

## What is deliberately absent

- No hand-drawn broker diagram: see `topology.md`.
- No ERD committed: `apps/lister/src/core/*/*.sql.ts` is the source of truth and
  drizzle-kit already renders it. Generate on demand, don't curate.
- No "current sprint" boxes: `docs/transfer-orchestration.md` owns that.
