import type { ChainLinkWithChain } from "@arbitrator/lister/types";

import { XIcon } from "./icons";

type RowProps = {
    coinId: number;
    marketId: number;
    link: ChainLinkWithChain;
};

/** One assigned chain. Rendered alone when a new link is added. */
export const ChainLinkRow = ({ coinId, marketId, link }: RowProps) => (
    <li id={`chain-link-${link.id}`} class="list-row items-start gap-2 px-2">
        {/* `list-col-grow` makes this the single growing column; the toggle
        controls live inside it so they wrap instead of overflowing. */}
        <div class="min-w-0 list-col-grow">
            <div class="truncate font-medium">{link.chain.name}</div>
            <div class="truncate text-xs font-mono uppercase opacity-60">
                {link.chain.code}
            </div>

            <div class="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                <label
                    class="label w-fit cursor-pointer gap-2"
                    title="Deposit enabled"
                >
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
                        hx-on:assignment-toggle-error="this.checked = event.detail.depositEnabled"
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
                        hx-on:assignment-toggle-error="this.checked = event.detail.withdrawEnabled"
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
            hx-target={`#chain-link-${link.id}`}
            hx-swap="delete"
            hx-indicator="#coin-assignment-indicator"
        >
            <XIcon />
        </button>
    </li>
);

/** Stable empty state for one market's chain list. */
export const MarketChainEmpty = ({
    marketId,
    hidden,
}: {
    marketId: number;
    hidden: boolean;
}) => (
    <div
        id={`market-chains-empty-${marketId}`}
        hidden={hidden}
        class="rounded-box bg-base-100 px-3 py-4 text-center text-sm opacity-70"
    >
        No chains assigned. Use Add chain to link one.
    </div>
);

type Props = {
    coinId: number;
    marketId: number;
    links: ChainLinkWithChain[];
};

/**
 * The lazily loaded chain assignments for one market, rendered inside the
 * exchange card. Assigning a chain appends one row and updates the empty-state
 * region through partials; nothing here re-renders the exchange list.
 */
export const MarketChains = ({ coinId, marketId, links }: Props) => (
    <div class="flex flex-col gap-4">
        <section class="rounded-box bg-base-200 p-4">
            <div class="flex items-center justify-between gap-2">
                <h4 class="text-xs font-semibold tracking-wide uppercase opacity-60">
                    Assign chain
                </h4>
                <button
                    type="button"
                    id={`add-chain-button-${marketId}`}
                    class="btn btn-ghost btn-xs"
                    aria-expanded="false"
                    aria-controls={`market-chain-staging-${marketId}`}
                    hx-get={`/coins/${coinId}/assignments/${marketId}/chains/new`}
                    hx-target={`#market-chain-staging-${marketId}`}
                    hx-swap="innerHTML"
                    hx-indicator="#coin-assignment-indicator"
                    hx-on:click="this.setAttribute('aria-expanded','true')"
                >
                    Add chain
                </button>
            </div>
            <div id={`market-chain-staging-${marketId}`} class="mt-3"></div>
        </section>

        <section class="rounded-box bg-base-300/40 p-4">
            <h4 class="text-xs font-semibold tracking-wide uppercase opacity-60">
                Assigned chains
            </h4>
            <ul id={`market-chains-list-${marketId}`} class="list mt-1">
                {links.map((link) => (
                    <ChainLinkRow
                        coinId={coinId}
                        marketId={marketId}
                        link={link}
                    />
                ))}
            </ul>
            <MarketChainEmpty marketId={marketId} hidden={links.length > 0} />
        </section>
    </div>
);
