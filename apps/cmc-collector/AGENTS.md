# apps/cmc-collector

CLI that scrapes CoinMarketCap's **keyless** public `data-api` (plus Indodax's
`api/pairs` and Pintu's Pro web APIs) and imports a snapshot into the lister
database. No API key needed.

## Run

```bash
bun run scrape   # --scrape: write a snapshot to the data dir
bun run import   # --import: apply the stored snapshot to lister
bun run sync     # --all: scrape then import
bun run indodax  # --indodax: live Indodax-only reconcile (no CMC pair scrape)
bun run indodax:symbols  # regenerate the sender's Indodax websocket pair table
bun run pintu    # --pintu: live Pintu Pro reconcile (symbol-matched, no CMC ids)
bun run typecheck
bun test

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
  there, not inline. Each target has a `source`: `cmc` or `indodax`. Pintu is
  deliberately not in that list because it has no CMC ids; `--pintu` resolves
  its tickers against lister first.
- HTX and BitMart are no longer scrape targets. Their existing lister rows are
  left alone (the generic import only touches exchanges present in a snapshot).

## Indodax special case

Indodax is scraped from `https://indodax.com/api/pairs`, not CMC, because CMC's
`baseSymbol` is not the ticker Indodax subscribes with.

- `market.exchangeSymbol` stores Indodax's `traded_currency_unit` (`T` for
  Threshold, `POL` for Polygon) — the ticker the UI shows.
- The orderbook websocket subscribes with the pair `id` instead
  (`thresholdidr`), except for renamed markets, where it keeps streaming the
  pre-rename ticket (`old_ticker_id`: AAVE is `aaveidr` but only `lendidr`
  publishes). That mapping lives in the sender worker
  (`apps/sender/src/workers/orderbooks/indodax-symbols.ts`), keyed by CMC id.
  It is generated, not hand-written: `bun run indodax:symbols` (or
  `--indodax-symbols`, `--dry-run` to print, `--out <path>` to redirect)
  rebuilds it from the live pair list through the same normalization the
  importer uses (`src/indodax-symbols.ts`).
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

## Pintu special case

Pintu is not registered on CMC and publishes no documented public API. The
`--pintu` / `bun run pintu` scan reads the keyless web APIs behind
`pintu.co.id/pro`:

- `api.pintu.pro/v1/public/get-symbols-reference` — authoritative Pro pair list
  (IDR only). `is_tokenized` rows are skipped: they are tokenized stocks, not
  crypto markets.
- `api.pintu.co.id/v3/transaction/market/list` — display name, logo and trading
  state.
- `api.pintu.co.id/v2/wallet/supportedCurrencies` — metadata fallback for
  Pro-only symbols the retail catalogue hides (MKR).

Because there are no CMC ids, each Pintu ticker is resolved against lister:

1. an explicit `PINTU_SYMBOL_ALIASES` entry wins (`DOGE`→Dogecoin,
   `MEME`→Memecoin, `PUMP`→Pump.fun);
2. exactly one lister coin with that ticker is reused;
3. otherwise a stable synthetic id is allocated from the reserved
   `1,999,000–2,998,999` range. Starting at 1999 would collide with real CMC ids
   (2010 is ADA), which is why the range is high.

A ticker with several lister candidates is a conflict: it is printed, written
to `data/pintu-symbols.json`, and skipped — never guessed. Review that file
after a scan and add an alias (or fix the lister coin) when a new collision
appears.

Missing Pintu markets are left untouched by default because a skipped ticker
must not disable an existing market; pass `--prune` to delete markets absent
from the live Pro list (and orphan coins). `--dry-run` prints the whole
resolution and import diff without writing.

Pintu markets start on the `UNMPD` placeholder like every new market. Chain
mapping is intentionally deferred (the wallet catalogue exposes networks, but
the initial import does not need them).

Files: `index.ts` (CLI/arg parsing), `scrape.ts`, `import.ts`, `storage.ts`,
`cmc.ts`, `indodax.ts`, `indodax-symbols.ts`, `pintu.ts`, `pintu-scan.ts`,
`metadata.ts`, `market-pairs.ts`, `config.ts`, `types.ts`.
