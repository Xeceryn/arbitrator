import type { ChainLinkWithChain } from "@arbitrator/lister/types";

import { AssignChainDropdown } from "./AssignChainDropdown";
import { XIcon } from "./icons";

type RowProps = {
  coinId: number;
  marketId: number;
  link: ChainLinkWithChain;
};

const ChainLinkRow = ({ coinId, marketId, link }: RowProps) => (
  <li id={`chain-link-${link.id}`} class="list-row items-start gap-2 px-2">
    {/* `list-col-grow` makes this the single growing column; the toggle
        controls live inside it so they wrap instead of overflowing. */}
    <div class="min-w-0 list-col-grow">
      <div class="truncate font-medium" safe>
        {link.chain.name}
      </div>
      <div class="truncate text-xs font-mono uppercase opacity-60" safe>
        {link.chain.code}
      </div>

      <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
        <label class="label w-fit cursor-pointer gap-2" title="Deposit enabled">
          <span class="label-text">Deposit</span>
          <input
            type="checkbox"
            class="toggle toggle-xs"
            checked={link.depositEnabled}
            hx-patch={`/coins/${coinId}/assignments/${marketId}/chains/${link.id}`}
            hx-trigger="change"
            hx-vals="js:{ depositEnabled: event.target.checked }"
            hx-swap="none"
            hx-indicator="#coin-assignment-indicator"
            hx-on:toggle-error="this.checked = event.detail.depositEnabled"
          />
        </label>

        <label
          class="label w-fit cursor-pointer gap-2"
          title="Withdraw enabled"
        >
          <span class="label-text">Withdraw</span>
          <input
            type="checkbox"
            class="toggle toggle-xs"
            checked={link.withdrawEnabled}
            hx-patch={`/coins/${coinId}/assignments/${marketId}/chains/${link.id}`}
            hx-trigger="change"
            hx-vals="js:{ withdrawEnabled: event.target.checked }"
            hx-swap="none"
            hx-indicator="#coin-assignment-indicator"
            hx-on:toggle-error="this.checked = event.detail.withdrawEnabled"
          />
        </label>
      </div>
    </div>

    <button
      type="button"
      class="btn btn-square btn-ghost btn-xs btn-error"
      aria-label={`Unassign ${link.chain.name}`}
      title={`Unassign ${link.chain.name}`}
      hx-delete={`/coins/${coinId}/assignments/${marketId}/chains/${link.id}`}
      hx-confirm={`Unassign ${link.chain.name}?`}
      hx-target={`#market-chains-${marketId}`}
      hx-swap="innerHTML"
      hx-indicator="#coin-assignment-indicator"
    >
      <XIcon />
    </button>
  </li>
);

type Props = {
  coinId: number;
  marketId: number;
  links: ChainLinkWithChain[];
};

/**
 * The lazily loaded chain assignments for one market, rendered inside the
 * exchange card. Same shape as the exchange panel: assign/search on top, list
 * below, grouped with space.
 */
export const MarketChains = ({ coinId, marketId, links }: Props) => (
  <div class="flex flex-col gap-4">
    <section class="rounded-box bg-base-200 p-4">
      <h4 class="mb-3 text-xs font-semibold tracking-wide uppercase opacity-60">
        Assign chain
      </h4>
      <AssignChainDropdown coinId={coinId} marketId={marketId} />
    </section>

    <section class="rounded-box bg-base-300/40 p-4">
      <h4 class="text-xs font-semibold tracking-wide uppercase opacity-60">
        Assigned chains
      </h4>
      {links.length === 0 ? (
        <p class="text-sm opacity-60">No chains assigned.</p>
      ) : (
        <ul class="list">
          {links.map((link) => (
            <ChainLinkRow coinId={coinId} marketId={marketId} link={link} />
          ))}
        </ul>
      )}
    </section>
  </div>
);
