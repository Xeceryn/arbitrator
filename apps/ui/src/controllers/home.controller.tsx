import html from "@elysiajs/html";
import { htmx } from "@gtramontina.com/elysia-htmx";
import Elysia from "elysia";

import { BaseLayout } from "../helpers/BaseLayout";
import { PageHeading } from "../views/components/PageHeading";
import { Home } from "../views/pages/Home";

export const HomeController = new Elysia()
    .use(html())
    .use(htmx())
    .get("/home", async ({ hx }) => {
        if (hx.isHTMX) {
            return (
                <>
                    <PageHeading heading="Home" oob />
                    <title>Home</title>
                    <Home />
                </>
            );
        }
        return (
            <BaseLayout title="Home" heading="Home">
                <Home />
            </BaseLayout>
        );
    });
