import { htmx } from "@gtramontina.com/elysia-htmx";
import { Suspense } from "@kitajs/html/suspense";
import { Elysia } from "elysia";
import html from "@elysiajs/html";
import { Html } from "@kitajs/html";
import { Signal } from "../views/pages/Signal";
import { BaseLayout } from "../helpers/BaseLayout";

export const SignalController = new Elysia()
  .onError((error) => {
    switch (error.code) {
      case "UNKNOWN":
        console.log("Unknown error", error);
        return error.error;
      case "NOT_FOUND":
        console.log("Not found", error);
        break;
      case "INTERNAL_SERVER_ERROR":
        console.log("Internal server error", error);
        break;
      case "PARSE":
        console.log("Parse error", error);
        break;
      default:
        console.log("Unhandled error", error.code);
        break;
    }
  })
  .use(html())
  .use(htmx())
  .get("/signal", async ({ hx }) => {
    if (hx.isHTMX) {
      return (
        <>
          <title>Signal</title>
          <Signal />
        </>
      );
    }

    return (
      <BaseLayout title="Signal">
        <Signal />
      </BaseLayout>
    );
  });
