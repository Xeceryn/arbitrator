import html from "@elysiajs/html";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { Elysia } from "elysia";

import { BaseLayout } from "../helpers/BaseLayout";
import { PageHeading } from "../views/components/PageHeading";
import { InternalServerErrorPage, NotFoundPage } from "../views/pages/Error";

export const ErrorPageController = new Elysia()
  .use(html())
  .use(htmx())
  .get("/not-found", async ({ hx }) => {
    if (hx.isHTMX) {
      return (
        <>
          <PageHeading heading="Not Found" oob />
          <NotFoundPage />
        </>
      );
    }
    return (
      <BaseLayout title="Not Found" heading="Not Found">
        <NotFoundPage />
      </BaseLayout>
    );
  })
  .get("/internal-server-error", async ({ hx }) => {
    if (hx.isHTMX) {
      return (
        <>
          <PageHeading heading="Internal Server Error" oob />
          <InternalServerErrorPage />
        </>
      );
    }
    return (
      <BaseLayout title="Internal Server Error" heading="Internal Server Error">
        <InternalServerErrorPage />
      </BaseLayout>
    );
  });
