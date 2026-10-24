# apps/cmc-collector

CLI that scrapes CoinMarketCap's **keyless** public `data-api` (plus Indodax's
own public `api/pairs`) and imports a snapshot into the lister database. No API
key needed.

## Run

```bash
bun run scrape   # --scrape: write a snapshot to the data dir
bun run import   # --import: apply the stored snapshot to lister
bun run sync     # --all: scrape then import
bun run indodax  # --indodax: live Indodax-only reconcile (no CMC pair scrape)
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
- Scrape targets are configured in `src/config.ts` `EXCHANGE_TARGETS` — edit
  there, not inline. Each target has a `source`: `cmc` or `indodax`.

## Indodax special case

Indodax is scraped from `https://indodax.com/api/pairs`, not CMC, because CMC's
`baseSymbol` is not the ticker Indodax subscribes with.

- `market.exchangeSymbol` stores Indodax's `traded_currency_unit` (`T` for
  Threshold, `POL` for Polygon) — the ticker the UI shows.
- The orderbook websocket subscribes with the pair `id` instead
  (`thresholdidr`). That mapping lives in the sender worker
  (`apps/sender/src/workers/orderbooks/indodax-symbols.ts`), keyed by CMC id.
- `is_market_suspended` becomes `tradeEnabled: false` (and back to `true` when
  the suspension clears).
- `is_maintenance` becomes `chainSuspended` on the snapshot market. Every chain
  link of that market gets `withdrawEnabled`/`depositEnabled` set to the pair's
  state — disabled during maintenance, re-enabled when it clears.
  `disable_deposit` also feeds `depositEnabled`. This is deliberately coarse:
  Indodax reports one state for the whole coin, so per-network differences from
  the chain-metadata collector are overwritten for Indodax markets.
- `cmc_id 3890` (MATIC) is folded onto `28321` (POL) with
  `INDODAX_CMC_ID_ALIASES`.
- Only IDR pairs are kept; USDT books duplicate coins that already have an IDR
  pair. Pairs with no `cmc_id` are skipped with a warning.

The dedicated `--indodax` / `bun run indodax` command is a live, Indodax-only
reconcile. It creates/updates Indodax coins and markets, syncs trade and chain
flags, prunes markets missing from the live pair list (cascading their chain
links), and deletes coins left with no market on any exchange. It still uses the
CMC coin map for canonical metadata, but never reads a CMC pair list. Because it
prunes automatically, it is the safe way to run maintenance updates frequently
without scraping every other venue.

A full wipe of the existing Indodax assignments is still not scripted: the scan
only deletes markets that are absent from the live pair list, so coins still
listed (and their real chain links) are preserved.

Files: `index.ts` (CLI/arg parsing), `scrape.ts`, `import.ts`, `storage.ts`,
`cmc.ts`, `indodax.ts`, `metadata.ts`, `market-pairs.ts`, `config.ts`,
`types.ts`.
