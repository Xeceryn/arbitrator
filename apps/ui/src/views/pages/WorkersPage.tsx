import { listerClient } from "@arbitrator/sdk";

import { senderClient } from "../../sender.client";
import { ExchangeWorkerRow } from "../components/ExchangeWorkerRow";
import { RefreshIcon } from "../components/icons";

type SymbolSubscription = { cmcId: number; symbol: string };

type WorkerSnapshot = {
  id: string;
  exchangeSlug: string;
  symbols: SymbolSubscription[];
};

type UnplacedSubscription = {
  exchangeSlug: string;
  cmcId: number;
  symbol: string;
};

type SenderStatus = {
  started: string[];
  workers: WorkerSnapshot[];
  unplaced: UnplacedSubscription[];
  supported: string[];
};

function describeError(error: unknown): string {
  if (!error) return "request failed";
  if (typeof error === "object" && error !== null) {
    const record = error as Record<string, unknown>;
    const value = record.value;
    if (value && typeof value === "object" && "message" in value) {
      return String((value as { message: unknown }).message);
    }
    if ("message" in record) return String(record.message);
  }
  return String(error);
}

async function loadStatus() {
  try {
    const { data, error } = await senderClient.exchanges.get();
    if (error || !data) {
      return { ok: false as const, message: describeError(error) };
    }
    return { ok: true as const, status: data as unknown as SenderStatus };
  } catch (error) {
    return { ok: false as const, message: describeError(error) };
  }
}

async function loadExchanges() {
  const [error, data] = await listerClient.exchange.list({ limit: -1 });
  if (error || !data) return null;
  return data.data;
}

/**
 * The swap unit. `GET /workers/list` and both start/stop endpoints return
 * exactly this `<div id="workers-results">`.
 */
export const WorkersResults = async () => {
  const statusResult = await loadStatus();
  const exchanges = await loadExchanges();

  if (!statusResult.ok) {
    return (
      <div id="workers-results" class="flex flex-col gap-4">
        <div class="alert alert-error" role="alert">
          <div>
            <p class="font-medium">Unable to reach the orchestrator.</p>
            <p class="text-sm opacity-80" safe>
              {statusResult.message}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!exchanges) {
    return (
      <div id="workers-results" class="flex flex-col gap-4">
        <div class="alert alert-error" role="alert">
          <span>Unable to load exchanges.</span>
        </div>
      </div>
    );
  }

  const { status } = statusResult;
  const startedSet = new Set(status.started);
  const supportedSet = new Set(status.supported);

  const workerCount = (slug: string) =>
    status.workers.filter((worker) => worker.exchangeSlug === slug).length;
  const symbolCount = (slug: string) =>
    status.workers
      .filter((worker) => worker.exchangeSlug === slug)
      .reduce((total, worker) => total + worker.symbols.length, 0);

  return (
    <div id="workers-results" class="flex flex-col gap-4">
      <div class="stats stats-vertical w-full border border-base-300 bg-base-100 sm:stats-horizontal">
        <div class="stat">
          <div class="stat-title">Started exchanges</div>
          <div class="stat-value tabular-nums">{status.started.length}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Worker connections</div>
          <div class="stat-value tabular-nums">{status.workers.length}</div>
        </div>
        <div class="stat">
          <div class="stat-title">Unplaced coins</div>
          <div class="stat-value tabular-nums">{status.unplaced.length}</div>
        </div>
      </div>

      {status.unplaced.length > 0 ? (
        <div class="alert alert-warning" role="alert">
          <span>
            {status.unplaced.length} coin(s) exceeded a connection limit and are
            not streaming.
          </span>
        </div>
      ) : null}

      {status.started.length === 1 ? (
        <div class="alert" role="status">
          <span>
            One exchange is started. Start a second one to stream the coins
            transferable between them.
          </span>
        </div>
      ) : null}

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
                <ExchangeWorkerRow
                  exchange={exchange}
                  started={startedSet.has(exchange.slug)}
                  supported={supportedSet.has(exchange.slug)}
                  workerCount={workerCount(exchange.slug)}
                  symbolCount={symbolCount(exchange.slug)}
                />
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
    </div>
  );
};

/**
 * Static chrome: the header and refresh button stay put while the results swap.
 * `#workers-indicator` is shared by the refresh and every row's action button.
 */
export const WorkersPage = () => (
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
          <WorkersResults />
        </div>
      </div>
    </section>
  </div>
);
