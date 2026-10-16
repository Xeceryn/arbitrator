import type { ExchangeSelect } from "@arbitrator/lister/types";

import { PlayIcon, StopIcon, XIcon } from "./icons";
import {
    WorkerHealthCell,
    type WorkerDetail,
    type WorkerStateCounts,
} from "./worker-state";

type Props = {
    exchange: ExchangeSelect;
    started: boolean;
    supported: boolean;
    /** Started but alone: nothing is arbitrageable until a second exchange joins. */
    waiting: boolean;
    workerCount: number;
    /** Desired subscription count reported by the orchestrator. */
    desired: number;
    /** Max subscriptions one worker may hold for this exchange. */
    capacity: number;
    symbolCount: number;
    states: WorkerStateCounts;
    expectedWorkers: number;
    workers: WorkerDetail[];
};

type StatusView = {
    label: string;
    className: string;
    /** Plain-language reason, so the badge never stands on colour alone. */
    reason: string;
    /** The row-local orientation for "started but alone". */
    waitingNote?: string;
};

function statusView(
    started: boolean,
    supported: boolean,
    waiting: boolean,
): StatusView {
    if (!supported) {
        return {
            label: "No adapter",
            className: "badge badge-ghost badge-xs sm:badge-sm",
            reason: "No worker adapter is implemented for this exchange yet.",
        };
    }
    if (waiting) {
        return {
            label: "Waiting for pair",
            className: "badge badge-warning badge-xs sm:badge-sm",
            reason: "Started, but idle until a second exchange is started.",
            waitingNote:
                "Arbitrage needs a second started exchange before this one streams anything.",
        };
    }
    if (started) {
        return {
            label: "Running",
            className: "badge badge-success badge-xs sm:badge-sm",
            reason: "Streaming order books for this exchange.",
        };
    }
    return {
        label: "Stopped",
        className: "badge badge-outline badge-xs opacity-70 sm:badge-sm",
        reason: "Not started. Use Start to begin streaming.",
    };
}

/**
 * Status badge cell. The whole row is re-rendered (page load and every push),
 * so the badge and its reason follow live. The "waiting for a second exchange"
 * orientation lives here, scoped to this exchange's own row.
 */
export const WorkerStatusCell = ({
    slug,
    started,
    supported,
    waiting,
}: {
    slug: string;
    started: boolean;
    supported: boolean;
    waiting: boolean;
}) => {
    const status = statusView(started, supported, waiting);
    return (
        <td id={`worker-status-${slug}`}>
            <span class={`${status.className} whitespace-nowrap`} safe>
                {status.label}
            </span>
            <p class="mt-1 hidden max-w-xs text-xs opacity-60 lg:block" safe>
                {status.reason}
            </p>
            {status.waitingNote ? (
                <p class="mt-1 max-w-xs text-xs opacity-60" safe>
                    {status.waitingNote}
                </p>
            ) : null}
        </td>
    );
};

/**
 * Worker/subscription counts for one exchange. Both pairs are written as
 * labelled text: live workers out of the expected worker count (derived from
 * desired/capacity, guarded against divide-by-zero), then desired
 * subscriptions against that exchange's per-worker capacity.
 */
export const WorkerCountsCell = ({
    slug,
    desired,
    capacity,
    workerCount,
    expectedWorkers,
}: {
    slug: string;
    desired: number;
    capacity: number;
    workerCount: number;
    expectedWorkers: number;
}) => {
    const understaffed = expectedWorkers > 0 && workerCount < expectedWorkers;
    return (
        <td
            id={`worker-counts-${slug}`}
            class="hidden text-sm tabular-nums sm:table-cell"
        >
            <div>
                <span class="opacity-60">Workers:</span>{" "}
                <span
                    class={
                        understaffed
                            ? "font-semibold text-warning"
                            : "font-semibold"
                    }
                >
                    {workerCount}
                </span>{" "}
                live of {expectedWorkers} expected
            </div>
            <div class="text-xs opacity-60">
                Subscriptions: <span class="tabular-nums">{desired}</span>{" "}
                desired, <span class="tabular-nums">{capacity}</span> capacity
            </div>
        </td>
    );
};

