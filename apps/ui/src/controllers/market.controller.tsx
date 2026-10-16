import { listerClient } from "@arbitrator/sdk";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { Elysia, redirect, status } from "elysia";
import z from "zod";

import { listExchangeSelectSchema } from "../../../lister/src/core/exchange/exchange.schema";
import { BaseLayout } from "../helpers/BaseLayout";
import { addErrorMessage, createPushURL, validationMessages } from "../utils";
import { ExchangeEditModalContent } from "../views/components/ExchangeEditModalContent";
import { ValidationErrorList } from "../views/components/FormErrors";
import { MarketTableRow } from "../views/components/MarketTableRow";
import { PageHeading } from "../views/components/PageHeading";
import { MarketPage, MarketResults } from "../views/pages/MarketPage";

/** Form bodies arrive as strings, so coerce before handing them to the API. */
const exchangeBody = z.object({
    cmcId: z.coerce.number().int().positive("Enter a positive CMC ID."),
    name: z.string().min(1, "Enter the exchange name."),
    slug: z.string().min(1, "Enter the CoinMarketCap slug."),
    logo: z.string().min(1, "Add a logo URL."),
    baseCurrency: z.enum(["usdt", "idr"]),
    registeredOnCmc: z
        .union([z.literal("true"), z.literal("false")])
        .transform((value) => value === "true"),
});

const exchangeUpdateBody = exchangeBody.partial();

/** Loose shape for the route so validation failures can render inline. */
const exchangeForm = z.object({
    cmcId: z.optional(z.string()),
    name: z.optional(z.string()),
    slug: z.optional(z.string()),
    logo: z.optional(z.string()),
    baseCurrency: z.optional(z.string()),
    registeredOnCmc: z.optional(z.string()),
});

export const ExchangeController = new Elysia()
    .use(htmx())

    .get(
        "/markets",
        ({ query, hx }) => {
            hx.pushURL(createPushURL("/markets", query));
            if (!hx.isHTMX) {
                return (
                    <BaseLayout
                        title="Arbitrator - Exchanges"
                        heading="Exchanges"
                    >
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
            const [error, data] = await listerClient.exchange.findById(
                params.id,
            );
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
                "exchange-updated": {},
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
            const parsed = exchangeBody.safeParse(body);
            if (!parsed.success) {
                const messages = validationMessages(parsed.error);
                hx.triggerEvent({
                    "market-validation-error": {
                        fields: messages.map(({ field }) => field),
                    },
                });
                return status(
                    422,
                    <ValidationErrorList messages={messages} />,
                );
            }

            const [error, data] = await listerClient.exchange.add(parsed.data);
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
                return status(
                    422,
                    <ValidationErrorList messages={messages} />,
                );
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
        {
            body: exchangeForm,
        },
    );
