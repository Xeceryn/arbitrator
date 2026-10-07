/**
 * How the UI names each worker state. Socket states come from the worker's own
 * `state` messages; `exited` is the process/thread dying, reported by the pool.
 * `reconnected` folds into "open"; a worker that hasn't reported yet is
 * "unknown". Colour is redundant — the label carries the meaning.
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

export function sumFailures(failures: Record<string, number> = {}): number {
    return Object.values(failures).reduce((total, value) => total + value, 0);
}

/**
 * The per-row health cell. Rendered once in the table and again as an
 * out-of-band swap by the status poll, hence the stable `id`.
 */
export const WorkerHealthCell = ({
    slug,
    states,
    workers,
    oob,
}: {
    slug: string;
    states: WorkerStateCounts;
    workers: WorkerDetail[];
    oob?: boolean;
}) => (
    <td
        id={`worker-health-${slug}`}
        {...(oob ? { "hx-swap-oob": "true" } : {})}
    >
        <WorkerStateBadges states={states} />
        {workers.length > 0 ? (
            <div class="mt-1 flex flex-wrap gap-1 font-mono text-[0.625rem] opacity-70">
                {workers.map((worker) => (
                    <span class="rounded bg-base-200 px-1" title={worker.id}>
                        {(worker.state ?? "?") + "·" + worker.symbolCount}
                    </span>
                ))}
            </div>
        ) : null}
    </td>
);

/** Compact health strip: one badge per non-zero state. */
export const WorkerStateBadges = ({
    states,
}: {
    states: WorkerStateCounts;
}) => {
    const visible = WORKER_STATE_ORDER.filter(
        (state) => (states[state] ?? 0) > 0,
    );

    if (visible.length === 0) {
        return <span class="text-sm opacity-50">—</span>;
    }

    return (
        <div class="flex flex-wrap items-center gap-1">
            {visible.map((state) => {
                const view = WORKER_STATE_VIEW[state]!;
                const count = states[state] ?? 0;
                return (
                    <span
                        class={`badge badge-sm gap-1 whitespace-nowrap ${view.className}`}
                        title={`${count} ${view.label}`}
                    >
                        <span class="font-semibold tabular-nums">{count}</span>
                        <span safe>{view.label}</span>
                    </span>
                );
            })}
        </div>
    );
};