/** Streaming-coins cell: the sum of this exchange's own workers' symbols. */
export const WorkerCoinsCell = ({
    slug,
    symbolCount,
}: {
    slug: string;
    symbolCount: number;
}) => (
    <td
        id={`worker-coins-${slug}`}
        class="hidden text-right text-sm tabular-nums sm:table-cell"
        title={`${symbolCount} coins streamed by this exchange`}
    >
        {symbolCount}
    </td>
);

/**
 * Start/stop cell. The buttons return the smallest changed fragment (`hx-swap`
 * is `none`, so the server's `<hx-partial>` does the row morph) and keep the
 * shared indicator because a start/stop round-trips to the orchestrator.
 */
export const WorkerActionCell = ({
    slug,
    name,
    started,
    supported,
}: {
    slug: string;
    name: string;
    started: boolean;
    supported: boolean;
}) => (
    <td id={`worker-action-${slug}`} class="text-right">
        {!supported ? (
            <button
                type="button"
                class="btn btn-outline btn-xs max-sm:btn-square sm:btn-sm"
                disabled
                title="No worker adapter implemented for this exchange"
                aria-label={`${name} has no worker adapter`}
            >
                <span class="sm:hidden">
                    <XIcon />
                </span>
                <span class="hidden sm:inline">Unsupported</span>
            </button>
        ) : started ? (
            <button
                type="button"
                class="btn btn-outline btn-xs btn-error max-sm:btn-square sm:btn-sm"
                hx-post={`/workers/${slug}/stop`}
                hx-swap="none"
                hx-indicator="#workers-indicator"
                aria-label={`Stop ${name}`}
            >
                <StopIcon />
                <span class="hidden sm:inline">Stop</span>
            </button>
        ) : (
            <button
                type="button"
                class="btn btn-outline btn-xs btn-success max-sm:btn-square sm:btn-sm"
                hx-post={`/workers/${slug}/start`}
                hx-swap="none"
                hx-indicator="#workers-indicator"
                aria-label={`Start ${name}`}
            >
                <PlayIcon />
                <span class="hidden sm:inline">Start</span>
            </button>
        )}
    </td>
);

/**
 * One exchange in the orchestrator table. Every dynamic cell carries a stable
 * id; the socket and the write endpoints morph the whole `<tr>` in place, so
 * row focus survives a push. The exchange cell is the row header
 * (`scope="row"`) and carries the logo, name, slug and base currency.
 */
export const ExchangeWorkerRow = ({
    exchange,
    started,
    supported,
    waiting,
    workerCount,
    desired,
    capacity,
    symbolCount,
    states,
    expectedWorkers,
    workers,
}: Props) => {
    return (
        <tr id={`worker-row-${exchange.slug}`}>
            <th scope="row" class="align-top font-normal">
                <div class="flex items-center gap-2 sm:gap-3">
                    <div class="avatar">
                        <div class="mask mask-circle size-8 sm:size-10">
                            {/* decorative: the exchange name sits next to it */}
                            <img src={exchange.logo} alt="" loading="lazy" />
                        </div>
                    </div>
                    <div class="min-w-0">
                        <div class="truncate font-medium" safe>
                            {exchange.name}
                        </div>
                        <div class="hidden truncate font-mono text-xs opacity-60 sm:block sm:text-sm" safe>
                            {exchange.slug}
                        </div>
                        <span class="badge badge-outline badge-xs mt-1 font-mono uppercase" safe>
                            {exchange.baseCurrency}
                        </span>
                    </div>
                </div>
            </th>
            <WorkerStatusCell
                slug={exchange.slug}
                started={started}
                supported={supported}
                waiting={waiting}
            />
            <WorkerCountsCell
                slug={exchange.slug}
                desired={desired}
                capacity={capacity}
                workerCount={workerCount}
                expectedWorkers={expectedWorkers}
            />
            <WorkerHealthCell
                slug={exchange.slug}
                states={states}
                workers={workers}
            />
            <WorkerCoinsCell slug={exchange.slug} symbolCount={symbolCount} />
            <WorkerActionCell
                slug={exchange.slug}
                name={exchange.name}
                started={started}
                supported={supported}
            />
        </tr>
    );
};
