import { Elysia, redirect, t } from "elysia";
import { html } from "@elysiajs/html";
import { LolocoClient } from "@e9crypt/loloco";
import { BaseLayout } from "../helpers/BaseLayout";
import { MarketPage } from "../views/pages/MarketPage";
import { MarketTableRow } from "../views/components/MarketTableRow";
import { dateFormatter } from "../utils";
import { htmx } from "@gtramontina.com/elysia-htmx";

export const MarketController = new Elysia()
	.use(html())
	.use(htmx())

	.get("/markets", ({ query, hx }) => {
		if (hx.isHTMX) {
			return (
				<>
					<title>Market List</title>
					<MarketPage />
				</>
			)
		}
		return (
			<BaseLayout title="arbitmage - Exchanges">
				<MarketPage />
			</BaseLayout>
		)
	}, {
		query: t.Optional(t.Object({
			search: t.Optional(t.String({ default: "" })),
		}))
	})

	.get("markets/list", async ({ headers, query, set, hx }) => {
		if (!hx.isHTMX) {
			return redirect("/markets");
		}
		// TODO: remove later, stupid typebox and elysiajs integration
		// the problem is the eden make the fields that has default to be required.
		// @ts-ignore
		const { data, error } = await LolocoClient.markets.get({});

		if (error) {
			console.log(error);
			return <div>Failed to fetch markets</div>;
		}
		set.headers = {
			"hx-push-url": `?search=${query.search}`
		}
		return (
			<>
				{data.data.map(x => {
					return (
						<MarketTableRow {...x} />
					)
				})}
			</>
		)
	}, {
		query: t.Optional(t.Object({
			search: t.Optional(t.String({ default: "" })),
		}))
	})

	.get("markets/:id", async ({ params }) => {
		const { data, error } = await LolocoClient.markets[params.id].get();
		if (error !== null) {
			console.log(error);
			return <div>Failed to fetch markets</div>;
		}
		return (
			<MarketTableRow {...data} />
		)
	}, {
		params: t.Object({
			id: t.String(),
		}),
	})

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

	.get("/markets/:id/edit", async ({ params }) => {
		const { data, error } = await LolocoClient.markets[params.id].get();
		if (error !== null) {
			console.log(error);
			return <div>Failed to fetch markets</div>;
		}
		return (
			<tr
				id={`edit-market-${params.id}`}
				class="odd:bg-white dark:odd:bg-gray-900 even:bg-gray-50 dark:even:bg-gray-800 border-b dark:border-gray-700"
			>
				<th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
					<input
						type="text"
						name="symbol"
						class="px-6 py-4 block mb-2 text-sm font-medium dark:text-white"
						value={data.symbol}
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
					{dateFormatter.format(new Date(data.createdAt)) as 'safe'}
				</td>
				<td class="px-6 py-4">
					{data.updatedAt ? dateFormatter.format(new Date(data.updatedAt)) as 'safe' : "Not Updated Yet"}
				</td>
				<td class="px-6 py-4">
					<button
						hx-put={`/markets/${params.id}`}
						hx-target={`#edit-market-${params.id}`}
						hx-swap="outerHTML"
						hx-include="closest tr"
						hx-trigger="click"
						class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
					>Save</button>
					<button
						hx-get={`/markets/${params.id}`}
						hx-swap="outerHTML"
						hx-target={`#edit-market-${params.id}`}
						class="ml-5 font-medium text-blue-600 dark:text-blue-500 hover:underline"
					>Cancel</button>
				</td>
			</tr>
		)
	}, {
		params: t.Object({
			id: t.String(),
		}),
	})

	.post("markets/search", async ({ set, headers, body }) => {
		if (!headers["hx-request"]) {
			return redirect("/markets");
		}
		// @ts-ignore
		const { data, error } = await LolocoClient.markets.get({});
		if (error !== null) {
			console.log(error);
			return <div>Failed to fetch markets</div>;
		}
		set.headers = {
			"hx-push-url": `?search=${body?.search}`
		}
		return <>
			{data.data.map(x => (
				<MarketTableRow {...x} />
			))}
		</>
	}, {
		type: "application/x-www-form-urlencoded",
		body: t.Optional(t.Object({
			search: t.Optional(t.String({ default: "" })),
		})),
	})
