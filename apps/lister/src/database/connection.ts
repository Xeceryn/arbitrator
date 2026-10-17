import { env } from "@arbitrator/env-loader";
import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

import { logger } from "../logger";
import { relations } from "./relations";

export const postgresConnection = new SQL({
    adapter: "postgres",
    url: env.DATABASE_URL,
    onconnect() {
        logger.info("postgresql connected");
    },
    onclose() {
        logger.info("postgresql disconnected");
    },
});

export const database = drizzle({
    client: postgresConnection,
    relations: relations,
    // logger: true,
});

export type DB = typeof database;
