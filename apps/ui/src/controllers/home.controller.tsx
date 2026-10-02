import html from "@elysiajs/html";
import { htmx } from "@gtramontina.com/elysia-htmx";
import Elysia from "elysia";

import { BaseLayout } from "../helpers/BaseLayout";
import { Home } from "../views/pages/Home";

export const HomeController = new Elysia()
  .use(html())
  .use(htmx())
  .get("/home", async ({ hx }) => {
    if (hx.isHTMX) {
      return (
        <>
          <title>Home</title>
          <Home />
        </>
      );
    }
    return (
      <BaseLayout title="Home">
        <Home />
      </BaseLayout>
    );
  });
