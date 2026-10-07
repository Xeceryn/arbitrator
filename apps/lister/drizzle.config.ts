import { defineConfig } from "drizzle-kit";

const dbUrl = () => {
    return (
        Bun.env.DATABASE_URL ||
        "postgres://postgres:postgres@localhost:5432/arbitrator"
    );
};

export default defineConfig({
    out: "./migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: dbUrl(),
    },
    schema: "./src/**/*.sql.ts",
});
