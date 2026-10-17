import { env } from "@arbitrator/env-loader";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: env.DATABASE_URL,
    },
    schema: "./src/**/*.sql.ts",
});
