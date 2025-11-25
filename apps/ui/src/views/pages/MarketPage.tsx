// import { listerClient } from "@arbitrator/sdk";
// import type { ListExchangeInput } from "@arbitrator/lister/types";

export async function MarketPage() {
  // const [error, data] = await listerClient.exchange.list(props);
  // if (error) {
  // 	return <div>Failed to fetch coins</div>;
  // }

  return (
    <main class="flex-1 overflow-y-auto md:pt-4 pt-4 px-12  bg-base-200">
      <div class="card w-full p-6 bg-base-100 shadow-xl mt-2">
        <div class="text-xl font-semibold inline-block">
          Exchange List
          <div class="inline-block float-right">
            <div class="inline-block float-right">
              <button class="btn px-6 btn-sm normal-case btn-primary">
                Add New
              </button>
            </div>
          </div>
        </div>
        <div class="divider mt-4"></div>

        <div class="h-full w-full pb-6 bg-base-100">
          <div class="overflow-x-auto w-full">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>Name / Slug</th>
                  <th>CMC ID</th>
                  {
                    // <th>Description</th>
                  }
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th></th>
                </tr>
              </thead>
              <tbody
                id="market-table-body"
                hx-target="this"
                hx-trigger="load"
                hx-get="/markets/list"
                hx-swap="innerHTML transition:true"
              ></tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="h-20"></div>
    </main>
  );
}
