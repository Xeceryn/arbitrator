import { listerClient } from "@arbitrator/sdk";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { Elysia, redirect, status } from "elysia";
import z from "zod";

import { listExchangeSelectSchema } from "../../../lister/src/core/exchange/exchange.schema";
import { BaseLayout } from "../helpers/BaseLayout";
import { createPushURL } from "../utils";
import { ExchangeEditModalContent } from "../views/components/ExchangeEditModalContent";
import { MarketTableRow } from "../views/components/MarketTableRow";
import { PageHeading } from "../views/components/PageHeading";
import { MarketPage, MarketResults } from "../views/pages/MarketPage";

/** Form bodies arrive as strings, so coerce before handing them to the API. */
const exchangeBody = z.object({
  cmcId: z.coerce.number().int().positive(),
  name: z.string().min(1),
  slug: z.string().min(1),
  logo: z.string().min(1),
  baseCurrency: z.enum(["usdt", "idr"]),
  registeredOnCmc: z
    .union([z.literal("true"), z.literal("false")])
    .transform((value) => value === "true"),
});

const exchangeUpdateBody = exchangeBody.partial();

export const ExchangeController = new Elysia()
  .use(htmx())

  .get(
    "/markets",
    ({ query, hx }) => {
      hx.pushURL(createPushURL("/markets", query));
      if (!hx.isHTMX) {
        return (
          <BaseLayout title="arbitmage - Exchanges" heading="Exchanges">
            <MarketPage {...query} />
          </BaseLayout>
        );
      }
      return (
        <>
          <PageHeading heading="Exchanges" oob />
          <title>Exchanges</title>
          <MarketPage {...query} />
        </>
      );
    },
    {
      query: listExchangeSelectSchema,
    },
  )

  .get(
    "markets/list",
    async ({ query, hx }) => {
      hx.pushURL(createPushURL("/markets", query));
      if (!hx.isHTMX) {
        return redirect(createPushURL("/markets", query));
      }
      return <MarketResults {...query} />;
    },
    {
      query: listExchangeSelectSchema,
    },
  )

  .get(
    "/markets/:id/edit-modal",
    async ({ params, hx }) => {
      if (!hx.isHTMX) {
        return redirect("/markets");
      }
      const [error, data] = await listerClient.exchange.findById(params.id);
      if (!data || error) {
        hx.reswap("none");
        hx.triggerEvent({
          "make-toast": { level: "error", message: "exchange not found" },
        });
        return status("No Content");
      }

      return <ExchangeEditModalContent exchangeId={params.id} {...data} />;
    },
    {
      params: z.object({
        id: z.coerce.number(),
      }),
    },
  )

  .patch(
    "/markets/:id/edit",
    async ({ params, body, hx }) => {
      const [error, data] = await listerClient.exchange.update({
        id: params.id,
        payload: body,
      });
      if (error || !data) {
        hx.reswap("none");
        hx.triggerEvent({
          "make-toast": {
            level: "error",
            message: "failed to update exchange",
          },
        });
        return status("No Content");
      }

      hx.triggerEvent({
        "make-toast": { level: "success", message: "Exchange updated" },
        update_exchange_success: null,
      });
      return <MarketTableRow {...data} />;
    },
    {
      params: z.object({
        id: z.coerce.number(),
      }),
      body: exchangeUpdateBody,
    },
  )

  .post(
    "/markets",
    async ({ body, hx }) => {
      const [error, data] = await listerClient.exchange.add(body);
      if (error || !data) {
        hx.triggerEvent({
          "make-toast": { level: "error", message: "failed to add exchange" },
        });
        return status("No Content");
      }

      hx.triggerEvent({
        "make-toast": { level: "success", message: "Exchange added" },
        "add-exchange-success": null,
      });
      return <MarketTableRow {...data} />;
    },
    {
      body: exchangeBody,
    },
  );
