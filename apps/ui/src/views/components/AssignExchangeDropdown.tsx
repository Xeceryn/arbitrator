import type { PaginatedExchangeList } from "@arbitrator/lister/types";

import { SearchIcon } from "./icons";

type AvailableProps = {
  coinId: number;
  data: PaginatedExchangeList;
};

/**
 * Search results for the exchange picker. Rendered inside the assignment
 * form, so the pagination buttons submit that form (carrying `search`).
 */
export const AvailableExchanges = ({ coinId, data }: AvailableProps) => (
  <div class="mt-1">
    {data.data.length === 0 ? (
      <p class="px-2 py-3 text-sm opacity-60">All exchanges assigned!</p>
    ) : (
      <ul class="menu w-full rounded-field border border-base-300 bg-base-100 p-1 shadow-sm">
        {data.data.map((exchange) => (
          <li>
            <button
              type="button"
              class="flex items-center justify-between gap-2"
              hx-post={`/coins/${coinId}/assignments`}
              hx-vals={JSON.stringify({ exchangeId: exchange.id })}
              hx-target="#coin-assignment-list"
              hx-swap="outerMorph"
              hx-indicator="#coin-assignment-indicator"
              hx-on:assign-exchange-success="document.getElementById('exchange-search').value = ''; document.getElementById('available-exchanges').innerHTML = '';"
            >
              <span class="flex min-w-0 items-center gap-2">
                <span class="avatar">
                  <span class="mask mask-circle size-6">
                    <img src={exchange.logo} alt="" loading="lazy" />
                  </span>
                </span>
                <span class="truncate" safe>
                  {exchange.name}
                </span>
              </span>
              <span class="badge badge-ghost badge-sm font-mono" safe>
                {exchange.slug}
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
 * Searchable, paginated exchange picker (5 per page, by name). Assigned
 * exchanges are excluded by the server.
 */
export const AssignExchangeDropdown = ({ coinId }: { coinId: number }) => (
  <form
    class="flex flex-col"
    hx-get={`/coins/${coinId}/available-exchanges`}
    hx-target="#available-exchanges"
    hx-swap="innerHTML"
    hx-trigger="load, submit, input delay:300ms"
  >
    <label class="input input-bordered w-full">
      <span class="sr-only">Search exchanges</span>
      <SearchIcon />
      <input
        id="exchange-search"
        type="search"
        name="search"
        placeholder="Search exchange"
        autocomplete="off"
      />
    </label>
    <div id="available-exchanges"></div>
  </form>
);
