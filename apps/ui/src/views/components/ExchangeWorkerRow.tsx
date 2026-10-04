import type { ExchangeSelect } from "@arbitrator/lister/types";

import { PlayIcon, StopIcon } from "./icons";

type Props = {
  exchange: ExchangeSelect;
  started: boolean;
  supported: boolean;
  workerCount: number;
  symbolCount: number;
};

/**
 * One exchange in the orchestrator table. The visual state is carried by both a
 * badge (status text) and the action button, so colour is never the only cue.
 */
export const ExchangeWorkerRow = ({
  exchange,
  started,
  supported,
  workerCount,
  symbolCount,
}: Props) => {
  const status = !supported
    ? { label: "No adapter", className: "badge badge-ghost badge-sm" }
    : started
      ? { label: "Running", className: "badge badge-success badge-sm" }
      : {
          label: "Stopped",
          className: "badge badge-outline badge-sm opacity-70",
        };

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
      <td>
        <span class={`${status.className} whitespace-nowrap`} safe>
          {status.label}
        </span>
      </td>
      <td class="hidden text-right tabular-nums sm:table-cell">
        {workerCount}
      </td>
      <td class="hidden text-right tabular-nums sm:table-cell">
        {symbolCount}
      </td>
      <td class="text-right">
        {!supported ? (
          <button
            type="button"
            class="btn btn-outline btn-sm"
            disabled
            title="No worker adapter implemented for this exchange"
            aria-label={`${exchange.name} has no worker adapter`}
          >
            Unsupported
          </button>
        ) : started ? (
          <button
            type="button"
            class="btn btn-outline btn-sm btn-error"
            hx-post={`/workers/${exchange.slug}/stop`}
            hx-target="closest tr"
            hx-swap="outerHTML"
            hx-indicator="#workers-indicator"
            aria-label={`Stop ${exchange.name}`}
          >
            <StopIcon /> Stop
          </button>
        ) : (
          <button
            type="button"
            class="btn btn-outline btn-sm btn-success"
            hx-post={`/workers/${exchange.slug}/start`}
            hx-target="closest tr"
            hx-swap="outerHTML"
            hx-indicator="#workers-indicator"
            aria-label={`Start ${exchange.name}`}
          >
            <PlayIcon /> Start
          </button>
        )}
      </td>
    </tr>
  );
};
