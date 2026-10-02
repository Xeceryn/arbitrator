import { listerClient } from "@arbitrator/sdk";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { Elysia, redirect, t } from "elysia";

import { listExchangeSelectSchema } from "../../../lister/src/core/exchange/exchange.schema";
import { BaseLayout } from "../helpers/BaseLayout";
import { dateFormatter } from "../utils";
import { MarketTableRow } from "../views/components/MarketTableRow";
import { MarketPage } from "../views/pages/MarketPage";

export const ExchangeController = new Elysia()
  .use(htmx())

  .get(
    "/markets",
    ({ hx }) => {
      if (hx.isHTMX) {
        return (
          <>
            <title>Market List</title>
            <MarketPage />
          </>
        );
      }
      return (
        <BaseLayout title="arbitmage - Exchanges">
          <MarketPage />
        </BaseLayout>
      );
    },
    {
      query: t.Optional(
        t.Object({
          search: t.Optional(t.String({ default: "" })),
        }),
      ),
    },
  )

  .get(
    "markets/list",
    async ({ query, set, hx }) => {
      if (!hx.isHTMX) {
        return redirect("/markets");
      }
      const { data, error } = await listerClient.exchange.list(query);

      if (error) {
        console.log(error);
        return <div>Failed to fetch markets</div>;
      }
      set.headers = {
        "hx-push-url": `?search=${query.search}`,
      };
      return (
        <>
          {data.data.map((x) => {
            return <MarketTableRow {...x} />;
          })}
        </>
      );
    },
    {
      query: listExchangeSelectSchema,
    },
  )

  .get(
    "markets/:id",
    async ({ params }) => {
      const { data, error } = await listerClient.exchange.findById(params.id);
      if (error !== null) {
        console.log(error);
        return <div>Failed to fetch markets</div>;
      }
      return <MarketTableRow {...data} />;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )

  // .put("markets/:id", async ({ params, body, set }) => {
  // 	const { data, error } = await LolocoClient.markets({ id: params.id }).put(body);
  // 	if (error !== null) {
  // 		console.log("error", error);
  // 		set.status = error.status;
  // 		return error.value
  // 	}
  // 	return (
  // 		<MarketTableRow {...data} />
  // 	)
  // }, {
  // 	params: t.Object({
  // 		id: t.String(),
  // 	}),
  // 	body: t.Object({
  // 		name: t.String(),
  // 		symbol: t.String(),
  // 	}),
  // })

  .get(
    "/markets/:id/edit",
    async ({ params }) => {
      const [error, data] = await listerClient.exchange.findById(params.id);
      if (error !== null) {
        return <div>Failed to fetch markets</div>;
      }
      return (
        <tr
          id={`edit-market-${params.id}`}
          class="odd:bg-white dark:odd:bg-gray-900 even:bg-gray-50 dark:even:bg-gray-800 border-b dark:border-gray-700"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            <input
              type="text"
              name="symbol"
              class="px-6 py-4 block mb-2 text-sm font-medium dark:text-white"
              value={data.slug}
            />
          </th>
          <td class="px-6 py-4">
            <input
              class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              type="text"
              name="name"
              value={data.name}
            />
          </td>
          <td class="px-6 py-4">
            {dateFormatter.format(new Date(data.createdAt)) as "safe"}
          </td>
          <td class="px-6 py-4">
            {data.updatedAt
              ? (dateFormatter.format(new Date(data.updatedAt)) as "safe")
              : "Not Updated Yet"}
          </td>
          <td class="px-6 py-4">
            <button
              hx-put={`/markets/${params.id}`}
              hx-target={`#edit-market-${params.id}`}
              hx-swap="outerHTML"
              hx-include="closest tr"
              hx-trigger="click"
              class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              Save
            </button>
            <button
              hx-get={`/markets/${params.id}`}
              hx-swap="outerHTML"
              hx-target={`#edit-market-${params.id}`}
              class="ml-5 font-medium text-blue-600 dark:text-blue-500 hover:underline"
            >
              Cancel
            </button>
          </td>
        </tr>
      );
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
