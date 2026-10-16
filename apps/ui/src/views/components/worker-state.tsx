/**
 * How the UI names each worker state. Socket states come from the worker's own
 * `state` messages; `exited` is the process/thread dying, reported by the pool.
 * `reconnected` folds into "open"; a worker that hasn't reported yet is
 * "unknown". Colour is redundant — the label carries the meaning, and every
 * health badge prints the count next to the state name.
 */
export const WORKER_STATE_VIEW: Record<
    string,
    { label: string; className: string }
> = {
    connected: { label: "open", className: "badge-success" },
    reconnecting: { label: "reconnecting", className: "badge-warning" },
    error: { label: "errored", className: "badge-error" },
    exited: { label: "exited", className: "badge-neutral" },
    closed: { label: "closed", className: "badge-outline" },
    disconnected: { label: "disconnected", className: "badge-ghost" },
    unknown: { label: "unknown", className: "badge-ghost" },
};

export const WORKER_STATE_ORDER = [
    "connected",
    "reconnecting",
    "error",
    "exited",
    "closed",
    "disconnected",
    "unknown",
] as const;

export type WorkerStateCounts = Record<string, number>;

/** One live worker as shown under its exchange. */
export type WorkerDetail = {
    id: string;
    state?: string;
    symbolCount: number;
};

export function normalizeState(state: string | undefined): string {
    if (state === undefined) return "unknown";
    if (state === "reconnected") return "connected";
    return state;
}

/** Human label for a raw (or missing) worker state. */
export function workerStateLabel(state: string | undefined): string {
    const normalized = normalizeState(state);
    return WORKER_STATE_VIEW[normalized]?.label ?? normalized;
}

export function countWorkerStates(
    workers: Array<{ state?: string }>,
): WorkerStateCounts {
    const counts: WorkerStateCounts = Object.fromEntries(
        WORKER_STATE_ORDER.map((state) => [state, 0]),
    );
    for (const worker of workers) {
        const key = normalizeState(worker.state);
        counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
}

/**
 * The per-row health cell. Every badge carries the state name and its count, so
 * colour is never the only cue. Below the badges, each of this exchange's own
 * workers is listed with its id, normalized state and symbol count. An exchange
 * with no workers says so in words.
 */
export const WorkerHealthCell = ({
    slug,
    states,
    workers,
}: {
    slug: string;
    states: WorkerStateCounts;
    workers: WorkerDetail[];
}) => (
    <td id={`worker-health-${slug}`} class="hidden sm:table-cell">
        <WorkerStateBadges states={states} />
        {workers.length > 0 ? (
            <ul class="mt-1 space-y-0.5 font-mono text-[0.625rem] opacity-70">
                {workers.map((worker) => (
                    <li
                        class="truncate"
                        safe
                        title={`${worker.id} is ${workerStateLabel(worker.state)} with ${worker.symbolCount} coins`}
                    >
                        {`${worker.id} · ${workerStateLabel(worker.state)} · ${worker.symbolCount}`}
                    </li>
                ))}
            </ul>
        ) : null}
    </td>
);

/** Compact health strip: one count+label badge per state present. */
export const WorkerStateBadges = ({
    states,
}: {
    states: WorkerStateCounts;
}) => {
    const visible = WORKER_STATE_ORDER.filter(
        (state) => (states[state] ?? 0) > 0,
    );

    if (visible.length === 0) {
        return <span class="text-xs opacity-60">No live workers</span>;
    }

    return (
        <div class="flex flex-wrap items-center gap-1">
            {visible.map((state) => {
                const view = WORKER_STATE_VIEW[state]!;
                const count = states[state] ?? 0;
                return (
                    <span
                        class={`badge badge-sm gap-1 whitespace-nowrap tabular-nums ${view.className}`}
                        safe
                    >
                        {`${count} ${view.label}`}
                    </span>
                );
            })}
        </div>
    );
};
