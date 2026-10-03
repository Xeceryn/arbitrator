import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

import { relations } from "./relations";

const url = () => {
  return (
    Bun.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/arbitrator"
  );
};
export const postgresConnection = new SQL(url());

export const database = drizzle({
  client: postgresConnection,
  relations: relations,
  // logger: true,
});

export type DB = typeof database;
