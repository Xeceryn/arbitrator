import { lister } from "@arbitrator/sdk";
import { Elysia, redirect, status } from "elysia";
import z from "zod";

import { listChainSelectSchema } from "../../../lister/src/core/chain/chain.schema";
import { BaseLayout } from "../helpers/BaseLayout";
import { htmx } from "../plugins/htmx";
import { addErrorMessage, createPushURL, validationMessages } from "../utils";
import { ChainEditModalContent } from "../views/components/ChainEditModalContent";
import { ChainTableRow } from "../views/components/ChainTableRow";
import { ValidationErrorList } from "../views/components/FormErrors";
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

export const ChainController = new Elysia({
    name: "chain",
    tags: ["chains"],
})
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
            return <ChainResults {...query} />;
        },
    )

    .get(
        "/chain/:id/edit-modal",
        {
            params: z.object({
                id: z.coerce.number(),
            }),
        },
        async ({ params, hx }) => {
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
            params: z.object({
                id: z.coerce.number(),
            }),
            body: chainUpdateBody,
        },
        async ({ params, body, hx }) => {
            const { data, error } = await lister
                .chain({ id: params.id })
                .patch(body);
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
    )

    .delete(
        "/chain/:id",
        {
            params: z.object({
                id: z.coerce.number(),
            }),
        },
        async ({ params, hx }) => {
            const { error } = await lister.chain({ id: params.id }).delete();
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
    )

    .post(
        "/chain",
        {
            body: chainForm,
        },
        async ({ body, hx }) => {
            const parsed = chainBody.safeParse(body);
            if (!parsed.success) {
                const messages = validationMessages(parsed.error);
                hx.triggerEvent({
                    "chain-validation-error": {
                        fields: messages.map(({ field }) => field),
                    },
                });
                return status(422, <ValidationErrorList messages={messages} />);
            }

            const { data, error } = await lister.chain.post(parsed.data);
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
