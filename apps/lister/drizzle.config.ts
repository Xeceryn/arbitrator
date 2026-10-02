import { defineConfig } from "drizzle-kit";

const dbUrl = () => {
  return (
    Bun.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/lister"
  );
};

export default defineConfig({
  strict: true,
  verbose: true,
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://sulthonuladib:123456@localhost:5432/lister",
  },
  schema: "./src/**/*.sql.ts",
});
