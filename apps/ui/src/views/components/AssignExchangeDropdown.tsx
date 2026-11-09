import type {
    ExchangeSelect,
    PaginatedExchangeList,
} from "@arbitrator/lister/types";

import { ArrowRightIcon } from "./icons";

/** Complete, current-state candidate URL. Every page control owns its URL. */
function candidatePageUrl(
    coinId: number,
    search: string,
    page: number,
): string {
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
            class="flex min-h-16 items-center justify-between gap-3 rounded-field bg-base-200 px-3 py-3 hover:bg-base-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label={`Select ${exchange.name}`}
            hx-get={`/coins/${coinId}/assignments/select?exchangeId=${exchange.id}`}
            hx-target="#assignment-staging"
            hx-swap="innerHTML"
            hx-indicator="#assignment-staging-indicator"
        >
            <span class="flex min-w-0 items-center gap-3">
                <img
                    src={exchange.logo}
                    alt=""
                    class="size-8 shrink-0 rounded-full object-contain"
                    loading="lazy"
                />
                <span class="min-w-0 text-left">
                    <span class="block break-words font-medium">
                        {exchange.name}
                    </span>
                    <span class="block break-all text-xs text-base-content/80">
                        {exchange.slug}
                    </span>
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
                                No exchanges match{" "}
                                <span class="font-medium">{search}</span>.
                            </p>
                            <button
                                type="button"
                                class="btn btn-sm min-h-11 mt-3"
                                hx-get={`/coins/${coinId}/available-exchanges`}
                                hx-target="#available-exchanges"
                                hx-swap="innerHTML"
                                hx-sync="#available-exchanges:replace"
                                hx-indicator="#exchange-search-indicator"
                                hx-on:click="const i=document.getElementById('exchange-search');i.value='';i.focus()"
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
                <ul class="menu w-full gap-2 p-0">
                    {data.data.map((exchange) => (
                        <AvailableExchangeRow
                            coinId={coinId}
                            exchange={exchange}
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
                    <span class="text-xs text-base-content/80">
                        Page {data.meta.page} of {data.meta.pages}
                    </span>
                    <button
                        type="button"
                        class="btn btn-sm min-h-11"
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
