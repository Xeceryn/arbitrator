import Elysia from "elysia";

import { BaseLayout } from "../helpers/BaseLayout";
import { htmx } from "../plugins/htmx";
import { PageHeading } from "../views/components/PageHeading";
import { Home } from "../views/pages/Home";

export const HomeController = new Elysia({ name: "home", tags: ["ui"] })
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
