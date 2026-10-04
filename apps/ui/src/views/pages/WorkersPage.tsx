import type { ExchangeSelect } from "@arbitrator/lister/types";

import { ExchangeWorkerRow } from "../components/ExchangeWorkerRow";
import { RefreshIcon } from "../components/icons";

type SymbolSubscription = { cmcId: number; symbol: string };

type WorkerSnapshot = {
  id: string;
  exchangeSlug: string;
  symbols: SymbolSubscription[];
};

export type SenderStatus = {
  started: string[];
  workers: WorkerSnapshot[];
  supported: string[];
};

export type WorkersData =
  | { ok: true; status: SenderStatus; exchanges: ExchangeSelect[] }
  | { ok: false; message: string };

const oob = (enabled?: boolean) => (enabled ? { "hx-swap-oob": "true" } : {});

export const WorkersStats = ({
  status,
  oob: enabled,
}: {
  status: SenderStatus;
  oob?: boolean;
}) => {
  const totalSymbols = status.workers.reduce(
    (total, worker) => total + worker.symbols.length,
    0,
  );

  return (
    <div
      id="workers-stats"
      class="stats stats-vertical w-full border border-base-300 bg-base-100 sm:stats-horizontal"
      {...oob(enabled)}
    >
      <div class="stat">
        <div class="stat-title">Started exchanges</div>
        <div class="stat-value tabular-nums">{status.started.length}</div>
      </div>
      <div class="stat">
        <div class="stat-title">Worker connections</div>
        <div class="stat-value tabular-nums">{status.workers.length}</div>
      </div>
      <div class="stat">
        <div class="stat-title">Streaming coins</div>
        <div class="stat-value tabular-nums">{totalSymbols}</div>
      </div>
    </div>
  );
};

export const WorkersHint = ({
  status,
  oob: enabled,
}: {
  status: SenderStatus;
  oob?: boolean;
}) => (
  <div
    id="workers-hint"
    role="status"
    class={status.started.length === 1 ? "alert" : "hidden"}
    {...oob(enabled)}
  >
    <span>
      One exchange is started. Start a second one to stream the coins
      transferable between them.
    </span>
  </div>
);

/** Derive the props for one exchange's row from the current status. */
export function workerRowProps(status: SenderStatus, exchange: ExchangeSelect) {
  const own = status.workers.filter(
    (worker) => worker.exchangeSlug === exchange.slug,
  );

  return {
    exchange,
    started: status.started.includes(exchange.slug),
    supported: status.supported.includes(exchange.slug),
    workerCount: own.length,
    symbolCount: own.reduce(
      (total, worker) => total + worker.symbols.length,
      0,
    ),
  };
}

/**
 * The response to a start/stop action: the affected row is the primary swap
 * (`hx-target="closest tr"`), while the summary and hint update out-of-band.
 */
export const WorkersRowUpdate = ({
  status,
  exchange,
}: {
  status: SenderStatus;
  exchange: ExchangeSelect;
}) => (
  <>
    <ExchangeWorkerRow {...workerRowProps(status, exchange)} />
    <WorkersStats status={status} oob />
    <WorkersHint status={status} oob />
  </>
);

const WorkersTable = ({
  status,
  exchanges,
}: {
  status: SenderStatus;
  exchanges: ExchangeSelect[];
}) => (
  <div class="w-full overflow-x-auto">
    <table class="table w-full table-pin-rows [&_td]:px-2 [&_th]:px-2 sm:[&_td]:px-4 sm:[&_th]:px-4">
      <thead>
        <tr>
          <th class="w-1/2">Exchange</th>
          <th class="hidden w-24 md:table-cell">Base</th>
          <th class="w-28">Status</th>
          <th class="hidden w-20 text-right sm:table-cell">Workers</th>
          <th class="hidden w-20 text-right sm:table-cell">Coins</th>
          <th class="w-32 text-right">
            <span class="sr-only">Action</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {exchanges.length > 0 ? (
          exchanges.map((exchange) => (
            <ExchangeWorkerRow {...workerRowProps(status, exchange)} />
          ))
        ) : (
          <tr>
            <td colspan="6" class="py-16 text-center">
              <p class="font-medium">No exchanges yet</p>
              <p class="mx-auto mt-1 max-w-prose text-sm opacity-60">
                Add exchanges under Exchange Management first.
              </p>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

/**
 * The swap unit for an explicit refresh (`GET /workers/list`). Start/stop only
 * swaps the affected row, see `WorkersRowUpdate`.
 */
export const WorkersResults = ({ data }: { data: WorkersData }) => {
  if (!data.ok) {
    return (
      <div id="workers-results" class="flex flex-col gap-4">
        <div class="alert alert-error" role="alert">
          <div>
            <p class="font-medium">Unable to reach the orchestrator.</p>
            <p class="text-sm opacity-80" safe>
              {data.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="workers-results" class="flex flex-col gap-4">
      <WorkersStats status={data.status} />
      <WorkersHint status={data.status} />
      <WorkersTable status={data.status} exchanges={data.exchanges} />
    </div>
  );
};

/**
 * Static chrome: the header and refresh button stay put while the results swap.
 * `#workers-indicator` is shared by the refresh and every row's action button.
 */
export const WorkersPage = ({ data }: { data: WorkersData }) => (
  <div class="flex flex-col gap-6">
    <section id="workers-list" class="w-full">
      <div class="card w-full bg-base-100 shadow-xl">
        <div class="card-body gap-4 p-4 sm:p-8">
          <header class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 class="text-lg font-semibold">Orderbook workers</h2>
              <p class="max-w-prose text-sm opacity-60">
                Start two or more exchanges to stream the coins transferable
                between them.
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span
                id="workers-indicator"
                class="htmx-indicator loading loading-spinner loading-sm"
              ></span>
              <button
                type="button"
                class="btn btn-outline btn-sm"
                hx-get="/workers/list"
                hx-target="#workers-results"
                hx-swap="outerHTML"
                hx-indicator="#workers-indicator"
                aria-label="Refresh worker status"
              >
                <RefreshIcon /> Refresh
              </button>
            </div>
          </header>
          <WorkersResults data={data} />
        </div>
      </div>
    </section>
  </div>
);
