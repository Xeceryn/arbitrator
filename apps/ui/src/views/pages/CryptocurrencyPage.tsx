import { CryptocurrencySearchByOptions } from "@arbitrator/lister/constants";
import type { ListCryptocurrencyInput } from "@arbitrator/lister/types";
import { listerClient } from "@arbitrator/sdk";

import { capitalizeFirstLetter } from "../../utils";
import { CoinTableRow } from "../components/CoinTableRow";
import { CryptocurrencyEditModal } from "../components/CryptocurrencyEditModal";

export const CoinPage = async (props: ListCryptocurrencyInput) => {
  const [error, data] = await listerClient.cryptocurrency.list(props);
  if (error) {
    return (
      <div>
        <div>Failed to fetch coins</div>
        <div safe>{error.message}</div>
      </div>
    );
  }

  const active = CryptocurrencySearchByOptions.find(
    (option) => option === props.searchBy,
  );
  const limit_options = [10, 20, 50, 100];

  return (
    <>
      <main class="flex-1 overflow-y-auto md:pt-4 pt-4 px-12  bg-base-200">
        {/*<AddCoinModal /> */}
        <CryptocurrencyEditModal />
        <div class="card w-full p-6 bg-base-100 shadow-xl mt-2">
          <div class="flex w-full justify-end">
            <div class="divider divider-horizontal "></div>
            <div>
              Showing {data.meta.from} to {data.meta.to} of {data.meta.items}{" "}
              entries
              <select
                name="limit"
                hx-get={`/coins`}
                hx-trigger="change"
                hx-swap="outerHTML"
                hx-params="*"
                hx-target="closest main"
                class="select select-bordered join-item"
              >
                <option disabled value="">
                  Limit
                </option>
                {limit_options.map((option) => (
                  <option
                    value={option.toString()}
                    {...(props.limit === option ? { selected: true } : {})}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div class="divider divider-horizontal "></div>

            <div id="coin-page-filter">
              <div
                class="join"
                hx-trigger="click"
                hx-include="[name=searchBy], [name=search], [name=limit]"
                hx-target="closest main"
                hx-swap="outerHTML"
              >
                <button
                  disabled={data.meta.page === 1}
                  class="join-item btn btn-outline"
                  hx-get={`/coins?page=${1}`}
                >
                  First
                </button>
                <button
                  disabled={!data.meta.hasPreviousPage}
                  class="join-item btn btn-outline"
                  hx-get={`/coins?page=${data.meta.page - 1}`}
                >
                  Previous
                </button>
                <button name="page" class="join-item btn btn-outline">
                  Page {data.meta.page}
                </button>
                <button
                  disabled={!data.meta.hasNextPage}
                  class="join-item btn btn-outline"
                  hx-get={`/coins?page=${data.meta.page + 1}`}
                >
                  Next
                </button>
                <button
                  disabled={
                    data.meta.page === data.meta.pages || data.meta.items === 0
                  }
                  hx-get={`/coins?page=${data.meta.pages}`}
                  hx-trigger="click"
                  hx-target="closest main"
                  hx-swap="outerHTML"
                  class="join-item btn btn-outline"
                >
                  Last
                </button>
              </div>
            </div>

            <div class="divider divider-horizontal"></div>

            <div class="join">
              <div>
                <div>
                  <input
                    name="search"
                    class="input input-bordered join-item"
                    placeholder="Search"
                    value={props.search}
                    hx-get="/coins/list?page=1"
                    hx-include="[name=searchBy], [name=limit]"
                    hx-trigger="keyup changed delay:100ms"
                    hx-swap="innerHTML"
                    hx-target="#coin-table-body"
                  />
                </div>
              </div>

              <select
                name="searchBy"
                hx-get="/coins?page=1"
                hx-include="[name=search], [name=limit]"
                hx-trigger="change"
                hx-swap="innerHTML"
                hx-target="#coin-table-body"
                class="select select-bordered join-item"
              >
                <option disabled value="">
                  Search By
                </option>
                {CryptocurrencySearchByOptions.map((option) => (
                  <option
                    safe
                    value={option}
                    {...(active === option ? { selected: true } : {})}
                  >
                    {capitalizeFirstLetter(option)}
                  </option>
                ))}
              </select>
            </div>

            <div class="divider divider-horizontal "></div>

            <div class="join">
              <button
                class="btn btn-outline"
                onclick="add_coin_modal.showModal()"
              >
                Add New
              </button>
            </div>
          </div>

          <div class="divider mt-4"></div>

          <div class="h-full w-full pb-6 bg-base-100">
            <div class="overflow-x-auto w-full">
              <table class="table w-full table-pin-rows table-pin-cols">
                <thead>
                  <tr>
                    <th class={"w-1/4"}>Name / Slug</th>
                    <th class={"w-1/8"}>Symbol</th>
                    <th class={"w-1/8"}>CMC ID</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody id="coin-table-body">
                  {data.data.map((coin) => (
                    <CoinTableRow {...coin} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="h-20"></div>
      </main>
    </>
  );
};
