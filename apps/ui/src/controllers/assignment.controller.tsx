import { listerClient } from "@arbitrator/sdk";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { Elysia, redirect, status } from "elysia";
import z from "zod";

import { listChainSelectSchema } from "../../../lister/src/core/chain/chain.schema";
import { listExchangeSelectSchema } from "../../../lister/src/core/exchange/exchange.schema";
import { AvailableChains } from "../views/components/AssignChainDropdown";
import {
    ChainConfirmCard,
    ChainError,
    ChainPicker,
} from "../views/components/AssignChainStaging";
import { AvailableExchanges } from "../views/components/AssignExchangeDropdown";
import {
    AssignmentConfirmCard,
    AssignmentError,
    ExchangePicker,
    ExchangeSymbolInput,
} from "../views/components/AssignmentStaging";
import {
    CoinAssignmentEmpty,
    CoinAssignmentHeader,
    CoinAssignmentPanel,
} from "../views/components/CoinAssignmentPanel";
import { ExchangeAssignmentCard } from "../views/components/ExchangeAssignmentCard";
import {
    ChainLinkRow,
    MarketChainEmpty,
    MarketChains,
} from "../views/components/MarketChains";

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

/** oRPC errors carry a `code`; the safe client types it loosely. */
function errorCode(error: unknown): string | undefined {
    if (error && typeof error === "object" && "code" in error) {
        return (error as { code?: string }).code;
    }
    return undefined;
}

/**
 * Truthful `#coin-assignment-empty` region. Rendered as a partial after every
 * list mutation so the target always exists and only its `hidden` state
 * changes. Never emits a partial that deletes an element that could be absent.
 */
async function renderAssignmentEmptyPartial(coinId: number) {
    const [error, markets] = await listerClient.market.listDetailed({
        cryptocurrencyId: coinId,
    });
    if (error || !markets) {
        console.error(
            `Unable to verify assignments for coin ${coinId}; leaving the empty state untouched.`,
        );
        return null;
    }
    const hasMarkets = markets.length > 0;

    return (
        <hx-partial hx-target="#coin-assignment-empty" hx-swap="outerMorph">
            <CoinAssignmentEmpty hidden={hasMarkets} />
        </hx-partial>
    );
}

/** Same idea as the exchange empty state, scoped to one market's chain list. */
async function renderChainEmptyPartial(marketId: number) {
    const [error, links] = await listerClient.chainLink.listDetailed({
        marketId,
    });
    if (error || !links) {
        console.error(
            `Unable to verify chains for market ${marketId}; leaving the empty state untouched.`,
        );
        return null;
    }
    const hasLinks = links.length > 0;

    return (
        <hx-partial hx-target={`#market-chains-empty-${marketId}`} hx-swap="outerMorph">
            <MarketChainEmpty marketId={marketId} hidden={hasLinks} />
        </hx-partial>
    );
}

/** Initial (and only full) render of the expanded chain panel for a market. */
async function renderMarketChains(coinId: number, marketId: number) {
    const [error, links] = await listerClient.chainLink.listDetailed({
        marketId,
    });

    if (error || !links) {
        return (
            <div class="alert alert-error" role="alert">
                <span>Unable to load chains. Try again.</span>
            </div>
        );
    }

    return <MarketChains coinId={coinId} marketId={marketId} links={links} />;
}

