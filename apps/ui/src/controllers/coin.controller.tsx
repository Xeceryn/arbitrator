import { lister } from "@arbitrator/sdk";
import { Elysia, redirect, status } from "elysia";
import z from "zod";

import {
    cryptocurrencyUpdateSchema,
    listCryptocurrencySelectSchema,
} from "../../../lister/src/core/cryptocurrency/cryptocurrency.schema";
import { BaseLayout } from "../helpers/BaseLayout";
import { htmx } from "../plugins/htmx";
import { addErrorMessage, createPushURL, validationMessages } from "../utils";
import {
    CoinRouteHeader,
    CoinRoutePanel,
} from "../views/components/CoinRoutePanel";
import { CoinTableRow } from "../views/components/CoinTableRow";
import { CryptocurrencyEditModalContent } from "../views/components/CryptoCurrencyEditModalContent";
import { ValidationErrorList } from "../views/components/FormErrors";
import { PageHeading } from "../views/components/PageHeading";
import { CoinPage, CoinResults } from "../views/pages/CryptocurrencyPage";

/**
 * Add form body. HTML sends strings, so `cmcId` is coerced; the other fields
 * must be non-empty. Kept separate from the API insert schema so validation
 * failures can be rendered inline instead of as an Elysia 422 envelope.
 */
const addCoinBody = z.object({
    name: z.string().min(1, "Enter the coin name."),
    symbol: z.string().min(1, "Enter the ticker symbol."),
    slug: z.string().min(1, "Enter the CoinMarketCap slug."),
    cmcId: z.coerce.number().int().positive("Enter a positive CMC ID."),
    logo: z.string().min(1, "Add a logo URL."),
});

export const CryptocurrencyController = new Elysia({
    name: "cryptocurrency",
    tags: ["coins"],
})
    .use(htmx())
    .get(
        "/coins",
        {
            query: listCryptocurrencySelectSchema,
        },
        ({ query, hx }) => {
            hx.pushURL(createPushURL("/coins", query));
            if (!hx.isHTMX) {
                return (
                    <BaseLayout
                        title="Arbitrator - Cryptocurrencies"
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
    )

    .get(
        "coins/list",
        {
            query: listCryptocurrencySelectSchema,
        },
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
    )

    .get(
        "coins/:id",
        {
            params: z.object({
                id: z.coerce.number(),
            }),
        },
        async ({ params }) => {
            const { data, error } = await lister
                .cryptocurrency({ id: params.id })
                .get();
            if (error || !data) {
                return error?.status === 404
                    ? redirect("/not-found")
                    : redirect("/internal-server-error");
            }
            return <CoinTableRow {...data} />;
        },
    )

    .patch(
        "/coins/:id/edit",
        {
            params: z.object({
                id: z.coerce.number(),
            }),
            body: cryptocurrencyUpdateSchema,
        },
        async ({ params, body, hx }) => {
            console.log("/coins/:id/edit", params, body);

            hx.triggerEvent({
                "make-toast": {
                    level: "info",
                    message: "Coin Updated",
                },
                "coin-updated": {},
            });

            const { data, error } = await lister
                .cryptocurrency({ id: params.id })
                .patch(body);
            if (error || !data) {
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
    )

    .get(
        "/coins/:id/routes",
        {
            params: z.object({
                id: z.coerce.number(),
            }),
        },
        async ({ params, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/coins");
            }

            const { data: coin, error: coinError } = await lister
                .cryptocurrency({ id: params.id })
                .get();
            if (coinError || !coin) {
                hx.triggerEvent({
                    "make-toast": { level: "error", message: "coin not found" },
                });
                return status("No Content");
            }

            const { data: routeData, error: routesError } = await lister
                .cryptocurrency({ id: params.id })
                .routes.get();
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
    )

    .get(
        "/coins/:id/edit-modal",
        {
            params: z.object({
                id: z.coerce.number(),
            }),
        },
        async ({ params, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/coins");
            }
            const { data, error } = await lister
                .cryptocurrency({ id: params.id })
                .get();
            if (!data || error) {
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "coin not found",
                    },
                });
            }

            return (
                <CryptocurrencyEditModalContent coinId={params.id} {...data} />
            );
        },
    )

    .post(
        "/coins",
        {
            body: z.object({
                name: z.optional(z.string()),
                symbol: z.optional(z.string()),
                slug: z.optional(z.string()),
                cmcId: z.optional(z.string()),
                logo: z.optional(z.string()),
            }),
        },
        async ({ body, hx }) => {
            const parsed = addCoinBody.safeParse(body);
            if (!parsed.success) {
                const messages = validationMessages(parsed.error);
                hx.triggerEvent({
                    "coin-validation-error": {
                        fields: messages.map(({ field }) => field),
                    },
                });
                return status(422, <ValidationErrorList messages={messages} />);
            }

            const { data, error } = await lister.cryptocurrency.post(
                parsed.data,
            );
            if (error || !data) {
                const messages = [addErrorMessage("coin", error)];
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "Failed to add coin",
                    },
                    "coin-validation-error": {
                        fields: messages
                            .map(({ field }) => field)
                            .filter(Boolean),
                    },
                });
                return status(422, <ValidationErrorList messages={messages} />);
            }

            hx.triggerEvent({
                "make-toast": { level: "success", message: "Coin added" },
                "coin-created": { id: data.id },
            });
            // Smallest fragment: the new row. The partials clear the modal's
            // error region and drop the empty-state row when it is present.
            return (
                <>
                    <CoinTableRow {...data} />
                    <hx-partial
                        hx-target="#coin-table-empty"
                        hx-swap="delete"
                    ></hx-partial>
                    <hx-partial
                        hx-target="#add-coin-error"
                        hx-swap="innerHTML"
                    ></hx-partial>
                </>
            );
        },
    );
