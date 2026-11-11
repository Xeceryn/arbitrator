# apps/chain-metadata-collector

CLI that crawls each exchange's **own** API for coin → chain state (which
networks a coin is listed on, and whether withdraw/deposit is enabled on each),
then reconciles that into lister's `chain` + `chain_link` tables. This is the
data an operator otherwise looks up by hand on every venue while arbitraging;
`apps/cmc-collector` only learns that a market exists (and links it to `UNMPD`).

## Run

```bash
bun run scrape    # --scrape: crawl and write a snapshot to the data dir
bun run import    # --import: apply the stored snapshot to lister
bun run sync      # --all: scrape then import
bun run typecheck

# raw flags:
bun run src/index.ts --help
```

Options: `--only a,b` (restrict exchanges), `--no-canonicalize` (keep raw
labels), `--dry-run`, `--data-dir <path>`.

## Chain naming

`src/chains.ts` resolves an exchange's raw network label deterministically, in
order: a curated alias table → a **qualifier pass** → its own new chain.

- Qualifier pass strips network-kind suffixes and re-resolves: `LINEAETH` →
  `LINEA`, `KAVAEVM` → `KAVA`, `XTZEVM` → `XTZ`, `ZILLIQA 2` → `ZIL`,
  `KAVA_EVM_CO_CHAIN` → `KAVA`.
- Bitcoin spellings fold onto `BTC`: `SEGWITBTC`, `BTC-Segwit`, `BTCBRC`,
  `BTCRUNES`, `BTCTAP`, `ORDIBTC`.
- Merges that look surprising but are correct: `NEO3` → `NEO` (N3 _is_ the
  current NEO network), `ZILLIQA 2` → `ZIL`.
- Deliberately **not** merged (genuinely distinct): `ARBNOVA`, `ETHW`,
  `MEGAETH`, `RBTC`, `MERLBTC`, `LBTC`, `LIGHTNING`, `FRAXTAL`, `MOVEMENT`.
- Anything still unmatched becomes its own chain (raw label), reported
  `unmapped` for later review.

Getting this wrong fragments one network into many chains (the bug that
motivated the rules: 9 separate Bitcoin chains), so extend `CHAIN_ALIASES`
rather than trusting an LLM to merge.

## Exchanges

Adapters live in `src/exchanges/`, keyed by lister `exchange.slug`:

| slug      | endpoint                                           | chains? | auth |
| --------- | -------------------------------------------------- | ------- | ---- |
| `binance` | `bapi/capital/v1/public/capital/getNetworkCoinAll` | yes     | no   |
| `gate`    | `api.gateio.ws/api/v4/spot/currencies`             | yes     | no   |
| `kucoin`  | `api.kucoin.com/api/v3/currencies`                 | yes     | no   |
| `bitget`  | `api.bitget.com/api/v2/spot/public/coins`          | yes     | no   |
| `okx`     | `api/v5/asset/currencies` (HMAC-signed)            | yes     | keys |
| `bybit`   | `api.bybit.com/v5/asset/coin/query-info` (signed)  | yes     | keys |
| `mexc`    | `api.mexc.com/api/v3/capital/config/getall`        | yes     | keys |
| `indodax` | `indodax.com/api/pairs`                            | no      | no   |

Slugs are lister's. Gate's CMC slug is `gate-io`; lister stores it as `gate`, so
the CLI accepts `gate-io` as an alias for `--only`.

MEXC's endpoint is private: set `MEXC_API_KEY` and `MEXC_API_SECRET` (read-only).
Without them the adapter is recorded as `skipped`, not a failure. Indodax exposes
no chain data, so its coins stay on the `UNMPD` placeholder.

## How a row is imported

- Market matched by lister `market.exchangeSymbol`, falling back to the coin's
  canonical `symbol`, within the exchange.
- Chain matched by code, else created from the label (`src/chains.ts` resolves
  the raw label deterministically — see _Chain naming_ above; anything unknown
  keeps the raw label and is reported `unmapped`).
- Chain link created, or its `withdrawEnabled`/`depositEnabled` flags updated.
- A market's `UNMPD` placeholder link is **never removed by default**. It means
  "chain not yet verified" and is the operator's job to clear, because only they
  can confirm two venues settle on the same network (Indodax publishes no chain
  data, so it stays on `UNMPD`). `--replace-unmapped` opts into deleting it.
  Nothing else is ever deleted.

## Cross-exchange analysis (`--analyze`)

Reads the snapshot and builds a union-find over `(exchange, label)` nodes to
propose which labels are the same network, then writes
`data/network-equivalence.json` (read-only; never touches lister). Signals,
strongest first:

1. **contract address** — same coin + same address across labels. Omnichain
   tokens (e.g. `ZRO`) reuse one address across chains, so a bucket is trusted
   only when its labels resolve to **at most one** canonical chain; otherwise it
   is ignored.
2. **canonical rules** — `BEP20→BSC`, `LINEAETH→LINEA`, `SEGWITBTC→BTC`, …
3. **name equality** — identical up to case/punctuation.

Merges backed only by name are flagged for review. This is the tool for "is
folder X's `AVAX_C` the same as Binance's `AVAXC`?" — it answers with the
evidence, not a guess.

## Notes

- Snapshots land in `apps/chain-metadata-collector/data/` (gitignored).
- `UNMPD` is shared with `apps/cmc-collector` so both agree on the placeholder.
- Extend `src/chains.ts`'s `CHAIN_ALIASES` as scrape reports surface mismatches.
- Import requires lister (`LISTER_URL`, default `http://localhost:3001`) and goes
  through `@arbitrator/sdk`.

Files: `index.ts` (CLI), `scrape.ts`, `import.ts`, `analyze.ts`, `lister.ts`,
`chains.ts`, `storage.ts`, `report.ts`, `http.ts`, `config.ts`, `types.ts`.
