import { Elysia, redirect, status, t } from "elysia";

import { listCryptocurrencySelectSchema } from "../../../lister/src/core/cryptocurrency/cryptocurrency.schema";
import { BaseLayout } from "../helpers/BaseLayout";
import { clientsPlugin } from "../plugins/clients";
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
import {
    CoinWorkspace,
    CoinWorkspaceIdentity,
} from "../views/components/CoinWorkspace";
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
    cmcId: t.Optional(t.Union([t.String(), t.Number()])),
    logo: t.Optional(t.String()),
});

export const CryptocurrencyController = new Elysia({
    name: "cryptocurrency",
    tags: ["coins"],
})
    .use(clientsPlugin)
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
                    <BaseLayout title="Arbitrator - Coins" heading="Coins">
                        <CoinPage {...resolvedQuery(query)} />
                    </BaseLayout>
                );
            }
            return (
                <>
                    <PageHeading heading="Coins" oob />
                    <title>Coins</title>
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
        async ({ params, lister }) => {
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
            body: t.Omit(addCoinForm, ["logo"]),
            query: t.Object({ view: t.Optional(t.Literal("workspace")) }),
        },
        async ({ params, body, query, hx, lister }) => {
            const parsed = formParse(
                t.Partial(t.Omit(addCoinBody, ["logo"])),
                body,
            );
            if (!parsed.ok) {
                hx.triggerEvent({
                    "coin-validation-error": {
                        fields: parsed.messages.map(({ field }) => field),
                    },
                });
                return status(
                    422,
                    <ValidationErrorList messages={parsed.messages} />,
                );
            }

            const { data, error } = await lister
                .cryptocurrency({ id: params.id })
                .patch(parsed.value);
            if (error || !data) {
                if (error && error.status < 500) {
                    const messages =
                        error.status === 404
                            ? [
                                  {
                                      field: "",
                                      message:
                                          "This coin no longer exists. Close the editor and refresh the list.",
                                  },
                              ]
                            : [addErrorMessage("coin", error, "save")];
                    hx.triggerEvent({
                        "coin-validation-error": {
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
                            "Unable to save the coin. Your changes are still here. Try again.",
                    },
                });
                return status(502, "");
            }

            hx.triggerEvent({
                "make-toast": {
                    level: "success",
                    message: `${data.name} updated`,
                },
                "coin-updated": { id: data.id },
            });
            return query.view === "workspace" ? (
                <CoinWorkspaceIdentity coin={data} />
            ) : (
                <CoinTableRow {...data} />
            );
        },
    )

    .get(
        "/coins/:id/routes",
        {
            params: t.Object({ id: t.Integer() }),
        },
        async ({ params, hx, lister }) => {
            const { data: coin, error: coinError } = await lister
                .cryptocurrency({ id: params.id })
                .get();
            if (coinError || !coin) {
                if (!hx.isHTMX)
                    return redirect(
                        coinError?.status === 404
                            ? "/not-found"
                            : "/internal-server-error",
                    );
                hx.triggerEvent({
                    "make-toast": { level: "error", message: "coin not found" },
                });
                return status("No Content");
            }

            const { data: routeData, error: routesError } = await lister
                .cryptocurrency({ id: params.id })
                .routes.get();
            if (routesError || !routeData) {
                if (!hx.isHTMX) return redirect("/internal-server-error");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "failed to load transfer routes",
                    },
                });
                return status("No Content");
            }

            return hx.isHTMX ? (
                <>
                    <CoinRoutePanel data={routeData} />
                    <CoinRouteHeader coin={coin} oob />
                </>
            ) : (
                <BaseLayout
                    title={`Arbitrator - ${coin.name} routes`}
                    heading="Coins"
                >
                    <CoinWorkspace coin={coin} active="routes">
                        <CoinRoutePanel data={routeData} />
                    </CoinWorkspace>
                </BaseLayout>
            );
        },
    )

    .get(
        "/coins/:id/edit-modal",
        {
            params: t.Object({ id: t.Integer() }),
            query: t.Object({ view: t.Optional(t.Literal("workspace")) }),
        },
        async ({ params, query, hx, lister }) => {
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
                return status("No Content");
            }

            return (
                <CryptocurrencyEditModalContent
                    coinId={params.id}
                    workspace={query.view === "workspace"}
                    {...data}
                />
            );
        },
    )

    .delete(
        "/coins/:id",
        { params: t.Object({ id: t.Integer() }) },
        async ({ params, hx, lister }) => {
            const { data, error } = await lister
                .cryptocurrency({ id: params.id })
                .delete();
            if (error || !data) {
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message:
                            "Unable to delete the coin. Refresh the list and try again.",
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
                "coin-deleted": { target: "body", id: data.id },
            });
            return "";
        },
    )

    .post(
        "/coins",
        {
            body: addCoinForm,
        },
        async ({ body, hx, lister }) => {
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
