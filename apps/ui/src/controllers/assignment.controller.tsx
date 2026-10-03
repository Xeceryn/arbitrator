import { listerClient } from "@arbitrator/sdk";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { Elysia, redirect, status } from "elysia";
import z from "zod";

import { listChainSelectSchema } from "../../../lister/src/core/chain/chain.schema";
import { listExchangeSelectSchema } from "../../../lister/src/core/exchange/exchange.schema";
import { AvailableChains } from "../views/components/AssignChainDropdown";
import { AvailableExchanges } from "../views/components/AssignExchangeDropdown";
import {
  CoinAssignmentHeader,
  CoinAssignmentList,
  CoinAssignmentPanel,
} from "../views/components/CoinAssignmentPanel";
import { MarketChains } from "../views/components/MarketChains";

/**
 * Checkbox values arrive as strings. `z.coerce.boolean()` is wrong here
 * (`Boolean("false") === true`), so parse the two literals explicitly.
 */
const booleanish = z
  .union([z.literal("true"), z.literal("false"), z.boolean()])
  .transform((value) => value === true || value === "true");

const idParam = z.object({ id: z.coerce.number() });
const marketParam = z.object({
  id: z.coerce.number(),
  marketId: z.coerce.number(),
});
const chainLinkParam = z.object({
  id: z.coerce.number(),
  marketId: z.coerce.number(),
  chainLinkId: z.coerce.number(),
});

async function renderCoinAssignmentList(coinId: number) {
  const [error, markets] = await listerClient.market.listDetailed({
    cryptocurrencyId: coinId,
  });

  if (error || !markets) {
    return (
      <div id="coin-assignment-list" class="alert alert-error" role="alert">
        <span>Unable to load assignments.</span>
      </div>
    );
  }

  return <CoinAssignmentList coinId={coinId} markets={markets} />;
}

async function renderMarketChains(coinId: number, marketId: number) {
  const [error, links] = await listerClient.chainLink.listDetailed({
    marketId,
  });

  if (error || !links) {
    return (
      <div class="alert alert-error" role="alert">
        <span>Unable to load chains.</span>
      </div>
    );
  }

  return <MarketChains coinId={coinId} marketId={marketId} links={links} />;
}

