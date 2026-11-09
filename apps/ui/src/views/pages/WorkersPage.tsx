import type { OrchestratorStatus } from "@arbitrator/contracts";
import type { ExchangeSelect } from "@arbitrator/lister/types";

import { ExchangeWorkerRow } from "../components/ExchangeWorkerRow";
import { RefreshIcon } from "../components/icons";
import { countWorkerStates } from "../components/worker-state";

/** Shared sender snapshot; the single source of truth lives in contracts. */
export type SenderStatus = OrchestratorStatus;

export type WorkersData =
    | { ok: true; status: SenderStatus; exchanges: ExchangeSelect[] }
    | { ok: false; message: string };

/**
 * Derive the props for one exchange's row from the current status. Every number
 * here is scoped to a single exchange; there is deliberately no aggregate.
 */
export function workerRowProps(status: SenderStatus, exchange: ExchangeSelect) {
    const own = status.workers.filter(
        (worker) => worker.exchangeSlug === exchange.slug,
    );
    const states = countWorkerStates(own);
    states.exited =
        (states.exited ?? 0) + (status.failures[exchange.slug] ?? 0);

    const desired = status.desired[exchange.slug] ?? 0;
    const capacity = status.capacity[exchange.slug] ?? 0;
    const expectedWorkers =
        capacity > 0 && desired > 0 ? Math.ceil(desired / capacity) : 0;
    const started = status.started.includes(exchange.slug);

    return {
        exchange,
        started,
        supported: status.supported.includes(exchange.slug),
        /** Alone: started but idle until a second exchange joins. */
        waiting: started && status.started.length < 2,
        workerCount: own.length,
        desired,
        capacity,
        symbolCount: own.reduce(
            (total, worker) => total + worker.symbols.length,
            0,
        ),
        states,
        expectedWorkers,
        workers: own.map((worker) => ({
            id: worker.id,
            state: worker.state,
            symbolCount: worker.symbols.length,
        })),
    };
}

/**
 * The single row renderer. The page and every push/write fragment call this, so
 * the server-rendered row and the pushed row are byte-identical.
 */
export function renderWorkerRow(
    status: SenderStatus,
    exchange: ExchangeSelect,
): string {
    return String(<ExchangeWorkerRow {...workerRowProps(status, exchange)} />);
}

/** Wrap a rendered row in the `<hx-partial>` that morphs it in place. */
export function wrapWorkerRowPartial(slug: string, html: string): string {
    return `<hx-partial hx-target="#worker-row-${slug}" hx-swap="outerMorph">${html}</hx-partial>`;
}

