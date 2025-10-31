import { listerClient } from "@arbitrator/sdk";
import { html } from "@elysiajs/html";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { ORPCError } from "@orpc/client";
import { Elysia, redirect, status } from "elysia";
import z from "zod";
import { cryptocurrencyUpdateSchema, listCryptocurrencySelectSchema } from "../../../lister/src/core/cryptocurrency/cryptocurrency.schema";
import { BaseLayout } from "../helpers/BaseLayout";
import { createPushURL } from "../utils";
import { CoinTableRow } from "../views/components/CoinTableRow";
import { CoinPage } from "../views/pages/CryptocurrencyPage";
import { CryptocurrencyEditModalContent } from "../views/components/CryptoCurrencyEditModalContent";

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

	.patch("/coins/:id/edit", async ({ params, body, hx }) => {
		console.log(
			'/coins/:id/edit',
			params,
			body
		);

		hx.triggerEvent({
			"make-toast": {
				level: "info",
				message: "Coin Updated",
			},
			"update_coin_success":  null,
		});

		const [error, data] = await listerClient.cryptocurrency.findById(params.id);
		if (error !== null || !data) {
			hx.reswap("none");
			hx.triggerEvent({
				"make-toast": {
					level: "error",
					message: "failed to update coin",
				}
			});
			return status("No Content");
		}
		if (body?.name) data.name = body.name;
		if (body?.slug) data.slug = body.slug;
		if (body?.symbol) data.symbol = body.symbol;
		if (body?.cmcId) data.cmcId = body.cmcId;

		return <CoinTableRow
			{...data}
		/>;
	}, {
		params: z.object({
			id: z.coerce.string(),
		}),
		body: cryptocurrencyUpdateSchema
	})

	.get("/coins/:id/edit-modal", async ({ params, hx }) => {
		if (!hx.isHTMX) {
			return redirect("/coins");
		}
		const [error, data] = await listerClient.cryptocurrency.findById(params.id);
		if (!data || error) {
			hx.reswap("none");
			hx.triggerEvent({
				"make-toast": {
					level: "error",
					message: "coin not found",
				}
			});
		}

		return <CryptocurrencyEditModalContent coinId={params.id}  {...data} />;
	}, {
		params: z.object({
			id: z.coerce.number(),
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
