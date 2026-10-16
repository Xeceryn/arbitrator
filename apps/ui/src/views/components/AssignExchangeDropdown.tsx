import type {
    ExchangeSelect,
    PaginatedExchangeList,
} from "@arbitrator/lister/types";

/** Complete, current-state candidate URL. Every page control owns its URL. */
function candidatePageUrl(coinId: number, search: string, page: number): string {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", String(page));
    return `/coins/${coinId}/available-exchanges?${params.toString()}`;
}

export const AvailableExchangeRow = ({
    coinId,
    exchange,
}: {
    coinId: number;
    exchange: ExchangeSelect;
}) => (
    <li id={`available-exchange-${exchange.id}`}>
        <button
            type="button"
            class="flex items-center justify-between gap-2"
            aria-label={`Select ${exchange.name}`}
            hx-get={`/coins/${coinId}/assignments/select?exchangeId=${exchange.id}`}
            hx-target="#assignment-staging"
            hx-swap="innerHTML"
            hx-indicator="#coin-assignment-indicator"
        >
            <span class="flex min-w-0 items-center gap-2">
                <span class="avatar">
                    <span class="mask mask-circle size-6">
                        <img src={exchange.logo} alt="" loading="lazy" />
                    </span>
                </span>
                <span class="truncate">{exchange.name}</span>
            </span>
            <span class="flex items-center gap-2">
                <span class="badge badge-ghost badge-sm font-mono">
                    {exchange.slug}
                </span>
                <span class="text-xs font-medium text-primary">Select</span>
            </span>
        </button>
    </li>
);

type AvailableProps = {
    coinId: number;
    data: PaginatedExchangeList;
};

/**
 * Search results for the exchange picker. Selecting a candidate only moves to
 * step 2; assigning is a separate, deliberate request.
 */
export const AvailableExchanges = ({ coinId, data }: AvailableProps) => {
    const search = data.meta.search;

    return (
        <div>
            {data.data.length === 0 ? (
                <div class="rounded-box border border-base-300 bg-base-100 px-3 py-4 text-center">
                    {search ? (
                        <>
                            <p class="text-sm opacity-70">
                                No exchanges match <span class="font-medium">{search}</span>
                                .
                            </p>
                            <button
                                type="button"
                                class="btn btn-ghost btn-xs mt-2"
                                hx-get={`/coins/${coinId}/available-exchanges`}
                                hx-target="#available-exchanges"
                                hx-swap="innerHTML"
                                hx-sync="#available-exchanges:replace"
                                hx-indicator="#exchange-search-indicator"
                            >
                                Clear search
                            </button>
                        </>
                    ) : (
                        <p class="text-sm opacity-70">
                            Every exchange is already assigned to this coin.
                        </p>
                    )}
                </div>
            ) : (
                <ul class="menu w-full rounded-field border border-base-300 bg-base-100 p-1 shadow-sm">
                    {data.data.map((exchange) => (
                        <AvailableExchangeRow
                            coinId={coinId}
                            exchange={exchange}
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
                        aria-label="Previous page of exchanges"
                        hx-get={candidatePageUrl(
                            coinId,
                            search,
                            data.meta.page - 1,
                        )}
                        hx-target="#available-exchanges"
                        hx-swap="innerHTML"
                        hx-sync="#available-exchanges:replace"
                        hx-indicator="#exchange-search-indicator"
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
                        aria-label="Next page of exchanges"
                        hx-get={candidatePageUrl(
                            coinId,
                            search,
                            data.meta.page + 1,
                        )}
                        hx-target="#available-exchanges"
                        hx-swap="innerHTML"
                        hx-sync="#available-exchanges:replace"
                        hx-indicator="#exchange-search-indicator"
                    >
                        Next
                    </button>
                </div>
            ) : null}
        </div>
    );
};
