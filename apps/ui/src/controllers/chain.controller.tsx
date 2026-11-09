import { Elysia, redirect, status, t } from "elysia";

import { listChainSelectSchema } from "../../../lister/src/core/chain/chain.schema";
import { BaseLayout } from "../helpers/BaseLayout";
import { clientsPlugin } from "../plugins/clients";
import { htmx } from "../plugins/htmx";
import {
    addErrorMessage,
    createPushURL,
    formParse,
    resolvedQuery,
} from "../utils";
import { ChainEditModalContent } from "../views/components/ChainEditModalContent";
import { ChainTableRow } from "../views/components/ChainTableRow";
import { ValidationErrorList } from "../views/components/FormErrors";
import { PageHeading } from "../views/components/PageHeading";
import { ChainPage, ChainResults } from "../views/pages/ChainPage";

/** Add form rules; `formParse` turns failures into the inline error list. */
const chainBody = t.Object({
    name: t.String({ minLength: 1, error: "Enter the chain name." }),
    code: t.String({ minLength: 1, error: "Enter the chain code." }),
});

const chainUpdateBody = t.Partial(chainBody);

/** Loose route body: every field is posted as a string (or not at all). */
const chainForm = t.Object({
    name: t.Optional(t.String()),
    code: t.Optional(t.String()),
});

export const ChainController = new Elysia({
    name: "chain",
    tags: ["chains"],
})
    .use(clientsPlugin)
    .use(htmx())

    .get(
        "/chain",
        {
            query: listChainSelectSchema,
        },
        ({ query, hx }) => {
            hx.pushURL(createPushURL("/chain", query));
            if (!hx.isHTMX) {
                return (
                    <BaseLayout title="Arbitrator - Chains" heading="Chains">
                        <ChainPage {...resolvedQuery(query)} />
                    </BaseLayout>
                );
            }
            return (
                <>
                    <PageHeading heading="Chains" oob />
                    <title>Chains</title>
                    <ChainPage {...resolvedQuery(query)} />
                </>
            );
        },
    )

    .get(
        "chain/list",
        {
            query: listChainSelectSchema,
        },
        async ({ query, hx }) => {
            hx.pushURL(createPushURL("/chain", query));
            if (!hx.isHTMX) {
                return redirect(createPushURL("/chain", query));
            }
            return <ChainResults {...resolvedQuery(query)} />;
        },
    )

    .get(
        "/chain/:id/edit-modal",
        {
            params: t.Object({ id: t.Integer() }),
        },
        async ({ params, hx, lister }) => {
            if (!hx.isHTMX) {
                return redirect("/chain");
            }
            const { data, error } = await lister.chain({ id: params.id }).get();
            if (!data || error) {
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "chain not found",
                    },
                });
                return status("No Content");
            }

            return <ChainEditModalContent chainId={params.id} {...data} />;
        },
    )

    .patch(
        "/chain/:id/edit",
        {
            params: t.Object({ id: t.Integer() }),
            body: chainForm,
        },
        async ({ params, body, hx, lister }) => {
            const parsed = formParse(chainUpdateBody, body);
            if (!parsed.ok) {
                hx.triggerEvent({
                    "chain-validation-error": {
                        fields: parsed.messages.map(({ field }) => field),
                    },
                });
                return status(
                    422,
                    <ValidationErrorList messages={parsed.messages} />,
                );
            }
            const { data, error } = await lister
                .chain({ id: params.id })
                .patch(parsed.value);
            if (error || !data) {
                if (error && error.status < 500) {
                    const messages =
                        error.status === 404
                            ? [
                                  {
                                      field: "",
                                      message:
                                          "This chain no longer exists. Close the editor and refresh the list.",
                                  },
                              ]
                            : [addErrorMessage("chain", error, "save")];
                    hx.triggerEvent({
                        "chain-validation-error": {
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
                            "Unable to save the chain. Your changes are still here. Try again.",
                    },
                });
                return status(502, "");
            }

            hx.triggerEvent({
                "make-toast": {
                    level: "success",
                    message: `${data.name} updated`,
                },
                "chain-updated": {},
            });
            return <ChainTableRow {...data} />;
        },
    )

    .delete(
        "/chain/:id",
        {
            params: t.Object({ id: t.Integer() }),
        },
        async ({ params, hx, lister }) => {
            const { data, error } = await lister
                .chain({ id: params.id })
                .delete();
            if (error || !data) {
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message:
                            "Unable to delete the chain. Refresh the list and try again.",
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
                "chain-deleted": { target: "body", id: data.id },
            });
            return "";
        },
    )

    .post(
        "/chain",
        {
            body: chainForm,
        },
        async ({ body, hx, lister }) => {
            const parsed = formParse(chainBody, body);
            if (!parsed.ok) {
                const messages = parsed.messages;
                hx.triggerEvent({
                    "chain-validation-error": {
                        fields: messages.map(({ field }) => field),
                    },
                });
                return status(422, <ValidationErrorList messages={messages} />);
            }

            const { data, error } = await lister.chain.post(parsed.value);
            if (error || !data) {
                const messages = [addErrorMessage("chain", error)];
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "Failed to add chain",
                    },
                    "chain-validation-error": {
                        fields: messages
                            .map(({ field }) => field)
                            .filter(Boolean),
                    },
                });
                return status(422, <ValidationErrorList messages={messages} />);
            }

            hx.triggerEvent({
                "make-toast": { level: "success", message: "Chain added" },
                "chain-created": { id: data.id },
            });
            return (
                <>
                    <ChainTableRow {...data} />
                    <hx-partial
                        hx-target="#chain-table-empty"
                        hx-swap="delete"
                    ></hx-partial>
                    <hx-partial
                        hx-target="#chain-add-error"
                        hx-swap="innerHTML"
                    ></hx-partial>
                </>
            );
        },
    );
