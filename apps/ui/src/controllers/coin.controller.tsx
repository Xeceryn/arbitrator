import { lister } from "@arbitrator/sdk";
import { Elysia, redirect, status, t } from "elysia";

import {
    cryptocurrencyUpdateSchema,
    listCryptocurrencySelectSchema,
} from "../../../lister/src/core/cryptocurrency/cryptocurrency.schema";
import { BaseLayout } from "../helpers/BaseLayout";
import { htmx } from "../plugins/htmx";
import {
    addErrorMessage,
    createPushURL,
    formParse,
    resolvedQuery,
} from "../utils";
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
 * Add form rules. HTML sends strings, so `cmcId` is coerced by `formParse`; the
 * other fields must be non-empty. Kept separate from the API insert schema, and
 * validated in the handler, so failures render inline instead of as an Elysia
 * 422 envelope.
 */
const addCoinBody = t.Object({
    name: t.String({ minLength: 1, error: "Enter the coin name." }),
    symbol: t.String({ minLength: 1, error: "Enter the ticker symbol." }),
    slug: t.String({ minLength: 1, error: "Enter the CoinMarketCap slug." }),
    cmcId: t.Integer({ minimum: 1, error: "Enter a positive CMC ID." }),
    logo: t.String({ minLength: 1, error: "Add a logo URL." }),
});

/** Loose route body: every field is posted as a string (or not at all). */
const addCoinForm = t.Object({
    name: t.Optional(t.String()),
    symbol: t.Optional(t.String()),
    slug: t.Optional(t.String()),
    cmcId: t.Optional(t.String()),
    logo: t.Optional(t.String()),
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
                        <CoinPage {...resolvedQuery(query)} />
                    </BaseLayout>
                );
            }
            return (
                <>
                    <PageHeading heading="Cryptocurrencies" oob />
                    <title>Cryptocurrencies</title>
                    <CoinPage {...resolvedQuery(query)} />
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
            return <CoinResults {...resolvedQuery(query)} />;
        },
    )

    .get(
        "coins/:id",
        {
            params: t.Object({ id: t.Integer() }),
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
            params: t.Object({ id: t.Integer() }),
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
            params: t.Object({ id: t.Integer() }),
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
            params: t.Object({ id: t.Integer() }),
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
            body: addCoinForm,
        },
        async ({ body, hx }) => {
            const parsed = formParse(addCoinBody, body);
            if (!parsed.ok) {
                const messages = parsed.messages;
                hx.triggerEvent({
                    "coin-validation-error": {
                        fields: messages.map(({ field }) => field),
                    },
                });
                return status(422, <ValidationErrorList messages={messages} />);
            }

            const { data, error } = await lister.cryptocurrency.post(
                parsed.value,
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