export const AssignmentController = new Elysia()
  .use(htmx())

  // Full side-panel content for a coin's assignments.
  .get(
    "/coins/:id/assignment",
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

      const [marketsError, markets] = await listerClient.market.listDetailed({
        cryptocurrencyId: params.id,
      });
      if (marketsError || !markets) {
        hx.triggerEvent({
          "make-toast": {
            level: "error",
            message: "failed to load assignments",
          },
        });
        return status("No Content");
      }

      return (
        <>
          <CoinAssignmentPanel coin={coin} markets={markets} />
          <CoinAssignmentHeader coin={coin} oob />
        </>
      );
    },
    { params: idParam },
  )

  // Searchable, paginated (5) list of not-yet-assigned exchanges.
  .get(
    "/coins/:id/available-exchanges",
    async ({ params, query, hx }) => {
      if (!hx.isHTMX) {
        return redirect("/coins");
      }

      const [error, data] = await listerClient.market.listAvailableExchanges({
        ...query,
        cryptocurrencyId: params.id,
        limit: 5,
        searchBy: "name",
        orderBy: "name",
        order: "asc",
      });

      if (error || !data) {
        return (
          <div class="alert alert-error" role="alert">
            <span>Unable to load exchanges.</span>
          </div>
        );
      }

      return <AvailableExchanges coinId={params.id} data={data} />;
    },
    { params: idParam, query: listExchangeSelectSchema },
  )

  // Assign an exchange to the coin.
  .post(
    "/coins/:id/assignments",
    async ({ params, body, hx }) => {
      const [error] = await listerClient.market.assign({
        cryptocurrencyId: params.id,
        exchangeId: body.exchangeId,
      });

      if (error) {
        hx.reswap("none");
        hx.triggerEvent({
          "make-toast": {
            level: "error",
            message: "failed to assign exchange",
          },
        });
        return status("No Content");
      }

      hx.triggerEvent({
        "make-toast": { level: "success", message: "Exchange assigned" },
        "assign-exchange-success": null,
      });
      return await renderCoinAssignmentList(params.id);
    },
    {
      params: idParam,
      body: z.object({ exchangeId: z.coerce.number() }),
    },
  )

  // Toggle trade (or change the symbol) on an assignment.
  .patch(
    "/coins/:id/assignments/:marketId",
    async ({ params, body, hx }) => {
      const [findError, market] = await listerClient.market.findById(
        params.marketId,
      );
      if (findError || !market) {
        hx.reswap("none");
        hx.triggerEvent({
          "make-toast": { level: "error", message: "assignment not found" },
        });
        return status("No Content");
      }

      const [error] = await listerClient.market.update({
        exchangeId: market.exchangeId,
        cryptocurrencyId: market.cryptocurrencyId,
        tradeEnabled: body.tradeEnabled,
        exchangeSymbol: body.exchangeSymbol,
      });

      if (error) {
        hx.reswap("none");
        hx.triggerEvent({
          "make-toast": {
            level: "error",
            message: "failed to update assignment",
          },
          // Let the trade toggle snap back to the last saved value.
          ...(body.tradeEnabled !== undefined
            ? { "toggle-error": { tradeEnabled: market.tradeEnabled } }
            : {}),
        });
        return status("No Content");
      }

      hx.triggerEvent({
        "make-toast": { level: "success", message: "Assignment updated" },
      });

      // Toggles don't swap; only the symbol editor needs the refreshed list.
      if (body.tradeEnabled !== undefined) {
        return status("No Content");
      }
      return await renderCoinAssignmentList(params.id);
    },
    {
      params: marketParam,
      body: z.object({
        tradeEnabled: booleanish.optional(),
        exchangeSymbol: z.string().optional(),
      }),
    },
  )

  // Unassign an exchange from the coin.
  .delete(
    "/coins/:id/assignments/:marketId",
    async ({ params, hx }) => {
      const [findError, market] = await listerClient.market.findById(
        params.marketId,
      );
      if (findError || !market) {
        hx.reswap("none");
        hx.triggerEvent({
          "make-toast": { level: "error", message: "assignment not found" },
        });
        return status("No Content");
      }

      const [error] = await listerClient.market.unassign({
        exchangeId: market.exchangeId,
        cryptocurrencyId: market.cryptocurrencyId,
      });

      if (error) {
        hx.reswap("none");
        hx.triggerEvent({
          "make-toast": {
            level: "error",
            message: "failed to unassign exchange",
          },
        });
        return status("No Content");
      }

      hx.triggerEvent({
        "make-toast": { level: "success", message: "Exchange unassigned" },
      });
      return await renderCoinAssignmentList(params.id);
    },
    { params: marketParam },
  )

  // Chain assignments for one market (loaded lazily on expand).
  .get(
    "/coins/:id/assignments/:marketId/chains",
    async ({ params, hx }) => {
      if (!hx.isHTMX) {
        return redirect("/coins");
      }
      return await renderMarketChains(params.id, params.marketId);
    },
    { params: marketParam },
  )

  // Searchable, paginated (5) list of not-yet-linked chains.
  .get(
    "/coins/:id/assignments/:marketId/available-chains",
    async ({ params, query, hx }) => {
      if (!hx.isHTMX) {
        return redirect("/coins");
      }

      const [error, data] = await listerClient.chainLink.listAvailableChains({
        ...query,
        marketId: params.marketId,
        limit: 5,
        searchBy: "name",
        orderBy: "name",
        order: "asc",
      });

      if (error || !data) {
        return (
          <div class="alert alert-error" role="alert">
            <span>Unable to load chains.</span>
          </div>
        );
      }

      return (
        <AvailableChains
          coinId={params.id}
          marketId={params.marketId}
          data={data}
        />
      );
    },
    { params: marketParam, query: listChainSelectSchema },
  )

  // Assign a chain to the market.
  .post(
    "/coins/:id/assignments/:marketId/chains",
    async ({ params, body, hx }) => {
      const [error] = await listerClient.chainLink.add({
        marketId: params.marketId,
        chainId: body.chainId,
      });

      if (error) {
        hx.reswap("none");
        hx.triggerEvent({
          "make-toast": { level: "error", message: "failed to assign chain" },
        });
        return status("No Content");
      }

      hx.triggerEvent({
        "make-toast": { level: "success", message: "Chain assigned" },
      });
      return await renderMarketChains(params.id, params.marketId);
    },
    {
      params: marketParam,
      body: z.object({ chainId: z.coerce.number() }),
    },
  )

  // Toggle deposit/withdraw on a chain link.
  .patch(
    "/coins/:id/assignments/:marketId/chains/:chainLinkId",
    async ({ params, body, hx }) => {
      const [error] = await listerClient.chainLink.update({
        id: params.chainLinkId,
        payload: {
          depositEnabled: body.depositEnabled,
          withdrawEnabled: body.withdrawEnabled,
        },
      });

      if (error) {
        hx.reswap("none");
        hx.triggerEvent({
          "make-toast": { level: "error", message: "failed to update chain" },
          // Let the deposit/withdraw toggles snap back (previous = !new).
          "toggle-error": {
            depositEnabled:
              body.depositEnabled !== undefined
                ? !body.depositEnabled
                : undefined,
            withdrawEnabled:
              body.withdrawEnabled !== undefined
                ? !body.withdrawEnabled
                : undefined,
          },
        });
        return status("No Content");
      }

      return status("No Content");
    },
    {
      params: chainLinkParam,
      body: z.object({
        depositEnabled: booleanish.optional(),
        withdrawEnabled: booleanish.optional(),
      }),
    },
  )

  // Unassign a chain from the market.
  .delete(
    "/coins/:id/assignments/:marketId/chains/:chainLinkId",
    async ({ params, hx }) => {
      const [error] = await listerClient.chainLink.remove(params.chainLinkId);

      if (error) {
        hx.reswap("none");
        hx.triggerEvent({
          "make-toast": { level: "error", message: "failed to unassign chain" },
        });
        return status("No Content");
      }

      hx.triggerEvent({
        "make-toast": { level: "success", message: "Chain unassigned" },
      });
      return await renderMarketChains(params.id, params.marketId);
    },
    { params: chainLinkParam },
  );
