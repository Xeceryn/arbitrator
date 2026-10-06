import z from "zod";

// Define the schema for your environment variables
const envSchema = z.object({
  // Server configuration
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  LISTER_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(65535))
    .default(3001),
  LISTER_HOST_FROM_CLIENT: z.string().default("localhost"),
  LISTER_HOST_FROM_SERVER: z.string().default("localhost"),
  LISTER_POSTGRES_HOST: z.string().default("localhost"),
  LISTER_POSTGRES_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(65535))
    .default(5432),
  LISTER_POSTGRES_USER: z.string().default("postgres"),
  LISTER_POSTGRES_PASSWORD: z.string().default("postgres"),
  LISTER_POSTGRES_DB: z.string().default("lister"),

  // Database configuration
  DATABASE_URL: z.url("DATABASE_URL must be a valid URL"),
  DB_HOST: z.string().min(1, "DB_HOST is required"),
  DB_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(65535)),
  DB_NAME: z.string().min(1, "DB_NAME is required"),
  DB_USER: z.string().min(1, "DB_USER is required"),
  DB_PASSWORD: z.string().min(1, "DB_PASSWORD is required"),

  // External services
  REDIS_URL: z.url("REDIS_URL must be a valid URL"),
  // Feature flags
  ENABLE_LOGGING: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .default(true),
  DEBUG: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .default(true),

  // Optional environment variables
  APP_NAME: z.string().default("My App"),
  LOG_LEVEL: z.enum(["error", "warn", "info", "debug"]).default("info"),
});

// Infer the type from the schema
export type EnvConfig = z.infer<typeof envSchema>;

// Validate environment variables
function validateEnv(): EnvConfig {
  try {
    return envSchema.parse(Bun.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Environment validation failed:", error);

      process.exit(1);
    }
    throw error;
  }
}

// Export validated environment variables
export const EnvLoader = validateEnv();
// Optional: Create a function to validate specific subsets
