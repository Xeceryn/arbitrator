import { env } from "@arbitrator/env-loader";
import type { App } from "@arbitrator/lister/app";
import { treaty } from "@elysia/eden";

/**
 * Eden Treaty client for the lister HTTP surface.
 *
 * Every call returns `{ data, error }`: `data` is `null` when `error` is set,
 * `error` is `null` on success. The types come from lister's `App` instance, so
 * a new lister route shows up here with no codegen.
 */
export const lister = treaty<App>(env.LISTER_URL);
