import { htmx } from "@gtramontina.com/elysia-htmx";
import Elysia from "elysia";
import { Home } from "../views/pages/Home";
import { BaseLayout } from "../helpers/BaseLayout";
import html from "@elysiajs/html";

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
