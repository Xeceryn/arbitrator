import type {
    ExchangeSelect,
    OpportunitySignal,
} from "@arbitrator/lister/types";

import { SignalCard } from "../components/SignalCard";
import { SignalTableRow } from "../components/SignalTableRow";

export type SignalView = "card" | "table";
export type SignalOrderBy = "profitPercentage" | "profitVolume";

export type SignalQuery = {
    view: SignalView;
    orderBy: SignalOrderBy;
    order: "asc" | "desc";
    /** Exchange slugs whose signals are hidden (either leg). */
    hide: string[];
};

export type SignalsData =
    | { ok: true; signals: OpportunitySignal[] }
    | { ok: false; message: string };

const VIEW_OPTIONS: Array<{ value: SignalView; label: string }> = [
    { value: "card", label: "Cards" },
    { value: "table", label: "Table" },
];

const ORDER_BY_OPTIONS: Array<{ value: SignalOrderBy; label: string }> = [
    { value: "profitPercentage", label: "Profit %" },
    { value: "profitVolume", label: "Profit volume" },
];

/**
 * Filter chrome. Purely client-side now: the socket broadcasts one shared board
 * and `signal-board.ts` reads these inputs to hide/sort/switch view locally, so
 * changing a filter never touches the network and the form keeps focus.
 */
export const SignalControls = ({
    query,
    exchanges,
}: {
    query: SignalQuery;
    exchanges: ExchangeSelect[];
}) => (
    <form
        id="signal-controls"
        onsubmit="return false"
        class="flex flex-wrap items-center gap-2"
    >
        <div role="tablist" class="tabs tabs-box">
            {VIEW_OPTIONS.map((option) => (
                <input
                    type="radio"
                    name="view"
                    class="tab"
                    value={option.value}
                    aria-label={option.label}
                    checked={query.view === option.value}
                />
            ))}
        </div>

        <label class="select select-bordered w-40">
            <span class="sr-only">Sort by</span>
            <select name="orderBy">
                {ORDER_BY_OPTIONS.map((option) => (
                    <option
                        value={option.value}
                        selected={query.orderBy === option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </label>

        <label class="select select-bordered w-40">
            <span class="sr-only">Direction</span>
            <select name="order">
                <option value="desc" selected={query.order === "desc"}>
                    Descending
                </option>
                <option value="asc" selected={query.order === "asc"}>
                    Ascending
                </option>
            </select>
        </label>

        <details class="dropdown dropdown-end [&:not([open])>.dropdown-content]:hidden">
            <summary class="btn btn-outline btn-sm">
                Exchanges
                <span id="signal-hide-count">
                    {query.hide.length > 0 ? ` (${query.hide.length})` : ""}
                </span>
            </summary>
            <ul class="dropdown-content menu z-50 max-h-96 w-60 flex-nowrap overflow-y-auto rounded-box border border-base-300 bg-base-100 p-2 shadow-2xl">
                {exchanges.length === 0 ? (
                    <li class="px-3 py-2 text-sm opacity-60">
                        No exchanges yet
                    </li>
                ) : (
                    exchanges.map((exchange) => (
                        <li>
                            <label class="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="hide"
                                    value={exchange.slug}
                                    class="checkbox checkbox-sm"
                                    checked={query.hide.includes(exchange.slug)}
                                />
                                <img
                                    src={exchange.logo}
                                    alt=""
                                    loading="lazy"
                                    class="size-4 rounded-full object-contain"
                                />
                                <span class="truncate" safe>
                                    {exchange.name}
                                </span>
                            </label>
                        </li>
                    ))
                )}
            </ul>
        </details>
    </form>
);

const SignalTable = ({ signals }: { signals: OpportunitySignal[] }) => (
    <div class="w-full overflow-x-auto">
        <table class="table w-full table-pin-rows [&_td]:px-2 [&_th]:px-2 sm:[&_td]:px-4 sm:[&_th]:px-4">
            <thead>
                <tr>
                    <th>Coin</th>
                    <th class="hidden lg:table-cell">ID</th>
                    <th>Buy exchange</th>
                    <th>Sell exchange</th>
                    <th class="hidden text-right md:table-cell">Buy price</th>
                    <th class="hidden text-right md:table-cell">Sell price</th>
                    <th class="text-right">Profit %</th>
                    <th class="text-right">Profit volume</th>
                    <th class="hidden xl:table-cell">Pair</th>
                </tr>
            </thead>
            <tbody data-signal-list>
                {signals.map((signal) => (
                    <SignalTableRow signal={signal} />
                ))}
            </tbody>
        </table>
    </div>
);

/**
 * The swappable board. Root id `signal-board` is stable so the WebSocket's
 * morph diff instead of replacing the DOM every second.
 */
/**
 * The swappable board. Root id `signal-board` is stable so the WebSocket morphs
 * instead of replacing the DOM every tick. It always carries both views; the
 * client shows one and sorts/filters locally, which is why the WebSocket can
 * broadcast the exact same HTML to everyone.
 */
export const SignalBoard = ({ data }: { data: SignalsData }) => {
    if (!data.ok) {
        return (
            <div id="signal-board" class="alert alert-error" role="alert">
                <div>
                    <p class="font-medium">Unable to load signals.</p>
                    <p class="text-sm opacity-80" safe>
                        {data.message}
                    </p>
                </div>
            </div>
        );
    }

    if (data.signals.length === 0) {
        return (
            <div id="signal-board" class="py-16 text-center">
                <p class="font-medium">No profitable signals</p>
                <p class="mx-auto mt-1 max-w-prose text-sm opacity-60">
                    Start two or more exchanges under Worker Orchestration to
                    stream transferable coins.
                </p>
            </div>
        );
    }

    return (
        <div id="signal-board">
            <div data-signal-panel="card">
                <div
                    data-signal-list
                    class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8"
                >
                    {data.signals.map((signal) => (
                        <SignalCard signal={signal} />
                    ))}
                </div>
            </div>
            <div data-signal-panel="table" style="display:none">
                <SignalTable signals={data.signals} />
            </div>
        </div>
    );
};

/**
 * Full signal page. `#signal-live` owns the socket; it wraps both the controls
 * (kept outside the morph target so their state survives) and the board. Only
 * `#signal-board` is swapped, and `signal-board.ts` re-applies the local
 * filter/sort/view after every push.
 */
export const SignalPage = ({
    query,
    data,
    exchanges,
}: {
    query: SignalQuery;
    data: SignalsData;
    exchanges: ExchangeSelect[];
}) => {
    const wsAttributes: Record<string, string> = {
        "hx-ws:connect": "/signals/ws",
        "hx-target": "#signal-board",
        "hx-swap": "outerMorph",
        "hx-trigger": "load",
    };

    return (
        <div class="flex flex-col gap-6">
            <section id="signals" class="w-full">
                <div class="card w-full bg-base-100 shadow-xl">
                    <div class="card-body gap-4 p-4 sm:p-8">
                        <div id="signal-live" {...wsAttributes}>
                            <SignalControls
                                query={query}
                                exchanges={exchanges}
                            />
                            <div class="mt-4">
                                <SignalBoard data={data} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
