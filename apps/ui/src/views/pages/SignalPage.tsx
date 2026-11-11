import type {
    ExchangeSelect,
    OpportunitySignal,
} from "@arbitrator/lister/types";

import { VolumeIcon, VolumeOffIcon } from "../components/icons";
import { SignalCard } from "../components/SignalCard";

export type SignalOrderBy = "profitPercentage" | "profitVolume";

export type SignalQuery = {
    orderBy: SignalOrderBy;
    /** Exchange slugs whose signals are hidden (either leg). */
    hide: string[];
    /** Transfer routes to show; empty means all four. */
    routes: SignalRoute[];
};

export type SignalsData =
    | { ok: true; signals: OpportunitySignal[] }
    | { ok: false; message: string };

const ORDER_BY_OPTIONS: Array<{ value: SignalOrderBy; label: string }> = [
    { value: "profitPercentage", label: "Profit %" },
    { value: "profitVolume", label: "Profit volume" },
];

/**
 * Transfer routes, keyed by the buy/sell exchange base currency pair. The key
 * is also the CSS class that colours the card (`signal-<buy>-<sell>` in
 * `assets/styles/styles.css`), so the swatch in the filter matches the card.
 *
 * Filtering is client-side (`signal-board.ts` hides cards by `data-route`); the
 * selection lives in the URL as repeated `route=<key>` params so a filtered
 * board can be bookmarked or shared.
 */
export const SIGNAL_ROUTES = [
    { key: "idr-usdt", letter: "A", label: "IDR → USDT" },
    { key: "usdt-idr", letter: "B", label: "USDT → IDR" },
    { key: "usdt-usdt", letter: "C", label: "USDT → USDT" },
    // Only reachable once two IDR-quoted venues (Indodax + Pintu) are started.
    { key: "idr-idr", letter: "D", label: "IDR → IDR" },
] as const;

export type SignalRoute = (typeof SIGNAL_ROUTES)[number]["key"];

const SIGNAL_ROUTE_KEYS: readonly string[] = SIGNAL_ROUTES.map(
    (route) => route.key,
);

/** Whether `value` names one of the four transfer routes. */
export function isSignalRoute(value: string): value is SignalRoute {
    return SIGNAL_ROUTE_KEYS.includes(value);
}

/**
 * Route filter from the query string. Empty means "every route"; unknown keys
 * are dropped rather than rejected, so an old bookmark still opens the board.
 * The order is fixed by `SIGNAL_ROUTES`, which keeps the URL canonical.
 */
export function parseRoutes(values: string[]): SignalRoute[] {
    const selected = new Set(values.filter(isSignalRoute));
    return SIGNAL_ROUTES.map((route) => route.key).filter((key) =>
        selected.has(key),
    );
}

/**
 * Alarm clips, one per integer profit percentage (5 covers 5% and above).
 * `signal-audio.ts` plays the matching one for the board's first card.
 */
const ALARM_TRACKS = [
    { track: 1, file: "audio.mp3" },
    { track: 2, file: "2times-alarm.mp3" },
    { track: 3, file: "3times-alarm.mp3" },
    { track: 4, file: "4times-alarm.mp3" },
    { track: 5, file: "5times-alarm.mp3" },
];

/**
 * Hidden alarm clips. They live outside `#signal-board`, so a WebSocket swap
 * never destroys an alarm that is playing.
 */
export const SignalAlarm = () => (
    <>
        {ALARM_TRACKS.map(({ track, file }) => (
            <audio
                data-signal-alarm={String(track)}
                src={`/public/audio/${file}`}
                preload="auto"
                hidden
            />
        ))}
    </>
);

/**
 * Route filter. Checked means shown; `routes` comes from the `route` query
 * params, and an empty selection means every route (the four checkboxes are
 * then all checked, and the client drops the param from the URL again).
 */