const WorkersTable = ({
    status,
    exchanges,
}: {
    status: SenderStatus;
    exchanges: ExchangeSelect[];
}) => (
    <div class="w-full overflow-x-auto">
        <table class="table w-full table-pin-rows [&_td]:px-2 [&_th]:px-2 sm:[&_td]:px-4 sm:[&_th]:px-4">
            <caption class="sr-only">
                Orderbook workers, one row per exchange. Each row shows the
                exchange's own status, worker counts, worker health and
                streaming-coin count.
            </caption>
            <thead>
                <tr>
                    <th scope="col" class="w-1/3">
                        Exchange
                    </th>
                    <th scope="col" class="w-20 sm:w-24">
                        Status
                    </th>
                    <th scope="col" class="hidden w-28 sm:table-cell">
                        Workers
                    </th>
                    <th scope="col" class="hidden w-32 sm:table-cell">
                        Worker health
                    </th>
                    <th
                        scope="col"
                        class="hidden w-14 text-right sm:table-cell"
                    >
                        Coins
                    </th>
                    <th scope="col" class="w-20 text-right sm:w-24">
                        Action
                    </th>
                </tr>
            </thead>
            <tbody id="workers-tbody">
                {exchanges.length > 0 ? (
                    exchanges.map((exchange) =>
                        renderWorkerRow(status, exchange),
                    )
                ) : (
                    <tr>
                        <td colspan="6" class="py-16 text-center">
                            <p class="font-medium">No exchanges yet</p>
                            <p class="mx-auto mt-1 max-w-prose text-sm opacity-60">
                                <a href="/markets" class="link">
                                    Add an exchange
                                </a>{" "}
                                to get started.
                            </p>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

/**
 * The swap unit for an explicit refresh (`GET /workers/list`). Start/stop and
 * recompute never swap the list: their POSTs return only the changed rows as
 * `<hx-partial>` fragments. The steady state never polls: `#workers-live` owns
 * a WebSocket and the server pushes only the rows that changed. The error card
 * keeps a slow retry poll so a downed sender recovers without a manual refresh.
 */
export const WorkersResults = ({ data }: { data: WorkersData }) => {
    if (!data.ok) {
        return (
            <div
                id="workers-results"
                hx-get="/workers/list"
                hx-trigger="every 10s"
                hx-target="#workers-results"
                hx-swap="outerHTML"
                class="flex flex-col gap-4"
            >
                <div class="alert alert-error" role="alert">
                    <div>
                        <p class="font-medium">
                            Unable to reach the orchestrator.
                        </p>
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
            <WorkersTable status={data.status} exchanges={data.exchanges} />
        </div>
    );
};

/**
 * Static chrome: the header and refresh button stay put while the results swap.
 * `#workers-indicator` is shared by the refresh and every row's action button.
 * `#workers-live` owns the socket; only changed rows are pushed as partials, so
 * row buttons keep focus across pushes. Recompute, start and stop are
 * fire-and-forget for the main swap (`hx-swap="none"`); their server response is
 * a row partial.
 */
export const WorkersPage = ({ data }: { data: WorkersData }) => {
    const wsAttributes: Record<string, string> = {
        "hx-ws:connect": "/workers/ws",
        "hx-target": "#workers-results",
        "hx-swap": "none",
        "hx-trigger": "load",
        "hx-on:htmx:ws:after:connection":
            "document.getElementById('workers-live-on')?.classList.remove('hidden');document.getElementById('workers-live-off')?.classList.add('hidden');const s=document.getElementById('workers-live-status');if(s)s.textContent='Worker status connection is live.'",
        "hx-on:htmx:ws:close":
            "document.getElementById('workers-live-on')?.classList.add('hidden');document.getElementById('workers-live-off')?.classList.remove('hidden');const s=document.getElementById('workers-live-status');if(s)s.textContent='Worker status connection lost. Reconnecting.'",
        "hx-on:htmx:ws:after:message:incoming":
            "document.getElementById('workers-updated')&&(document.getElementById('workers-updated').textContent='Updated '+new Date().toLocaleTimeString())",
    };

    return (
        <div class="flex flex-col gap-6">
            <section id="workers-list" class="w-full">
                <div class="card w-full bg-base-100 shadow-xl">
                    <div class="card-body gap-4 p-4 sm:p-8">
                        <header class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <p
                                    id="workers-live-status"
                                    role="status"
                                    class="sr-only"
                                >
                                    Connecting to the worker status stream.
                                </p>
                            </div>
                            <div class="flex items-center gap-2">
                                <span
                                    id="workers-live-off"
                                    class="badge badge-ghost badge-sm"
                                >
                                    Connecting…
                                </span>
                                <span
                                    id="workers-live-on"
                                    class="badge badge-success badge-sm hidden"
                                >
                                    Live
                                </span>
                                <span
                                    id="workers-updated"
                                    class="hidden text-xs tabular-nums opacity-60 sm:inline"
                                ></span>
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
                                <button
                                    type="button"
                                    class="btn btn-outline btn-sm"
                                    hx-post="/workers/reconcile"
                                    hx-swap="none"
                                    hx-indicator="#workers-indicator"
                                    title="Re-read metadata from the lister and re-pack workers"
                                    aria-label="Recompute workers from current metadata"
                                >
                                    Recompute
                                </button>
                            </div>
                        </header>
                        <div id="workers-live" {...wsAttributes}>
                            <WorkersResults data={data} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
