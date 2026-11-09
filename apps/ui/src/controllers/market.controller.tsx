import { Elysia, redirect, status, t } from "elysia";

import { listExchangeSelectSchema } from "../../../lister/src/core/exchange/exchange.schema";
import { BaseLayout } from "../helpers/BaseLayout";
import { clientsPlugin } from "../plugins/clients";
import { htmx } from "../plugins/htmx";
import {
    addErrorMessage,
    createPushURL,
    formBoolean,
    formParse,
    resolvedQuery,
} from "../utils";
import { ExchangeEditModalContent } from "../views/components/ExchangeEditModalContent";
import { ValidationErrorList } from "../views/components/FormErrors";
import { MarketTableRow } from "../views/components/MarketTableRow";
import { PageHeading } from "../views/components/PageHeading";
import { MarketPage, MarketResults } from "../views/pages/MarketPage";

/**
 * Add form rules. HTML sends strings, so `cmcId` is coerced by `formParse` and
 * `registeredOnCmc` is converted from its `"true"`/`"false"` option value to a
 * boolean; the copy of every failure is rendered inline.
 */
const exchangeBody = t.Object({
    cmcId: t.Integer({ minimum: 1, error: "Enter a positive CMC ID." }),
    name: t.String({ minLength: 1, error: "Enter the exchange name." }),
    slug: t.String({ minLength: 1, error: "Enter the CoinMarketCap slug." }),
    logo: t.String({ minLength: 1, error: "Add a logo URL." }),
    baseCurrency: t.Union([t.Literal("usdt"), t.Literal("idr")], {
        error: "Choose a base currency.",
    }),
    registeredOnCmc: t.Boolean({
        error: "Choose whether the exchange is registered on CoinMarketCap.",
    }),
});

/** Loose route body: every field is posted as a string (or not at all). */
const exchangeForm = t.Object({
    cmcId: t.Optional(t.Union([t.String(), t.Number()])),
    name: t.Optional(t.String()),
    slug: t.Optional(t.String()),
    logo: t.Optional(t.String()),
    baseCurrency: t.Optional(t.String()),
    registeredOnCmc: t.Optional(formBoolean),
});

export const ExchangeController = new Elysia({
    name: "exchange",
    tags: ["markets"],
})
    .use(clientsPlugin)
    .use(htmx())

    .get(
        "/markets",
        {
            query: listExchangeSelectSchema,
        },
        ({ query, hx }) => {
            hx.pushURL(createPushURL("/markets", query));
            if (!hx.isHTMX) {
                return (
                    <BaseLayout
                        title="Arbitrator - Exchanges"
                        heading="Exchanges"
                    >
                        <MarketPage {...resolvedQuery(query)} />
                    </BaseLayout>
                );
            }
            return (
                <>
                    <PageHeading heading="Exchanges" oob />
                    <title>Exchanges</title>
                    <MarketPage {...resolvedQuery(query)} />
                </>
            );
        },
    )

    .get(
        "markets/list",
        {
            query: listExchangeSelectSchema,
        },
        async ({ query, hx }) => {
            hx.pushURL(createPushURL("/markets", query));
            if (!hx.isHTMX) {
                return redirect(createPushURL("/markets", query));
            }
            return <MarketResults {...resolvedQuery(query)} />;
        },
    )

    .get(
        "/markets/:id/edit-modal",
        {
            params: t.Object({ id: t.Integer() }),
        },
        async ({ params, hx, lister }) => {
            if (!hx.isHTMX) {
                return redirect("/markets");
            }
            const { data, error } = await lister
                .exchange({ id: params.id })
                .get();
            if (!data || error) {
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "exchange not found",
                    },
                });
                return status("No Content");
            }

            return (
                <ExchangeEditModalContent exchangeId={params.id} {...data} />
            );
        },
    )

    .patch(
        "/markets/:id/edit",
        {
            params: t.Object({ id: t.Integer() }),
            body: exchangeForm,
        },
        async ({ params, body, hx, lister }) => {
            const parsed = formParse(t.Partial(exchangeBody), body);
            if (!parsed.ok) {
                hx.triggerEvent({
                    "exchange-validation-error": {
                        fields: parsed.messages.map(({ field }) => field),
                    },
                });
                return status(
                    422,
                    <ValidationErrorList messages={parsed.messages} />,
                );
            }
            const { data, error } = await lister
                .exchange({ id: params.id })
                .patch(parsed.value);
            if (error || !data) {
                if (error && error.status < 500) {
                    const messages =
                        error.status === 404
                            ? [
                                  {
                                      field: "",
                                      message:
                                          "This exchange no longer exists. Close the editor and refresh the list.",
                                  },
                              ]
                            : [addErrorMessage("exchange", error, "save")];
                    hx.triggerEvent({
                        "exchange-validation-error": {
                            fields: messages.map(({ field }) => field),
                        },
                    });
                    return status(
                        422,
                        <ValidationErrorList messages={messages} />,
                    );
                }
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message:
                            "Unable to save the exchange. Your changes are still here. Try again.",
                    },
                });
                return status(502, "");
            }

            hx.triggerEvent({
                "make-toast": {
                    level: "success",
                    message: `${data.name} updated`,
                },
                "exchange-updated": {},
            });
            return <MarketTableRow {...data} />;
        },
    )

    .delete(
        "/markets/:id",
        { params: t.Object({ id: t.Integer() }) },
        async ({ params, hx, lister }) => {
            const { data, error } = await lister
                .exchange({ id: params.id })
                .delete();
            if (error || !data) {
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message:
                            "Unable to delete the exchange. Refresh the list and try again.",
                    },
                });
                return status("No Content");
            }
            hx.triggerEvent({
                "make-toast": {
                    level: "success",
                    message: `${data.name} deleted`,
                    target: "body",
                },
                "exchange-deleted": { target: "body", id: data.id },
            });
            return "";
        },
    )

    .post(
        "/markets",
        {
            body: exchangeForm,
        },
        async ({ body, hx, lister }) => {
            const parsed = formParse(exchangeBody, body);
            if (!parsed.ok) {
                const messages = parsed.messages;
                hx.triggerEvent({
                    "market-validation-error": {
                        fields: messages.map(({ field }) => field),
                    },
                });
                return status(422, <ValidationErrorList messages={messages} />);
            }

            const { data, error } = await lister.exchange.post(parsed.value);
            if (error || !data) {
                const messages = [addErrorMessage("exchange", error)];
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "Failed to add exchange",
                    },
                    "market-validation-error": {
                        fields: messages
                            .map(({ field }) => field)
                            .filter(Boolean),
                    },
                });
                return status(422, <ValidationErrorList messages={messages} />);
            }

            hx.triggerEvent({
                "make-toast": { level: "success", message: "Exchange added" },
                "market-created": { id: data.id },
            });
            return (
                <>
                    <MarketTableRow {...data} />
                    <hx-partial
                        hx-target="#market-table-empty"
                        hx-swap="delete"
                    ></hx-partial>
                    <hx-partial
                        hx-target="#market-add-error"
                        hx-swap="innerHTML"
                    ></hx-partial>
                </>
            );
        },
    );
