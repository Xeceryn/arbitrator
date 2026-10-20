# apps/cmc-collector

CLI that scrapes CoinMarketCap's **keyless** public `data-api` and imports a
snapshot into the lister database. No API key needed.

## Run

```bash
bun run scrape   # --scrape: write a snapshot to the data dir
bun run import   # --import: apply the stored snapshot to lister
bun run sync     # --all: scrape then import
bun run typecheck

# raw flags:
bun run src/index.ts --help
```

Import options: `--prune` (delete delisted markets instead of disabling trading),
`--dry-run`, `--no-unmapped-chain`, `--data-dir <path>`.

- Snapshots land in `apps/cmc-collector/data/` (gitignored).
- Import requires the lister DB (`DATABASE_URL`) and a reachable lister service;
  it goes through `@arbitrator/sdk`'s Eden client, unwrapped by `must()` in
  `src/import.ts`.
- Fresh markets are linked to the placeholder `UNMPD` chain unless
  `--no-unmapped-chain` is passed (`src/config.ts`).
- Scrape targets (which CMC exchanges and quote currency IDR/USDT) are configured
  in `src/config.ts` `EXCHANGE_TARGETS` — edit there, not inline.

Files: `index.ts` (CLI/arg parsing), `scrape.ts`, `import.ts`, `storage.ts`,
`cmc.ts`, `metadata.ts`, `market-pairs.ts`, `config.ts`, `types.ts`.
