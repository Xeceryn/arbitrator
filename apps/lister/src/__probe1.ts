import { cors } from "@elysia/cors";
import { openapi } from "@elysia/openapi";
import { Elysia, t } from "elysia";

export const app = new Elysia({ name: "probe1" })
    .use(cors({ origin: "*" }))
    .use(openapi({ documentation: { info: { title: "p", version: "0" } } }))
    .get("/ping", { response: { 200: t.String() } }, () => "OK");
export default app;
