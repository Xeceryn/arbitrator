import type { ChainSelect, PaginatedChainList } from "@arbitrator/lister/types";

import { AvailableChains } from "./AssignChainDropdown";
import { SearchIcon } from "./icons";

/**
 * Step 1 inside an exchange's assignment dialog, using per-market region ids.
 */
export const ChainPicker = ({
    coinId,
    marketId,
    data,
}: {
    coinId: number;
    marketId: number;
    data: PaginatedChainList;
}) => (
    <div id={`market-chain-picker-${marketId}`}>
        <h3 class="mb-3 text-base font-semibold">Choose a chain</h3>

        <form
            class="flex flex-col"
            hx-get={`/coins/${coinId}/assignments/${marketId}/available-chains`}
            hx-target={`#available-chains-${marketId}`}
            hx-swap="innerHTML"
            hx-trigger="submit, input delay:300ms, search"
            hx-sync={`#available-chains-${marketId}:replace`}
            hx-indicator={`#chain-search-indicator-${marketId}`}
        >
            <label class="input min-h-11 w-full bg-base-100">
                <span class="sr-only">Search chains</span>
                <SearchIcon />
                <input
                    id={`chain-search-${marketId}`}
                    type="search"
                    name="search"
                    class="min-w-0 placeholder:text-base-content/70 placeholder:opacity-100 focus:border-transparent focus:ring-0 focus:outline-none"
                    placeholder="Search chains"
                    autocomplete="off"
                    data-autofocus
                />
                <span
                    id={`chain-search-indicator-${marketId}`}
                    class="htmx-indicator loading loading-spinner loading-xs"
                ></span>
            </label>
        </form>

        <div
            id={`available-chains-${marketId}`}
            role="status"
            aria-live="polite"
            class="mt-4 flex flex-col"
        >
            <AvailableChains coinId={coinId} marketId={marketId} data={data} />
        </div>
        <div class="mt-5 flex justify-end border-t border-base-300 pt-4">
            <button
                type="button"
                class="btn min-h-11"
                hx-on:click="this.closest('dialog').close()"
            >
                Cancel
            </button>
        </div>
    </div>
);

/** Inline validation message for the chain confirm step. */
export const ChainError = ({ message }: { message: string }) => (
    <p class="text-sm text-error">{message}</p>
);

/**
 * Step 2 closes the dialog only when the chain has actually been assigned.
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
        hx-on:assignment-chain-added="this.closest('dialog').close()"
    >
        <h3 class="break-words text-base font-semibold">Add {chain.name}?</h3>
        <p class="mt-1 break-all font-mono text-sm uppercase text-base-content/80">
            {chain.code}
        </p>

        <div
            id={`market-chain-error-${marketId}`}
            role="alert"
            class="mt-2"
        ></div>

        <form
            class="mt-5 flex flex-col gap-4"
            hx-post={`/coins/${coinId}/assignments/${marketId}/chains`}
            hx-target={`#market-chains-list-${marketId}`}
            hx-swap="beforeend"
            hx-indicator={`#market-chain-staging-${marketId}-indicator`}
            data-hx-disable="find button[type=submit]"
            {...{
                "hx-status:422": `target:#market-chain-error-${marketId} swap:innerHTML`,
            }}
            {...{ "hx-status:5xx": "swap:none" }}
        >
            <input type="hidden" name="chainId" value={String(chain.id)} />
            <button
                type="button"
                class="btn btn-sm min-h-11 w-fit"
                hx-get={`/coins/${coinId}/assignments/${marketId}/chains/new`}
                hx-target={`#market-chain-staging-${marketId}`}
                hx-swap="innerHTML"
                hx-indicator={`#market-chain-staging-${marketId}-indicator`}
            >
                Change chain
            </button>
            <div class="flex flex-wrap justify-end gap-2 border-t border-base-300 pt-4">
                <button
                    type="button"
                    class="btn min-h-11"
                    hx-on:click="this.closest('dialog').close()"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    class="btn btn-primary min-h-11"
                    data-autofocus
                >
                    Add chain
                </button>
            </div>
        </form>
    </div>
);
