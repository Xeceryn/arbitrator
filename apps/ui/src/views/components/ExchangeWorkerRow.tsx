import type { ExchangeSelect } from "@arbitrator/lister/types";

import { PlayIcon, StopIcon } from "./icons";
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
    symbolCount: number;
    states: WorkerStateCounts;
    expectedWorkers: number;
    workers: WorkerDetail[];
};

function statusView(started: boolean, supported: boolean, waiting: boolean) {
    if (!supported) {
        return { label: "No adapter", className: "badge badge-ghost badge-sm" };
    }
    if (waiting) {
        return {
            label: "Waiting for pair",
            className: "badge badge-warning badge-sm",
        };
    }
    if (started) {
        return { label: "Running", className: "badge badge-success badge-sm" };
    }
    return {
        label: "Stopped",
        className: "badge badge-outline badge-sm opacity-70",
    };
}

/** Status badge cell. The socket replaces the whole row, so the badge follows live. */
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
        </td>
    );
};

/** Live worker / expected counts cell. */
export const WorkerCountsCell = ({
    slug,
    workerCount,
    expectedWorkers,
}: {
    slug: string;
    workerCount: number;
    expectedWorkers: number;
}) => (
    <td
        id={`worker-counts-${slug}`}
        class="hidden text-right tabular-nums sm:table-cell"
        title={
            expectedWorkers > 0
                ? `${workerCount} live of ${expectedWorkers} expected`
                : undefined
        }
    >
        <span
            class={
                workerCount < expectedWorkers
                    ? "font-semibold text-warning"
                    : undefined
            }
        >
            {workerCount}
        </span>
        {expectedWorkers > 0 ? (
            <span class="opacity-60"> / {expectedWorkers}</span>
        ) : null}
    </td>
);

/** Streaming-coins cell. */
export const WorkerCoinsCell = ({
    slug,
    symbolCount,
}: {
    slug: string;
    symbolCount: number;
}) => (
    <td
        id={`worker-coins-${slug}`}
        class="hidden text-right tabular-nums sm:table-cell"
    >
        {symbolCount}
    </td>
);

/**
 * Start/stop cell. The buttons are fire-and-forget (`hx-swap="none"`): the
 * POST only toasts, and every visual change arrives via the socket push, so
 * concurrent tabs stay in lockstep.
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
                class="btn btn-outline btn-sm"
                disabled
                title="No worker adapter implemented for this exchange"
                aria-label={`${name} has no worker adapter`}
            >
                Unsupported
            </button>
        ) : started ? (
            <button
                type="button"
                class="btn btn-outline btn-sm btn-error"
                hx-post={`/workers/${slug}/stop`}
                hx-swap="none"
                hx-indicator="#workers-indicator"
                aria-label={`Stop ${name}`}
            >
                <StopIcon /> Stop
            </button>
        ) : (
            <button
                type="button"
                class="btn btn-outline btn-sm btn-success"
                hx-post={`/workers/${slug}/start`}
                hx-swap="none"
                hx-indicator="#workers-indicator"
                aria-label={`Start ${name}`}
            >
                <PlayIcon /> Start
            </button>
        )}
    </td>
);

/**
 * One exchange in the orchestrator table. The visual state is carried by both a
 * badge (status text) and the action button, so colour is never the only cue.
 * Every dynamic cell carries a stable id; the socket OOB-swaps them in place,
 * so row buttons keep focus across pushes.
 */
export const ExchangeWorkerRow = ({
    exchange,
    started,
    supported,
    waiting,
    workerCount,
    symbolCount,
    states,
    expectedWorkers,
    workers,
}: Props) => {
    return (
        <tr id={`worker-row-${exchange.slug}`}>
            <td>
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
                        <div class="truncate font-mono text-sm opacity-60" safe>
                            {exchange.slug}
                        </div>
                    </div>
                </div>
            </td>
            <td class="hidden md:table-cell">
                <span class="badge badge-outline font-mono uppercase" safe>
                    {exchange.baseCurrency}
                </span>
            </td>
            <WorkerStatusCell
                slug={exchange.slug}
                started={started}
                supported={supported}
                waiting={waiting}
            />
            <WorkerHealthCell
                slug={exchange.slug}
                states={states}
                workers={workers}
            />
            <WorkerCountsCell
                slug={exchange.slug}
                workerCount={workerCount}
                expectedWorkers={expectedWorkers}
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
