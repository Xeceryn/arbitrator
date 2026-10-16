import { serverTiming } from "@elysiajs/server-timing";
import staticPlugin from "@elysiajs/static";
import { faker } from "@faker-js/faker";
import { htmx } from "@gtramontina.com/elysia-htmx";
import { Elysia, redirect } from "elysia";

import { bundleClientSideResources } from "./bundler";
import {
    AssignmentController,
    ChainController,
    ExchangeController,
    SignalController,
    WorkersController,
} from "./controllers";
import { CryptocurrencyController } from "./controllers/coin.controller";
import { ErrorPageController } from "./controllers/error-page.controller";
import { HomeController } from "./controllers/home.controller";
import { clientsPlugin } from "./plugins/clients";

if (!process.argv.includes("--cluster")) {
    await bundleClientSideResources();
}

const port = Number(process.env.PORT ?? 3000);

new Elysia({ websocket: { perMessageDeflate: true } })
    .onError(({ code, error, request, set }) => {
        if (code === "NOT_FOUND") {
            // Browsers silently probe paths we don't define (e.g. Chrome's
            // `/.well-known/appspecific/com.chrome.devtools.json`, `robots.txt`,
            // `favicon.ico`). Those are not page navigations, so redirecting them to
            // `/not-found` just floods the logs with requests the user never made.
            // Only send real navigations and htmx swaps to the not-found page.
            const isHTMX = request.headers.get("hx-request") === "true";
            const isDocumentNavigation =
                request.headers.get("sec-fetch-dest") === "document";

            if (isHTMX || isDocumentNavigation) {
                return redirect("/not-found");
            }

            set.status = 404;
            return "Not Found";
        }
        if (code === "VALIDATION") {
            console.log(error);
        }
        if (code === "INTERNAL_SERVER_ERROR" || code === "UNKNOWN") {
            console.error(`Unhandled error (${code}):`, error);

            const isHTMX =
                request.headers.get("hx-request") === "true" ||
                request.headers.get("hx-boosted") === "true";

            if (isHTMX) {
                // htmx follows the redirect, so a 302 would make the final
                // status 200 and every `hx-status:5xx` guard unreachable.
                // Answer with a real 5xx so the guards fire, and force
                // `HX-Reswap: none` so even an unguarded `hx-swap="delete"`
                // cannot remove the caller's row. The toast tells the user
                // that the action failed.
                set.status = 500;
                set.headers["HX-Reswap"] = "none";
                set.headers["HX-Trigger"] = JSON.stringify({
                    "make-toast": {
                        level: "error",
                        message: "Something went wrong. Try again.",
                    },
                });
                return "";
            }

            return redirect("/internal-server-error");
        }
    })
    .use(htmx())
    .onBeforeHandle(({ set, request }) => {
        console.log(request.url);
        set.headers["content-type"] = "text/html; charset=utf-8";
    })
    .use(staticPlugin({ prefix: "/public", assets: "./public" }))
    .use(serverTiming())
    .use(clientsPlugin)
    .use(ErrorPageController)
    .use(HomeController)
    .use(CryptocurrencyController)
    .use(ExchangeController)
    .use(ChainController)
    .use(AssignmentController)
    .use(WorkersController)
    .use(SignalController)
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

    .listen(port, ({ hostname, port }) => {
        console.log(
            `UI running on http://${hostname}:${port} with PID ${process.pid}`,
        );
    });
