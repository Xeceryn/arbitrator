import type { PaginatedChainList } from "@arbitrator/lister/types";

import { SearchIcon } from "./icons";

type Props = {
  coinId: number;
  marketId: number;
};

type AvailableProps = {
  coinId: number;
  marketId: number;
  data: PaginatedChainList;
};

/**
 * Search results for the chain picker. Rendered inside the market's chain
 * form, so the pagination buttons submit that form (carrying `search`).
 */
export const AvailableChains = ({ coinId, marketId, data }: AvailableProps) => (
  <div class="mt-1">
    {data.data.length === 0 ? (
      <p class="px-2 py-2 text-sm opacity-60">No chains found.</p>
    ) : (
      <ul class="menu w-full rounded-field border border-base-300 bg-base-100 p-1 shadow-sm">
        {data.data.map((chain) => (
          <li>
            <button
              type="button"
              class="flex items-center justify-between gap-2"
              hx-post={`/coins/${coinId}/assignments/${marketId}/chains`}
              hx-vals={JSON.stringify({ chainId: chain.id })}
              hx-target={`#market-chains-${marketId}`}
              hx-swap="innerHTML"
              hx-indicator="#coin-assignment-indicator"
            >
              <span class="truncate" safe>
                {chain.name}
              </span>
              <span class="badge badge-ghost badge-sm font-mono" safe>
                {chain.code}
              </span>
            </button>
          </li>
        ))}
      </ul>
    )}

    {data.meta.pages > 1 ? (
      <div class="join mt-1 flex justify-center">
        {Array.from({ length: data.meta.pages }, (_, index) => index + 1).map(
          (page) => (
            <button
              type="submit"
              name="page"
              value={page.toString()}
              class={`join-item btn btn-xs ${page === data.meta.page ? "btn-active" : ""}`}
            >
              {page}
            </button>
          ),
        )}
      </div>
    ) : null}
  </div>
);

/**
 * Searchable, paginated chain picker (5 per page, by name). The `load` trigger
 * fills it the moment the chain panel is swapped in.
 */
export const AssignChainDropdown = ({ coinId, marketId }: Props) => (
  <form
    class="flex flex-col"
    hx-get={`/coins/${coinId}/assignments/${marketId}/available-chains`}
    hx-target={`#available-chains-${marketId}`}
    hx-swap="innerHTML"
    hx-trigger="load, submit, input changed delay:300ms"
    hx-indicator={`#available-chains-indicator-${marketId}`}
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
      />
    </label>
    <span
      id={`available-chains-indicator-${marketId}`}
      class="htmx-indicator loading loading-spinner loading-xs"
    ></span>
    <div id={`available-chains-${marketId}`}></div>
  </form>
);
