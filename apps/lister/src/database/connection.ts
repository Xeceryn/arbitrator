import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

import { logger } from "../logger";
import { relations } from "./relations";

const url = () => {
  return (
    Bun.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/arbitrator"
  );
};
export const postgresConnection = new SQL({
  adapter: "postgres",
  url: url(),
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
