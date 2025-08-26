import { defineConfig } from "drizzle-kit";

export default defineConfig({
  strict: true,
  verbose: true,
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://sulthonuladib:123456@localhost:5432/lister",
  },
  schema: "./src/*/*.sql.ts",
});
