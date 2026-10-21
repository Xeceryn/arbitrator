import { env } from "@arbitrator/env-loader";
import { openapi } from "@elysia/openapi";
import { serverTiming } from "@elysia/server-timing";
import { staticPlugin } from "@elysia/static";
import { faker } from "@faker-js/faker";
import { Elysia, inAotBuild, redirect } from "elysia";
import { websocket } from "elysia/websocket";

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
import { htmx } from "./plugins/htmx";

/**
 * Browser assets (CSS, scripts) are generated at boot. An AOT build evaluates
 * this module for its route graph only, and `--cluster` workers must not race
 * each other writing `public/`.
 */
if (!process.argv.includes("--cluster") && !inAotBuild()) {
    await bundleClientSideResources();
}

const port = env.PORT;

const app = new Elysia()
    .use(
        openapi({
            documentation: {
                info: { title: "Arbitrator UI", version: "1.0.50" },
            },
            // `/public` is build output: CSS and browser bundles, not an API.
            // `staticFile: true` alone does not drop plugin-registered static
            // routes in this RC, so the prefix is excluded by path too.
            exclude: {
                staticFile: true,
                paths: ["/public", /^\/public\//],
            },
        }),
    )
    .use(websocket({ perMessageDeflate: true }))
    .onError(({ error, request, set }) => {
        // Elysia v2 drops the `code` context member: the token now lives on the
        // error itself (`not-found`, `validation`, `parse`, `internal-server-error`).
        const code = (error as { code?: string }).code ?? "unknown";

        if (code === "not-found") {
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
        if (code === "validation") {
            console.log(error);
        }
        if (code === "internal-server-error" || code === "unknown") {
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
        // Static assets carry their own content-type from the static plugin;
        // stamping text/html on them makes browsers refuse the stylesheet.
        if (request.url.includes("/public/")) return;
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
    .get("/", { detail: { tags: ["ui"] } }, () => {
        return redirect("/home");
    })
    .get(
        "/testing/notification-toast",
        { detail: { tags: ["ui"] } },
        ({ set, hx }) => {
            hx.triggerEvent({
                "make-toast": {
                    level: "info",
                    message: faker.lorem.sentence(),
                },
            });
            set.status = "No Content";
            return;
        },
    );

/**
 * The app is exported so the AOT compiler can import the route graph without
 * side effects: `bun run build` evaluates this module to precompile the
 * handlers, and binding the port during a build would poison it.
 */
export default app;
export { app };

if (!inAotBuild()) {
    app.listen(port, ({ hostname, port }) => {
        console.log(
            `UI running on http://${hostname}:${port} with PID ${process.pid}`,
        );
    });
}
