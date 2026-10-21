import { Elysia } from "elysia";

import { database } from "../database/connection";

/**
 * The drizzle client as an Elysia resource.
 *
 * Route plugins `use` this (it is a named singleton, so registering it in
 * `src/app.ts` and in a route plugin decorates once) and read `db` from the
 * handler context instead of importing the connection module. That keeps the
 * HTTP edge swappable/testable and lets AOT compilation see one dependency.
 */
export const databasePlugin = new Elysia({ name: "database" }).decorate(
    "db",
    database,
);
