import type { ChainLinkWithChain } from "@arbitrator/lister/types";

import { AssignmentToggle } from "./AssignmentToggle";
import { PlusIcon } from "./icons";

/** A chain link is independent from the chain record it refers to. */
export const ChainLinkRow = ({
    coinId,
    marketId,
    link,
}: {
    coinId: number;
    marketId: number;
    link: ChainLinkWithChain;
}) => (
    <li
        id={`chain-link-${link.id}`}
        class="list-row grid grid-cols-[minmax(0,1fr)_auto] gap-3 px-0 py-4 md:grid-cols-[minmax(0,1fr)_auto_auto] md:items-center md:gap-5"
    >
        <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span class="break-words font-medium">{link.chain.name}</span>
                <span class="break-all font-mono text-xs uppercase text-base-content/80">
                    {link.chain.code}
                </span>
                {link.chain.code.toUpperCase() === "UNMPD" ? (
                    <span class="badge badge-warning badge-sm">Unmapped</span>
                ) : null}
            </div>
        </div>
        <div class="col-span-2 row-start-2 grid grid-cols-2 gap-3 md:col-span-1 md:col-start-2 md:row-start-1">
            <AssignmentToggle
                label="Deposit"
                name={`Deposits on ${link.chain.name}`}
                enabled={link.depositEnabled}
                url={`/coins/${coinId}/assignments/${marketId}/chains/${link.id}`}
                field="depositEnabled"
            />
            <AssignmentToggle
                label="Withdraw"
                name={`Withdrawals on ${link.chain.name}`}
                enabled={link.withdrawEnabled}
                url={`/coins/${coinId}/assignments/${marketId}/chains/${link.id}`}
                field="withdrawEnabled"
            />
        </div>
        <button
            type="button"
            class="btn btn-ghost btn-sm col-start-2 row-start-1 min-h-11 md:col-start-3"
            aria-label={`Remove ${link.chain.name} assignment`}
            hx-delete={`/coins/${coinId}/assignments/${marketId}/chains/${link.id}`}
            hx-confirm={`This removes ${link.chain.name} from this exchange assignment. The chain is kept, and its other assignments are unchanged.`}
            data-confirm-title={`Remove ${link.chain.name}?`}
            data-confirm-label="Remove chain"
            hx-target={`#chain-link-${link.id}`}
            hx-swap="delete"
            data-hx-disable="this"
            hx-indicator="#coin-assignment-indicator"
            {...{ "hx-status:5xx": "swap:none" }}
        >
            Remove
        </button>
    </li>
);

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
        class="py-4 text-sm text-base-content/70"
    >
        No chains assigned.
    </div>
);

export const MarketChains = ({
    coinId,
    marketId,
    links,
}: {
    coinId: number;
    marketId: number;
    links: ChainLinkWithChain[];
}) => (
    <div class="flex flex-col gap-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="text-sm text-base-content/80">
                Changes save immediately.
            </p>
            <button
                type="button"
                id={`add-chain-button-${marketId}`}
                class="btn btn-sm min-h-11 w-fit"
                aria-expanded="false"
                aria-haspopup="dialog"
                aria-controls={`assign-chain-dialog-${marketId}`}
                data-open-dialog={`assign-chain-dialog-${marketId}`}
                hx-get={`/coins/${coinId}/assignments/${marketId}/chains/new`}
                hx-target={`#market-chain-staging-${marketId}`}
                hx-swap="innerHTML"
                hx-indicator={`#market-chain-staging-${marketId}-indicator`}
            >
                <PlusIcon /> Add chain
            </button>
        </div>
        <ul
            id={`market-chains-list-${marketId}`}
            class="list divide-y divide-base-300"
        >
            {links.map((link) => (
                <ChainLinkRow coinId={coinId} marketId={marketId} link={link} />
            ))}
        </ul>
        <MarketChainEmpty marketId={marketId} hidden={links.length > 0} />
    </div>
);