export const AssignmentController = new Elysia()
    .use(htmx())

    // Full side-panel content for a coin's assignments. Initial load only;
    // every later mutation returns the smallest fragment that changed.
    .get(
        "/coins/:id/assignment",
        async ({ params, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/coins");
            }

            const [coinError, coin] =
                await listerClient.cryptocurrency.findById(params.id);
            if (coinError || !coin) {
                hx.triggerEvent({
                    "make-toast": { level: "error", message: "Coin not found." },
                });
                return status("No Content");
            }

            const [marketsError, markets] =
                await listerClient.market.listDetailed({
                    cryptocurrencyId: params.id,
                });
            if (marketsError || !markets) {
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "Unable to load assignments. Try again.",
                    },
                });
                return status("No Content");
            }

            return (
                <>
                    <CoinAssignmentPanel coin={coin} markets={markets} />
                    {/* Preferred over an out-of-band swap: the header sits
                    outside the panel target. */}
                    <hx-partial
                        hx-target="#coin_assignment_header"
                        hx-swap="outerMorph"
                    >
                        <CoinAssignmentHeader coin={coin} />
                    </hx-partial>
                </>
            );
        },
        { params: idParam },
    )

    // Step 1 of the staged add flow: choose an exchange.
    .get(
        "/coins/:id/assignment/new",
        async ({ params, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/coins");
            }
            return <ExchangePicker coinId={params.id} />;
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

            const [error, data] =
                await listerClient.market.listAvailableExchanges({
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
                        <span>Unable to load exchanges. Try again.</span>
                    </div>
                );
            }

            return <AvailableExchanges coinId={params.id} data={data} />;
        },
        { params: idParam, query: listExchangeSelectSchema },
    )

    // Step 2: confirm the chosen exchange before writing anything.
    .get(
        "/coins/:id/assignments/select",
        async ({ params, query, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/coins");
            }

            const [coinError, coin] =
                await listerClient.cryptocurrency.findById(params.id);
            const [exchangeError, exchange] =
                await listerClient.exchange.findById(query.exchangeId);
            if (coinError || !coin || exchangeError || !exchange) {
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message:
                            "That exchange is no longer available. Choose another.",
                    },
                });
                return status("No Content");
            }

            return (
                <AssignmentConfirmCard
                    coin={coin}
                    exchange={exchange}
                    defaultSymbol={coin.symbol.toUpperCase()}
                />
            );
        },
        {
            params: idParam,
            query: z.object({ exchangeId: z.coerce.number() }),
        },
    )

    // Step 3: assign. Returns only the new card plus the empty-state partial.
    .post(
        "/coins/:id/assignments",
        async ({ params, body, hx }) => {
            let exchangeSymbol: string | undefined;
            if (body.exchangeSymbol !== undefined) {
                const trimmed = body.exchangeSymbol.trim();
                if (trimmed.length > 255) {
                    return status(
                        422,
                        <>
                            <AssignmentError message="Enter a symbol of 1 to 255 characters." />
                            <hx-partial
                                hx-target="#exchange-symbol-input"
                                hx-swap="outerMorph"
                            >
                                <ExchangeSymbolInput
                                    value={body.exchangeSymbol}
                                    invalid
                                    describedBy="assignment-error"
                                    ariaLabel={null}
                                />
                            </hx-partial>
                        </>,
                    );
                }
                // An empty/whitespace symbol means "use the coin symbol",
                // matching the confirm step's prefill. Only a non-empty
                // out-of-range value is a validation error.
                if (trimmed.length > 0) {
                    exchangeSymbol = trimmed;
                }
            }

            const [error, market] = await listerClient.market.assign({
                cryptocurrencyId: params.id,
                exchangeId: body.exchangeId,
                ...(exchangeSymbol !== undefined ? { exchangeSymbol } : {}),
                ...(body.tradeEnabled !== undefined
                    ? { tradeEnabled: body.tradeEnabled }
                    : {}),
            });

            if (error || !market) {
                if (errorCode(error) === "CONFLICT") {
                    return status(
                        422,
                        <AssignmentError message="That exchange is already assigned. Choose another exchange." />,
                    );
                }
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "Unable to assign the exchange. Try again.",
                    },
                });
                return status("No Content");
            }

            const [listError, markets] =
                await listerClient.market.listDetailed({
                    cryptocurrencyId: params.id,
                });
            const created = markets?.find((item) => item.id === market.id);
            if (listError || !created) {
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message:
                            "Exchange assigned, but its card could not load. Reopen the assignments.",
                    },
                });
                return status("No Content");
            }

            hx.triggerEvent({
                "make-toast": {
                    level: "success",
                    message: `${created.exchange.name} assigned`,
                },
                "assignment-exchange-added": {
                    exchangeId: created.exchangeId,
                    marketId: created.id,
                },
            });

            return (
                <>
                    <ExchangeAssignmentCard
                        coinId={params.id}
                        market={created}
                    />
                    {await renderAssignmentEmptyPartial(params.id)}
                </>
            );
        },
        {
            params: idParam,
            body: z.object({
                exchangeId: z.coerce.number(),
                exchangeSymbol: z.string().optional(),
                tradeEnabled: booleanish.optional(),
            }),
        },
    )

    // Step 5/6: edit the symbol (returns just this card) or flip the trade
    // toggle (returns nothing to swap).
    .patch(
        "/coins/:id/assignments/:marketId",
        async ({ params, body, hx }) => {
            const [findError, market] = await listerClient.market.findById(
                params.marketId,
            );
            if (findError || !market) {
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "Assignment not found. Reopen the assignments.",
                    },
                });
                return status("No Content");
            }

            if (body.exchangeSymbol !== undefined) {
                const rawSymbol = body.exchangeSymbol;
                const trimmed = rawSymbol.trim();
                if (trimmed.length === 0 || trimmed.length > 255) {
                    return status(
                        422,
                        <>
                            <AssignmentError message="Enter a symbol of 1 to 255 characters." />
                            <hx-partial
                                hx-target={`#exchange-symbol-${params.marketId}`}
                                hx-swap="outerMorph"
                            >
                                <ExchangeSymbolInput
                                    id={`exchange-symbol-${params.marketId}`}
                                    value={rawSymbol}
                                    invalid
                                    describedBy={`symbol-error-${params.marketId}`}
                                />
                            </hx-partial>
                        </>,
                    );
                }

                const [error] = await listerClient.market.update({
                    exchangeId: market.exchangeId,
                    cryptocurrencyId: market.cryptocurrencyId,
                    tradeEnabled: market.tradeEnabled,
                    exchangeSymbol: trimmed,
                });
                if (error) {
                    hx.reswap("none");
                    hx.triggerEvent({
                        "make-toast": {
                            level: "error",
                            message: "Unable to save the symbol. Try again.",
                        },
                    });
                    return status("No Content");
                }

                const [listError, markets] =
                    await listerClient.market.listDetailed({
                        cryptocurrencyId: params.id,
                    });
                const updated = markets?.find(
                    (item) => item.id === params.marketId,
                );
                if (listError || !updated) {
                    hx.reswap("none");
                    hx.triggerEvent({
                        "make-toast": {
                            level: "error",
                            message:
                                "Symbol saved, but the card could not load. Reopen the assignments.",
                        },
                    });
                    return status("No Content");
                }

                hx.triggerEvent({
                    "make-toast": { level: "success", message: "Symbol saved" },
                });
                return <ExchangeAssignmentCard coinId={params.id} market={updated} />;
            }

            const [error] = await listerClient.market.update({
                exchangeId: market.exchangeId,
                cryptocurrencyId: market.cryptocurrencyId,
                tradeEnabled: body.tradeEnabled,
            });
            if (error) {
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "Unable to update trading. Try again.",
                    },
                    // Snap the optimistic toggle back to the last saved value.
                    "assignment-toggle-error": {
                        tradeEnabled: market.tradeEnabled,
                    },
                });
                return status("No Content");
            }

            return status("No Content");
        },
        {
            params: marketParam,
            body: z.object({
                tradeEnabled: booleanish.optional(),
                exchangeSymbol: z.string().optional(),
            }),
        },
    )

    // Step 4: unassign. The delete control removes its own card; the response
    // only carries the truthful empty-state partial and an event.
    .delete(
        "/coins/:id/assignments/:marketId",
        async ({ params, hx }) => {
            const [findError, market] = await listerClient.market.findById(
                params.marketId,
            );
            if (findError || !market) {
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "Assignment not found.",
                    },
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
                        message: "Unable to unassign the exchange. Try again.",
                    },
                });
                return status("No Content");
            }

            hx.triggerEvent({
                "make-toast": {
                    level: "success",
                    message: "Exchange unassigned",
                },
                "assignment-exchange-removed": { marketId: params.marketId },
            });
            return (await renderAssignmentEmptyPartial(params.id)) ?? "";
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

    // Step 1 of the staged chain flow.
    .get(
        "/coins/:id/assignments/:marketId/chains/new",
        async ({ params, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/coins");
            }
            return (
                <ChainPicker coinId={params.id} marketId={params.marketId} />
            );
        },
        { params: marketParam },
    )

    // Step 2 of the staged chain flow.
    .get(
        "/coins/:id/assignments/:marketId/chains/select",
        async ({ params, query, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/coins");
            }

            const [error, chain] = await listerClient.chain.findById(
                query.chainId,
            );
            if (error || !chain) {
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message:
                            "That chain is no longer available. Choose another.",
                    },
                });
                return status("No Content");
            }

            return (
                <ChainConfirmCard
                    coinId={params.id}
                    marketId={params.marketId}
                    chain={chain}
                />
            );
        },
        {
            params: marketParam,
            query: z.object({ chainId: z.coerce.number() }),
        },
    )

    // Searchable, paginated (5) list of not-yet-linked chains.
    .get(
        "/coins/:id/assignments/:marketId/available-chains",
        async ({ params, query, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/coins");
            }

            const [error, data] =
                await listerClient.chainLink.listAvailableChains({
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
                        <span>Unable to load chains. Try again.</span>
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

    // Chain step 3: append only the new row plus the empty-state partial.
    .post(
        "/coins/:id/assignments/:marketId/chains",
        async ({ params, body, hx }) => {
            const [error, link] = await listerClient.chainLink.add({
                marketId: params.marketId,
                chainId: body.chainId,
            });

            if (error || !link) {
                if (errorCode(error) === "CONFLICT") {
                    return status(
                        422,
                        <ChainError message="That chain is already assigned to this market. Choose another." />,
                    );
                }
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "Unable to assign the chain. Try again.",
                    },
                });
                return status("No Content");
            }

            const [listError, links] =
                await listerClient.chainLink.listDetailed({
                    marketId: params.marketId,
                });
            const created = links?.find((item) => item.id === link.id);
            if (listError || !created) {
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message:
                            "Chain assigned, but its row could not load. Reopen the chains.",
                    },
                });
                return status("No Content");
            }

            hx.triggerEvent({
                "make-toast": {
                    level: "success",
                    message: `${created.chain.name} assigned`,
                },
                "assignment-chain-added": {
                    marketId: params.marketId,
                    chainLinkId: created.id,
                },
            });

            return (
                <>
                    <ChainLinkRow
                        coinId={params.id}
                        marketId={params.marketId}
                        link={created}
                    />
                    {await renderChainEmptyPartial(params.marketId)}
                </>
            );
        },
        {
            params: marketParam,
            body: z.object({ chainId: z.coerce.number() }),
        },
    )

    // Toggle deposit/withdraw on a chain link (no swap on success).
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
                    "make-toast": {
                        level: "error",
                        message: "Unable to update the chain. Try again.",
                    },
                    // Snap the toggles back to the last saved values.
                    "assignment-toggle-error": {
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

    // Unassign a chain (the delete control removes its own row).
    .delete(
        "/coins/:id/assignments/:marketId/chains/:chainLinkId",
        async ({ params, hx }) => {
            const [error] = await listerClient.chainLink.remove(
                params.chainLinkId,
            );

            if (error) {
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "Unable to unassign the chain. Try again.",
                    },
                });
                return status("No Content");
            }

            hx.triggerEvent({
                "make-toast": {
                    level: "success",
                    message: "Chain unassigned",
                },
                "assignment-chain-removed": {
                    marketId: params.marketId,
                    chainLinkId: params.chainLinkId,
                },
            });
            return (await renderChainEmptyPartial(params.marketId)) ?? "";
        },
        { params: chainLinkParam },
    );
