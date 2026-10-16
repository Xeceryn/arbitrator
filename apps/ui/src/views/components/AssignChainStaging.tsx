import type { ChainSelect } from "@arbitrator/lister/types";

import { SearchIcon } from "./icons";

/**
 * Step 1 of the staged chain flow inside one expanded market card. Mirrors the
 * exchange picker with per-market ids so several markets can stage at once.
 */
export const ChainPicker = ({
    coinId,
    marketId,
}: {
    coinId: number;
    marketId: number;
}) => (
    <div id={`market-chain-picker-${marketId}`}>
        <div class="mb-2 flex items-center justify-between gap-2">
            <h4 class="text-xs font-semibold">Choose a chain</h4>
            <button
                type="button"
                class="btn btn-ghost btn-xs"
                hx-on:click={`this.closest('#market-chain-staging-${marketId}').replaceChildren(); document.getElementById('add-chain-button-${marketId}')?.setAttribute('aria-expanded','false')`}
            >
                Cancel
            </button>
        </div>

        <form
            class="flex flex-col"
            hx-get={`/coins/${coinId}/assignments/${marketId}/available-chains`}
            hx-target={`#available-chains-${marketId}`}
            hx-swap="innerHTML"
            hx-trigger="submit"
            hx-sync={`#available-chains-${marketId}:replace`}
            hx-indicator={`#chain-search-indicator-${marketId}`}
        >
            <label class="input input-bordered input-sm w-full">
                <span class="sr-only">Search chains</span>
                <SearchIcon />
                <input
                    id={`chain-search-${marketId}`}
                    type="search"
                    name="search"
                    placeholder="Search chain"
                    autocomplete="off"
                    hx-get={`/coins/${coinId}/assignments/${marketId}/available-chains`}
                    hx-target={`#available-chains-${marketId}`}
                    hx-swap="innerHTML"
                    hx-trigger="input changed delay:300ms, search"
                    hx-include="closest form"
                    hx-sync={`#available-chains-${marketId}:replace`}
                    hx-indicator={`#chain-search-indicator-${marketId}`}
                />
            </label>
            <span
                id={`chain-search-indicator-${marketId}`}
                class="htmx-indicator loading loading-spinner loading-xs"
            ></span>
            <button type="submit" class="btn btn-primary btn-xs mt-2 w-fit">
                Search
            </button>
        </form>

        <div
            id={`available-chains-${marketId}`}
            role="status"
            aria-live="polite"
            class="mt-2 flex flex-col"
        ></div>
    </div>
);

/** Inline validation message for the chain confirm step. */
export const ChainError = ({ message }: { message: string }) => (
    <p class="text-sm text-error">{message}</p>
);

/**
 * Step 2 of the chain flow. Like the exchange confirm card, the root
 * re-requests step 1 after `assignment-chain-added` bubbles from the assign
 * request, resetting the staging region from server markup alone.
 */
export const ChainConfirmCard = ({
    coinId,
    marketId,
    chain,
}: {
    coinId: number;
    marketId: number;
    chain: ChainSelect;
}) => (
    <div
        id={`market-chain-confirm-${marketId}`}
        hx-trigger={`assignment-chain-added[detail.marketId === ${marketId}] from:body`}
        hx-get={`/coins/${coinId}/assignments/${marketId}/chains/new`}
        hx-target={`#market-chain-staging-${marketId}`}
        hx-swap="innerHTML"
        hx-indicator="#coin-assignment-indicator"
    >
        <h4 class="text-xs font-semibold">Confirm chain</h4>
        <p class="mt-1 text-sm opacity-70">
            Assign <span class="font-medium">{chain.name}</span> (
            <span class="font-mono uppercase">{chain.code}</span>) to this
            market?
        </p>

        <div
            id={`market-chain-error-${marketId}`}
            role="alert"
            class="mt-2"
        ></div>

        <form
            class="mt-3 flex flex-wrap gap-2"
            hx-post={`/coins/${coinId}/assignments/${marketId}/chains`}
            hx-target={`#market-chains-list-${marketId}`}
            hx-swap="beforeend"
            hx-indicator="#coin-assignment-indicator"
            {...{
                "hx-status:422": `target:#market-chain-error-${marketId} swap:innerHTML`,
            }}
            {...{ "hx-status:5xx": "swap:none" }}
        >
            <input type="hidden" name="chainId" value={String(chain.id)} />
            <button type="submit" class="btn btn-primary btn-xs">
                Assign chain
            </button>
            <button
                type="button"
                class="btn btn-ghost btn-xs"
                hx-get={`/coins/${coinId}/assignments/${marketId}/chains/new`}
                hx-target={`#market-chain-staging-${marketId}`}
                hx-swap="innerHTML"
                hx-indicator="#coin-assignment-indicator"
            >
                Choose another chain
            </button>
        </form>
    </div>
);
