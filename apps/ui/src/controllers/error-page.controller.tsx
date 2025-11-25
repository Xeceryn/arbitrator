import { Elysia } from "elysia";
import { BaseLayout } from "../helpers/BaseLayout";
import { InternalServerErrorPage, NotFoundPage } from "../views/pages/Error";
import { htmx } from "@gtramontina.com/elysia-htmx";
import html from "@elysiajs/html";

export const ErrorPageController = new Elysia()
  .use(html())
  .use(htmx())
  .get("/not-found", async ({ hx }) => {
    if (hx.isHTMX) {
      return <NotFoundPage />;
    }
    return (
      <BaseLayout title="Not Found">
        <NotFoundPage />
      </BaseLayout>
    );
  })
  .get("/internal-server-error", async ({ hx }) => {
    if (hx.isHTMX) {
      return <InternalServerErrorPage />;
    }
    return (
      <BaseLayout title="Internal Server Error">
        <InternalServerErrorPage />
      </BaseLayout>
    );
  });