const RouteFilter = ({ routes }: { routes: SignalRoute[] }) => {
    const active = new Set<string>(routes);
    const filtered = routes.length > 0 && routes.length < SIGNAL_ROUTES.length;

    return (
        <details class="dropdown dropdown-end [&:not([open])>.dropdown-content]:hidden">
            <summary class="btn btn-outline btn-sm">
                Routes
                <span id="signal-route-count">
                    {filtered
                        ? ` (${routes.length}/${SIGNAL_ROUTES.length})`
                        : ""}
                </span>
            </summary>
            <ul class="dropdown-content menu z-50 w-64 flex-nowrap rounded-box border border-base-300 bg-base-100 p-2 shadow-2xl">
                {SIGNAL_ROUTES.map((route) => (
                    <li>
                        <label class="flex cursor-pointer items-center gap-2">
                            <input
                                type="checkbox"
                                name="route"
                                value={route.key}
                                class="checkbox checkbox-sm"
                                checked={!filtered || active.has(route.key)}
                            />
                            <span
                                class={`signal-${route.key} signal-bg size-2.5 shrink-0 rounded-full`}
                                aria-hidden="true"
                            ></span>
                            <span>Rute {route.letter}</span>
                            <span class="ml-auto text-xs font-normal opacity-60">
                                {route.label}
                            </span>
                        </label>
                    </li>
                ))}
            </ul>
        </details>
    );
};

/**
 * Filter chrome. `hide` and `route` are purely client-side, so changing them
 * never touches the network and the form keeps focus; `signal-board.ts` also
 * mirrors them into the URL. `orderBy` is the exception: it picks the stream
 * this socket subscribes to, so `hx-ws:send` (default `change` for a
 * `<select>`) tells the server to move us to the `profitPercentage` or
 * `profitVolume` room and resend that room's board. Signals are always ranked
 * descending, so there is no direction control.
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
        <label class="select select-bordered w-40">
            <span class="sr-only">Sort by</span>
            <select name="orderBy" hx-ws:send="true">
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

        <RouteFilter routes={query.routes} />

        <div class="ml-auto flex items-center gap-2">
            <button
                id="signal-audio-mute"
                type="button"
                class="btn btn-ghost btn-sm btn-square"
                aria-label="Mute signal alarm"
                aria-pressed="false"
                title="Mute signal alarm"
            >
                <VolumeIcon class="signal-audio-sound size-4" />
                <VolumeOffIcon class="signal-audio-muted hidden size-4" />
            </button>
            <label class="flex items-center gap-2">
                <span class="sr-only">Signal alarm volume</span>
                <input
                    id="signal-audio-volume"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value="50"
                    class="range range-xs w-24"
                />
            </label>
            <output
                id="signal-audio-volume-value"
                for="signal-audio-volume"
                class="w-9 text-xs font-bold tabular-nums opacity-70"
            >
                50%
            </output>
        </div>
    </form>
);

/**
 * The board body. `#signal-board` is the stable morph-free wrapper; only its
 * children change. The stream replaces it with this markup on a membership
 * change (empty ↔ non-empty) and swaps individual cards in place the rest of
 * the time, so this output is also what the first WebSocket payload carries.
 */
export const SignalBoard = ({ data }: { data: SignalsData }) => {
    if (!data.ok) {
        return (
            <div class="alert alert-error" role="alert">
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
            <div class="py-16 text-center">
                <p class="font-medium">No profitable signals</p>
                <p class="mx-auto mt-1 max-w-prose text-sm opacity-60">
                    <a href="/workers" class="link">
                        Start at least two exchanges
                    </a>{" "}
                    to stream transferable coins.
                </p>
            </div>
        );
    }

    return (
        <>
            <div
                id="signal-list"
                data-signal-list="true"
                class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8"
            >
                {data.signals.map((signal) => (
                    <SignalCard signal={signal} />
                ))}
            </div>
            {/* Shown by `signal-board.ts` when the local filters hide every card. */}
            <div id="signal-filter-empty" class="hidden py-16 text-center">
                <p class="font-medium">No signals for these filters</p>
                <p class="mx-auto mt-1 max-w-prose text-sm opacity-60">
                    Widen the exchange or route filter to see the board again.
                </p>
            </div>
        </>
    );
};

/**
 * Full signal page. `#signal-live` owns the socket; it wraps the controls
 * (kept outside any swap target so their state survives) and `#signal-board`.
 * Only the board's contents are ever replaced, and `signal-board.ts` reapplies
 * the local hide/sort state after every push.
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
        "hx-ws:connect": `/signals/ws?orderBy=${query.orderBy}`,
        "hx-swap": "none",
        "hx-trigger": "load",
    };

    return (
        <div class="flex flex-col gap-6">
            <SignalAlarm />
            <section id="signals" class="w-full">
                <div class="card w-full bg-base-100 shadow-xl">
                    <div class="card-body gap-4 p-4 sm:p-8">
                        <div id="signal-live" {...wsAttributes}>
                            <SignalControls
                                query={query}
                                exchanges={exchanges}
                            />
                            <div class="mt-4" id="signal-board">
                                <SignalBoard data={data} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
