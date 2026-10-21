import { lister } from "@arbitrator/sdk";
import { Elysia, redirect, status, t } from "elysia";

import { listExchangeSelectSchema } from "../../../lister/src/core/exchange/exchange.schema";
import { BaseLayout } from "../helpers/BaseLayout";
import { htmx } from "../plugins/htmx";
import {
    addErrorMessage,
    createPushURL,
    formBoolean,
    formParse,
    resolvedQuery,
    toBoolean,
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

/** Route body of the edit form: the same fields, coerced instead of enforced. */
const exchangeUpdateBody = t.Partial(
    t.Object({
        cmcId: t.Integer({ minimum: 1 }),
        name: t.String({ minLength: 1 }),
        slug: t.String({ minLength: 1 }),
        logo: t.String({ minLength: 1 }),
        baseCurrency: t.Union([t.Literal("usdt"), t.Literal("idr")]),
        registeredOnCmc: formBoolean,
    }),
);

/** Loose route body: every field is posted as a string (or not at all). */
const exchangeForm = t.Object({
    cmcId: t.Optional(t.String()),
    name: t.Optional(t.String()),
    slug: t.Optional(t.String()),
    logo: t.Optional(t.String()),
    baseCurrency: t.Optional(t.String()),
    registeredOnCmc: t.Optional(t.String()),
});

export const ExchangeController = new Elysia({
    name: "exchange",
    tags: ["markets"],
})
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
        async ({ params, hx }) => {
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
            body: exchangeUpdateBody,
        },
        async ({ params, body, hx }) => {
            const { data, error } = await lister
                .exchange({ id: params.id })
                .patch({
                    ...body,
                    registeredOnCmc: toBoolean(body.registeredOnCmc),
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
                "exchange-updated": {},
            });
            return <MarketTableRow {...data} />;
        },
    )

    .post(
        "/markets",
        {
            body: exchangeForm,
        },
        async ({ body, hx }) => {
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
