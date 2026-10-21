import { lister } from "@arbitrator/sdk";
import { Elysia, redirect, status, t } from "elysia";

import { listChainSelectSchema } from "../../../lister/src/core/chain/chain.schema";
import { listExchangeSelectSchema } from "../../../lister/src/core/exchange/exchange.schema";
import { htmx } from "../plugins/htmx";
import { formBoolean, toBoolean } from "../utils";
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

const idParam = t.Object({ id: t.Integer() });
const marketParam = t.Object({
    id: t.Integer(),
    marketId: t.Integer(),
});
const chainLinkParam = t.Object({
    id: t.Integer(),
    marketId: t.Integer(),
    chainLinkId: t.Integer(),
});

/** Eden reports the HTTP status; a duplicate assignment is a 409. */
function isConflict(error: { status: number } | null | undefined): boolean {
    return error?.status === 409;
}

/**
 * Truthful `#coin-assignment-empty` region. Rendered as a partial after every
 * list mutation so the target always exists and only its `hidden` state
 * changes. Never emits a partial that deletes an element that could be absent.
 */
async function renderAssignmentEmptyPartial(coinId: number) {
    const { data: markets, error } = await lister.market.detailed.get({
        query: { cryptocurrencyId: coinId },
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
    const { data: links, error } = await lister["chain-link"].detailed.get({
        query: { marketId },
    });
    if (error || !links) {
        console.error(
            `Unable to verify chains for market ${marketId}; leaving the empty state untouched.`,
        );
        return null;
    }
    const hasLinks = links.length > 0;

    return (
        <hx-partial
            hx-target={`#market-chains-empty-${marketId}`}
            hx-swap="outerMorph"
        >
            <MarketChainEmpty marketId={marketId} hidden={hasLinks} />
        </hx-partial>
    );
}

/** Initial (and only full) render of the expanded chain panel for a market. */
async function renderMarketChains(coinId: number, marketId: number) {
    const { data: links, error } = await lister["chain-link"].detailed.get({
        query: { marketId },
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

export const AssignmentController = new Elysia({
    name: "assignment",
    tags: ["assignment"],
})
    .use(htmx())

    // Full side-panel content for a coin's assignments. Initial load only;
    // every later mutation returns the smallest fragment that changed.
    .get(
        "/coins/:id/assignment",
        { params: idParam },
        async ({ params, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/coins");
            }

            const { data: coin, error: coinError } = await lister
                .cryptocurrency({ id: params.id })
                .get();
            if (coinError || !coin) {
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "Coin not found.",
                    },
                });
                return status("No Content");
            }

            const { data: markets, error: marketsError } =
                await lister.market.detailed.get({
                    query: { cryptocurrencyId: params.id },
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
    )

    // Step 1 of the staged add flow: choose an exchange.
    .get(
        "/coins/:id/assignment/new",
        { params: idParam },
        async ({ params, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/coins");
            }
            return <ExchangePicker coinId={params.id} />;
        },
    )

    // Searchable, paginated (5) list of not-yet-assigned exchanges.
    .get(
        "/coins/:id/available-exchanges",
        { params: idParam, query: listExchangeSelectSchema },
        async ({ params, query, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/coins");
            }

            const { data, error } = await lister.market[
                "available-exchanges"
            ].get({
                query: {
                    ...query,
                    cryptocurrencyId: params.id,
                    limit: 5,
                    searchBy: "name",
                    orderBy: "name",
                    order: "asc",
                },
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
    )

    // Step 2: confirm the chosen exchange before writing anything.
    .get(
        "/coins/:id/assignments/select",
        {
            params: idParam,
            query: t.Object({ exchangeId: t.Integer() }),
        },
        async ({ params, query, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/coins");
            }

            const { data: coin, error: coinError } = await lister
                .cryptocurrency({ id: params.id })
                .get();
            const { data: exchange, error: exchangeError } = await lister
                .exchange({ id: query.exchangeId })
                .get();
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
    )

    // Step 3: assign. Returns only the new card plus the empty-state partial.
    .post(
        "/coins/:id/assignments",
        {
            params: idParam,
            body: t.Object({
                exchangeId: t.Integer(),
                exchangeSymbol: t.Optional(t.String()),
                tradeEnabled: t.Optional(formBoolean),
            }),
        },
        async ({ params, body, hx }) => {
            const tradeEnabled = toBoolean(body.tradeEnabled);
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

            const { data: market, error } = await lister.market.assign.post({
                cryptocurrencyId: params.id,
                exchangeId: body.exchangeId,
                ...(exchangeSymbol !== undefined ? { exchangeSymbol } : {}),
                ...(tradeEnabled !== undefined ? { tradeEnabled } : {}),
            });

            if (error || !market) {
                if (isConflict(error)) {
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

            const { data: markets, error: listError } =
                await lister.market.detailed.get({
                    query: { cryptocurrencyId: params.id },
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
    )

    // Step 5/6: edit the symbol (returns just this card) or flip the trade
    // toggle (returns nothing to swap).
    .patch(
        "/coins/:id/assignments/:marketId",
        {
            params: marketParam,
            body: t.Object({
                tradeEnabled: t.Optional(formBoolean),
                exchangeSymbol: t.Optional(t.String()),
            }),
        },
        async ({ params, body, hx }) => {
            const { data: market, error: findError } = await lister
                .market({ id: params.marketId })
                .get();
            if (findError || !market) {
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message:
                            "Assignment not found. Reopen the assignments.",
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

                const { error } = await lister.market.patch({
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

                const { data: markets, error: listError } =
                    await lister.market.detailed.get({
                        query: { cryptocurrencyId: params.id },
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
                return (
                    <ExchangeAssignmentCard
                        coinId={params.id}
                        market={updated}
                    />
                );
            }

            const { error } = await lister.market.patch({
                exchangeId: market.exchangeId,
                cryptocurrencyId: market.cryptocurrencyId,
                tradeEnabled: toBoolean(body.tradeEnabled),
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
    )

    // Step 4: unassign. The delete control removes its own card; the response
    // only carries the truthful empty-state partial and an event.
    .delete(
        "/coins/:id/assignments/:marketId",
        { params: marketParam },
        async ({ params, hx }) => {
            const { data: market, error: findError } = await lister
                .market({ id: params.marketId })
                .get();
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

            const { error } = await lister.market.unassign.post({
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
    )

    // Chain assignments for one market (loaded lazily on expand).
    .get(
        "/coins/:id/assignments/:marketId/chains",
        { params: marketParam },
        async ({ params, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/coins");
            }
            return await renderMarketChains(params.id, params.marketId);
        },
    )

    // Step 1 of the staged chain flow.
    .get(
        "/coins/:id/assignments/:marketId/chains/new",
        { params: marketParam },
        async ({ params, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/coins");
            }
            return (
                <ChainPicker coinId={params.id} marketId={params.marketId} />
            );
        },
    )

    // Step 2 of the staged chain flow.
    .get(
        "/coins/:id/assignments/:marketId/chains/select",
        {
            params: marketParam,
            query: t.Object({ chainId: t.Integer() }),
        },
        async ({ params, query, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/coins");
            }

            const { data: chain, error } = await lister
                .chain({ id: query.chainId })
                .get();
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
    )

    // Searchable, paginated (5) list of not-yet-linked chains.
    .get(
        "/coins/:id/assignments/:marketId/available-chains",
        { params: marketParam, query: listChainSelectSchema },
        async ({ params, query, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/coins");
            }

            const { data, error } = await lister["chain-link"][
                "available-chains"
            ].get({
                query: {
                    ...query,
                    marketId: params.marketId,
                    limit: 5,
                    searchBy: "name",
                    orderBy: "name",
                    order: "asc",
                },
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
    )

    // Chain step 3: append only the new row plus the empty-state partial.
    .post(
        "/coins/:id/assignments/:marketId/chains",
        {
            params: marketParam,
            body: t.Object({ chainId: t.Integer() }),
        },
        async ({ params, body, hx }) => {
            const { data: link, error } = await lister["chain-link"].post({
                marketId: params.marketId,
                chainId: body.chainId,
            });

            if (error || !link) {
                if (isConflict(error)) {
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

            const { data: links, error: listError } = await lister[
                "chain-link"
            ].detailed.get({
                query: { marketId: params.marketId },
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
    )

    // Toggle deposit/withdraw on a chain link (no swap on success).
    .patch(
        "/coins/:id/assignments/:marketId/chains/:chainLinkId",
        {
            params: chainLinkParam,
            body: t.Object({
                depositEnabled: t.Optional(formBoolean),
                withdrawEnabled: t.Optional(formBoolean),
            }),
        },
        async ({ params, body, hx }) => {
            const depositEnabled = toBoolean(body.depositEnabled);
            const withdrawEnabled = toBoolean(body.withdrawEnabled);

            const { error } = await lister["chain-link"]({
                id: params.chainLinkId,
            }).patch({
                depositEnabled,
                withdrawEnabled,
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
                            depositEnabled !== undefined
                                ? !depositEnabled
                                : undefined,
                        withdrawEnabled:
                            withdrawEnabled !== undefined
                                ? !withdrawEnabled
                                : undefined,
                    },
                });
                return status("No Content");
            }

            return status("No Content");
        },
    )

    // Unassign a chain (the delete control removes its own row).
    .delete(
        "/coins/:id/assignments/:marketId/chains/:chainLinkId",
        { params: chainLinkParam },
        async ({ params, hx }) => {
            const { error } = await lister["chain-link"]({
                id: params.chainLinkId,
            }).delete();

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
    );
