# apps/old-lister-migrator

One-off scripts that push data from the old lister into the new one via
`@arbitrator/sdk`. Not part of any service; run by hand.

## Run

```bash
bun run dev     # src/index.ts (largely commented-out scratch code)
bun run start
# individual scripts:  bun run src/init-seed.ts
```

Requires lister online (scripts `process.exit(1)` when `utility.ping` fails).

## Files

- `src/index.ts` — scratch; most of it is commented out.
- `src/init-seed.ts` — seeds exchanges from CMC/old data.
- `src/assign-chain.ts` — links markets to the `UNMPD` placeholder chain.
- `src/clear.ts` — empty stub around the commented `utility.clearDatabase`
  (which is dev-only on the lister).
- `src/lib/data-utils.ts`, `src/client.ts`, `src/types/` — helpers.
