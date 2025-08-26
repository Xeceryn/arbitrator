import { drizzle } from "drizzle-orm/bun-sql";

export const postgresConnection = new Bun.SQL(
  "postgres://sulthonuladib:123456@localhost:5432/lister",
);
export const database = drizzle(postgresConnection);
