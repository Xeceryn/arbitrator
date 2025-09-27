import { listerClient } from "@arbitrator/sdk";
import { html } from "@elysiajs/html";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { ORPCError } from "@orpc/client";
import { Elysia, redirect } from "elysia";
import z from "zod";
import { listCryptocurrencySelectSchema } from "../../../lister/src/core/cryptocurrency/cryptocurrency.schema";
import { BaseLayout } from "../helpers/BaseLayout";
import { createPushURL, dateFormatter } from "../utils";
import { CoinTableRow } from "../views/components/CoinTableRow";
import { CoinPage } from "../views/pages/CoinPage";

export const CryptocurrencyController = new Elysia()
	.use(html())
	.use(htmx())
	.get("/coins", ({ query, hx, }) => {
		hx.pushURL(createPushURL('/coins', query));
		if (!hx.isHTMX) {
			return (
				<BaseLayout title="arbitmage - Cryptocurrencies">
					<CoinPage {...query} />
				</BaseLayout>
			)
		}
		return (
			<>
				<title>Coin List</title>
				<CoinPage {...query} />
			</>
		)
	}, {
		query: listCryptocurrencySelectSchema,
	})

	.get("coins/list", async ({ query, hx }) => {
		if (!hx.isHTMX) {
			return redirect("/coins");
		}
		const [error, data] = await listerClient.cryptocurrency.list(query);

		if (error || !data) {
			return <div>Failed to fetch coins</div>;
		}
		hx.pushURL(createPushURL('/coins', query));
		return (
			<>
				{data.data.map((x) => (<CoinTableRow {...x} />))}
			</>
		)
	}, {
		query: listCryptocurrencySelectSchema,
	})

	.get("coins/:id", async ({ params }) => {
		// const { data, error } = await LolocoClient.coins({ id: params.id }).get();
		const [error, data] = await listerClient.cryptocurrency.findById(params.id);
		if (error !== null) {
			if (error instanceof ORPCError) {
				return redirect("/not-found");
			}
			return redirect("/internal-server-error");
		}
		return (
			<CoinTableRow {...data} />
		)
	}, {
		params: z.object({
			id: z.coerce.number(),
		})
	})

	// .put("coins/:id", async ({ params, body, set }) => {
	// 	const { data, error } = await LolocoClient.coins({ id: params.id }).put(body);
	// 	if (error !== null) {
	// 		console.log("error", error);
	// 		set.status = error.status;
	// 		return error.value
	// 	}
	// 	return (
	// 		<CoinTableRow {...data} />
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

	.get("/coins/:id/edit", async ({ params }) => {
		const [error, data] = await listerClient.cryptocurrency.findById(params.id);
		if (error !== null) {
			return <div>Failed to fetch coins</div>;
		}
		return (
			<tr
				id={`edit-coin-${params.id}`}
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
						hx-put={`/coins/${params.id}`}
						hx-target={`#edit-coin-${params.id}`}
						hx-swap="outerHTML"
						hx-include="closest tr"
						hx-trigger="click"
						class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
					>Save</button>
					<button
						hx-get={`/coins/${params.id}`}
						hx-swap="outerHTML"
						hx-target={`#edit-coin-${params.id}`}
						class="ml-5 font-medium text-blue-600 dark:text-blue-500 hover:underline"
					>Cancel</button>
				</td>
			</tr>
		)
	}, {
		params: z.object({
			id: z.coerce.string(),
		})
	})

	.post("/coins", async ({ body, hx }) => {
		if (!body.slug) {
			hx.retarget("#slug-add-coin-field");
			hx.reswap("afterbegin");
			return <div>Slug is required</div>;
		}
		hx.triggerEvent("add-coin-success");
		return (
			{
				// <CoinTableRow {
				// 	{}
				// } />
			}
		);
	}, {
		body: z.object({
			slug: z.optional(z.string()),
		})
	})
