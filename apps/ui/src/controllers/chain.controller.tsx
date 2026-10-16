import { listerClient } from "@arbitrator/sdk";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { Elysia, redirect, status } from "elysia";
import z from "zod";

import { listChainSelectSchema } from "../../../lister/src/core/chain/chain.schema";
import { BaseLayout } from "../helpers/BaseLayout";
import { addErrorMessage, createPushURL, validationMessages } from "../utils";
import { ChainEditModalContent } from "../views/components/ChainEditModalContent";
import { ValidationErrorList } from "../views/components/FormErrors";
import { ChainTableRow } from "../views/components/ChainTableRow";
import { PageHeading } from "../views/components/PageHeading";
import { ChainPage, ChainResults } from "../views/pages/ChainPage";

const chainBody = z.object({
    name: z.string().min(1, "Enter the chain name."),
    code: z.string().min(1, "Enter the chain code."),
});

const chainUpdateBody = chainBody.partial();

/** Loose shape for the route so validation failures can render inline. */
const chainForm = z.object({
    name: z.optional(z.string()),
    code: z.optional(z.string()),
});

export const ChainController = new Elysia()
    .use(htmx())

    .get(
        "/chain",
        ({ query, hx }) => {
            hx.pushURL(createPushURL("/chain", query));
            if (!hx.isHTMX) {
                return (
                    <BaseLayout title="Arbitrator - Chains" heading="Chains">
                        <ChainPage {...query} />
                    </BaseLayout>
                );
            }
            return (
                <>
                    <PageHeading heading="Chains" oob />
                    <title>Chains</title>
                    <ChainPage {...query} />
                </>
            );
        },
        {
            query: listChainSelectSchema,
        },
    )

    .get(
        "chain/list",
        async ({ query, hx }) => {
            hx.pushURL(createPushURL("/chain", query));
            if (!hx.isHTMX) {
                return redirect(createPushURL("/chain", query));
            }
            return <ChainResults {...query} />;
        },
        {
            query: listChainSelectSchema,
        },
    )

    .get(
        "/chain/:id/edit-modal",
        async ({ params, hx }) => {
            if (!hx.isHTMX) {
                return redirect("/chain");
            }
            const [error, data] = await listerClient.chain.findById(params.id);
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
        {
            params: z.object({
                id: z.coerce.number(),
            }),
        },
    )

    .patch(
        "/chain/:id/edit",
        async ({ params, body, hx }) => {
            const [error, data] = await listerClient.chain.update({
                id: params.id,
                payload: body,
            });
            if (error || !data) {
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "failed to update chain",
                    },
                });
                return status("No Content");
            }

            hx.triggerEvent({
                "make-toast": { level: "success", message: "Chain updated" },
                "chain-updated": {},
            });
            return <ChainTableRow {...data} />;
        },
        {
            params: z.object({
                id: z.coerce.number(),
            }),
            body: chainUpdateBody,
        },
    )

    .delete(
        "/chain/:id",
        async ({ params, hx }) => {
            const [error] = await listerClient.chain.remove(params.id);
            if (error) {
                hx.reswap("none");
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "failed to delete chain",
                    },
                });
                return status("No Content");
            }

            hx.triggerEvent({
                "make-toast": { level: "success", message: "Chain deleted" },
            });
            return status("OK");
        },
        {
            params: z.object({
                id: z.coerce.number(),
            }),
        },
    )

    .post(
        "/chain",
        async ({ body, hx }) => {
            const parsed = chainBody.safeParse(body);
            if (!parsed.success) {
                const messages = validationMessages(parsed.error);
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

            const [error, data] = await listerClient.chain.add(parsed.data);
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
                return status(
                    422,
                    <ValidationErrorList messages={messages} />,
                );
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
        {
            body: chainForm,
        },
    );
