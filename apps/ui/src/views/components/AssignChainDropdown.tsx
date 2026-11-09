import type { ChainSelect, PaginatedChainList } from "@arbitrator/lister/types";

import { ArrowRightIcon } from "./icons";

/** Complete, current-state candidate URL. Every page control owns its URL. */
function candidatePageUrl(
    coinId: number,
    marketId: number,
    search: string,
    page: number,
): string {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    return `/coins/${coinId}/assignments/${marketId}/available-chains?${params.toString()}`;
}

export const AvailableChainRow = ({
    coinId,
    marketId,
    chain,
}: {
    coinId: number;
    marketId: number;
    chain: ChainSelect;
}) => (
    <li id={`available-chain-${marketId}-${chain.id}`}>
        <button
            type="button"
            class="flex min-h-16 items-center justify-between gap-3 rounded-field bg-base-200 px-3 py-3 hover:bg-base-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={`Select ${chain.name}`}
            hx-get={`/coins/${coinId}/assignments/${marketId}/chains/select?chainId=${chain.id}`}
            hx-target={`#market-chain-staging-${marketId}`}
            hx-swap="innerHTML"
            hx-indicator={`#market-chain-staging-${marketId}-indicator`}
        >
            <span class="min-w-0 text-left">
                <span class="block break-words font-medium">{chain.name}</span>
                <span class="block break-all font-mono text-xs uppercase text-base-content/80">
                    {chain.code}
                </span>
            </span>
            <span class="flex shrink-0 items-center gap-2 text-sm font-medium">
                Select <ArrowRightIcon />
            </span>
        </button>
    </li>
);

type AvailableProps = {
    coinId: number;
    marketId: number;
    data: PaginatedChainList;
};

/**
 * Search results for the chain picker. Selecting a candidate only moves to
 * step 2; assigning is a separate request.
 */
export const AvailableChains = ({ coinId, marketId, data }: AvailableProps) => {
    const search = data.meta.search;

    return (
        <div>
            {data.data.length === 0 ? (
                <div class="rounded-box border border-base-300 bg-base-100 px-3 py-3 text-center">
                    {search ? (
                        <>
                            <p class="text-sm opacity-70">
                                No chains match{" "}
                                <span class="font-medium">{search}</span>.
                            </p>
                            <button
                                type="button"
                                class="btn btn-sm min-h-11 mt-3"
                                hx-get={`/coins/${coinId}/assignments/${marketId}/available-chains`}
                                hx-target={`#available-chains-${marketId}`}
                                hx-swap="innerHTML"
                                hx-sync={`#available-chains-${marketId}:replace`}
                                hx-indicator={`#chain-search-indicator-${marketId}`}
                                hx-on:click={`const i=document.getElementById('chain-search-${marketId}');i.value='';i.focus()`}
                            >
                                Clear search
                            </button>
                        </>
                    ) : (
                        <p class="text-sm opacity-70">
                            Every chain is already assigned to this market.
                        </p>
                    )}
                </div>
            ) : (
                <ul class="menu w-full gap-2 p-0">
                    {data.data.map((chain) => (
                        <AvailableChainRow
                            coinId={coinId}
                            marketId={marketId}
                            chain={chain}
                        />
                    ))}
                </ul>
            )}

            {data.meta.pages > 1 ? (
                <div class="mt-4 flex items-center justify-between gap-2">
                    <button
                        type="button"
                        class="btn btn-sm min-h-11"
                        disabled={!data.meta.hasPreviousPage}
                        aria-label="Previous page of chains"
                        hx-get={candidatePageUrl(
                            coinId,
                            marketId,
                            search,
                            data.meta.page - 1,
                        )}
                        hx-target={`#available-chains-${marketId}`}
                        hx-swap="innerHTML"
                        hx-sync={`#available-chains-${marketId}:replace`}
                        hx-indicator={`#chain-search-indicator-${marketId}`}
                    >
                        Previous
                    </button>
                    <span class="text-xs text-base-content/80">
                        Page {data.meta.page} of {data.meta.pages}
                    </span>
                    <button
                        type="button"
                        class="btn btn-sm min-h-11"
                        disabled={!data.meta.hasNextPage}
                        aria-label="Next page of chains"
                        hx-get={candidatePageUrl(
                            coinId,
                            marketId,
                            search,
                            data.meta.page + 1,
                        )}
                        hx-target={`#available-chains-${marketId}`}
                        hx-swap="innerHTML"
                        hx-sync={`#available-chains-${marketId}:replace`}
                        hx-indicator={`#chain-search-indicator-${marketId}`}
                    >
                        Next
                    </button>
                </div>
            ) : null}
        </div>
    );
};
