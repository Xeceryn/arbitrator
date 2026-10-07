import { listerClient } from "@arbitrator/sdk";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { Elysia, redirect, status } from "elysia";
import z from "zod";

import { listChainSelectSchema } from "../../../lister/src/core/chain/chain.schema";
import { BaseLayout } from "../helpers/BaseLayout";
import { createPushURL } from "../utils";
import { ChainEditModalContent } from "../views/components/ChainEditModalContent";
import { ChainTableRow } from "../views/components/ChainTableRow";
import { PageHeading } from "../views/components/PageHeading";
import { ChainPage, ChainResults } from "../views/pages/ChainPage";

const chainBody = z.object({
    name: z.string().min(1),
    code: z.string().min(1),
});

const chainUpdateBody = chainBody.partial();

export const ChainController = new Elysia()
    .use(htmx())

    .get(
        "/chain",
        ({ query, hx }) => {
            hx.pushURL(createPushURL("/chain", query));
            if (!hx.isHTMX) {
                return (
                    <BaseLayout title="arbitmage - Chains" heading="Chains">
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
                update_chain_success: null,
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

    .post(
        "/chain",
        async ({ body, hx }) => {
            const [error, data] = await listerClient.chain.add(body);
            if (error || !data) {
                hx.triggerEvent({
                    "make-toast": {
                        level: "error",
                        message: "failed to add chain",
                    },
                });
                return status("No Content");
            }

            hx.triggerEvent({
                "make-toast": { level: "success", message: "Chain added" },
                "add-chain-success": null,
            });
            return <ChainTableRow {...data} />;
        },
        {
            body: chainBody,
        },
    );
