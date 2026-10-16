import type {
    ChainSelect,
    PaginatedChainList,
} from "@arbitrator/lister/types";

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
            class="flex items-center justify-between gap-2"
            aria-label={`Select ${chain.name}`}
            hx-get={`/coins/${coinId}/assignments/${marketId}/chains/select?chainId=${chain.id}`}
            hx-target={`#market-chain-staging-${marketId}`}
            hx-swap="innerHTML"
            hx-indicator="#coin-assignment-indicator"
        >
            <span class="truncate">{chain.name}</span>
            <span class="flex items-center gap-2">
                <span class="badge badge-ghost badge-sm font-mono uppercase">
                    {chain.code}
                </span>
                <span class="text-xs font-medium text-primary">Select</span>
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
export const AvailableChains = ({
    coinId,
    marketId,
    data,
}: AvailableProps) => {
    const search = data.meta.search;

    return (
        <div>
            {data.data.length === 0 ? (
                <div class="rounded-box border border-base-300 bg-base-100 px-3 py-3 text-center">
                    {search ? (
                        <>
                            <p class="text-sm opacity-70">
                                No chains match <span class="font-medium">{search}</span>
                                .
                            </p>
                            <button
                                type="button"
                                class="btn btn-ghost btn-xs mt-2"
                                hx-get={`/coins/${coinId}/assignments/${marketId}/available-chains`}
                                hx-target={`#available-chains-${marketId}`}
                                hx-swap="innerHTML"
                                hx-sync={`#available-chains-${marketId}:replace`}
                                hx-indicator={`#chain-search-indicator-${marketId}`}
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
                <ul class="menu w-full rounded-field border border-base-300 bg-base-100 p-1 shadow-sm">
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
                <div class="mt-2 flex items-center justify-between gap-2">
                    <button
                        type="button"
                        class="btn btn-xs"
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
                    <span class="text-xs opacity-60">
                        Page {data.meta.page} of {data.meta.pages}
                    </span>
                    <button
                        type="button"
                        class="btn btn-xs"
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
