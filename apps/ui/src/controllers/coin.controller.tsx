import { listerClient } from "@arbitrator/sdk";
import { html } from "@elysiajs/html";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { ORPCError } from "@orpc/client";
import { Elysia, redirect, status } from "elysia";
import z from "zod";

import {
  cryptocurrencyUpdateSchema,
  listCryptocurrencySelectSchema,
} from "../../../lister/src/core/cryptocurrency/cryptocurrency.schema";
import { BaseLayout } from "../helpers/BaseLayout";
import { createPushURL } from "../utils";
import {
  CoinRouteHeader,
  CoinRoutePanel,
} from "../views/components/CoinRoutePanel";
import { CoinTableRow } from "../views/components/CoinTableRow";
import { CryptocurrencyEditModalContent } from "../views/components/CryptoCurrencyEditModalContent";
import { PageHeading } from "../views/components/PageHeading";
import { CoinPage, CoinResults } from "../views/pages/CryptocurrencyPage";

export const CryptocurrencyController = new Elysia()
  .use(html())
  .use(htmx())
  .get(
    "/coins",
    ({ query, hx }) => {
      hx.pushURL(createPushURL("/coins", query));
      if (!hx.isHTMX) {
        return (
          <BaseLayout
            title="arbitmage - Cryptocurrencies"
            heading="Cryptocurrencies"
          >
            <CoinPage {...query} />
          </BaseLayout>
        );
      }
      return (
        <>
          <PageHeading heading="Cryptocurrencies" oob />
          <title>Cryptocurrencies</title>
          <CoinPage {...query} />
        </>
      );
    },
    {
      query: listCryptocurrencySelectSchema,
    },
  )

  .get(
    "coins/list",
    async ({ query, hx }) => {
      // Canonical, reloadable URL in the address bar: /coins?page=2&search=...
      // `/coins` renders the full page, `/coins/list` only the swap unit.
      hx.pushURL(createPushURL("/coins", query));
      if (!hx.isHTMX) {
        return redirect(createPushURL("/coins", query));
      }
      // Exactly one root element = the swap target for hx-swap="outerMorph".
      return <CoinResults {...query} />;
    },
    {
      query: listCryptocurrencySelectSchema,
    },
  )

  .get(
    "coins/:id",
    async ({ params }) => {
      // const { data, error } = await LolocoClient.coins({ id: params.id }).get();
      const [error, data] = await listerClient.cryptocurrency.findById(
        params.id,
      );
      if (error !== null) {
        if (error instanceof ORPCError) {
          return redirect("/not-found");
        }
        return redirect("/internal-server-error");
      }
      return <CoinTableRow {...data} />;
    },
    {
      params: z.object({
        id: z.coerce.number(),
      }),
    },
  )

  .patch(
    "/coins/:id/edit",
    async ({ params, body, hx }) => {
      console.log("/coins/:id/edit", params, body);

      hx.triggerEvent({
        "make-toast": {
          level: "info",
          message: "Coin Updated",
        },
        update_coin_success: null,
      });

      const [error, data] = await listerClient.cryptocurrency.update({
        id: params.id,
        payload: body,
      });
      if (error !== null || !data) {
        hx.reswap("none");
        hx.triggerEvent({
          "make-toast": {
            level: "error",
            message: "failed to update coin",
          },
        });
        return status("No Content");
      }

      return <CoinTableRow {...data} />;
    },
    {
      params: z.object({
        id: z.coerce.number(),
      }),
      body: cryptocurrencyUpdateSchema,
    },
  )

  .get(
    "/coins/:id/routes",
    async ({ params, hx }) => {
      if (!hx.isHTMX) {
        return redirect("/coins");
      }

      const [coinError, coin] = await listerClient.cryptocurrency.findById(
        params.id,
      );
      if (coinError || !coin) {
        hx.triggerEvent({
          "make-toast": { level: "error", message: "coin not found" },
        });
        return status("No Content");
      }

      const [routesError, routeData] = await listerClient.cryptocurrency.routes(
        params.id,
      );
      if (routesError || !routeData) {
        hx.triggerEvent({
          "make-toast": {
            level: "error",
            message: "failed to load transfer routes",
          },
        });
        return status("No Content");
      }

      return (
        <>
          <CoinRoutePanel data={routeData} />
          <CoinRouteHeader coin={coin} oob />
        </>
      );
    },
    {
      params: z.object({
        id: z.coerce.number(),
      }),
    },
  )

  .get(
    "/coins/:id/edit-modal",
    async ({ params, hx }) => {
      if (!hx.isHTMX) {
        return redirect("/coins");
      }
      const [error, data] = await listerClient.cryptocurrency.findById(
        params.id,
      );
      if (!data || error) {
        hx.reswap("none");
        hx.triggerEvent({
          "make-toast": {
            level: "error",
            message: "coin not found",
          },
        });
      }

      return <CryptocurrencyEditModalContent coinId={params.id} {...data} />;
    },
    {
      params: z.object({
        id: z.coerce.number(),
      }),
    },
  )

  .post(
    "/coins",
    async ({ body, hx }) => {
      if (!body.slug) {
        hx.retarget("#slug-add-coin-field");
        hx.reswap("afterbegin");
        return <div>Slug is required</div>;
      }
      hx.triggerEvent("add-coin-success");
      return {
        // <CoinTableRow {
        // 	{}
        // } />
      };
    },
    {
      body: z.object({
        slug: z.optional(z.string()),
      }),
    },
  );
