import { Elysia, redirect } from "elysia";
import staticPlugin from "@elysiajs/static";
import { faker } from "@faker-js/faker";

import { CryptocurrencyController } from "./controllers/coin.controller";
// import { SignalController } from "./controllers/signal.controller";
// import { MarketController } from "./controllers/market.controller";
import { ErrorPageController } from "./controllers/error-page.controller";
import { HomeController } from "./controllers/home.controller";
import { serverTiming } from "@elysiajs/server-timing";

import { bundleClientSideResources } from "./bundler";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { ExchangeController as ExchangeController } from "./controllers";

if (!process.argv.includes("--cluster")) {
  await bundleClientSideResources();
}

new Elysia()
  .onError((error) => {
    if (error.code === "NOT_FOUND") {
      return redirect("/not-found");
    }
    if (error.code === "VALIDATION") {
      console.log(error);
    }
    if (error.code === "INTERNAL_SERVER_ERROR") {
      return redirect("/internal-server-error");
    }
  })
  .use(htmx())
  .onBeforeHandle(({ set, request }) => {
    console.log(request.url);
    set.headers["content-type"] = "text/html; charset=utf-8";
  })
  .use(serverTiming())
  .use(ErrorPageController)
  .use(HomeController)
  .use(CryptocurrencyController)
  .use(ExchangeController)
  // .use(SignalController)
  .use(staticPlugin({ prefix: "/public", assets: "./public" }))
  .get("/", () => {
    return redirect("/home");
  })
  .get("/testing/notification-toast", ({ set, hx }) => {
    hx.triggerEvent({
      "make-toast": {
        level: "info",
        message: faker.lorem.sentence(),
      },
    });
    set.status = "No Content";
    return;
  })

  .listen(3000, ({ hostname, port }) => {
    console.log(
      `UI running on http://${hostname}:${port} with PID ${process.pid}`,
    );
  });
