import z from "zod";

/**
 * The single, typed environment surface for the monorepo.
 *
 * Import `env` (or the helpers) instead of reaching into `process.env` /
 * `Bun.env`. Bun loads the `.env` of the *current* directory before the entry
 * module runs, so `env` is populated by the time anything imports it; every
 * variable has a development default, so a bare checkout works.
 *
 * Secrets and optional integration keys are `.optional()` and come back as
 * `undefined` when unset (or blank), so callers can check truthiness and skip
 * the integration rather than failing.
 */

/** A trimmed string that collapses a blank value to `undefined`. */
const optionalString = z.preprocess(
    (value) =>
        typeof value === "string" && value.trim() === "" ? undefined : value,
    z.string().trim().optional(),
);

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),

    // Postgres
    DATABASE_URL: z
        .string()
        .min(1)
        .default("postgres://postgres:postgres@localhost:5432/arbitrator"),
    DATABASE_HOST: z.string().default("localhost"),
    DATABASE_PORT: z.coerce.number().int().default(5432),
    DATABASE_USER: z.string().default("postgres"),
    DATABASE_PASSWORD: z.string().default("postgres"),
    DATABASE_NAME: z.string().default("arbitrator"),

    // RabbitMQ
    AMQP_URL: optionalString,
    RABBITMQ_URL: optionalString,
    AMQP_EXCHANGE: z.string().default("arbitrator"),

    // Redis
    REDIS_URL: z.string().default("redis://localhost:6379"),

    // Services
    LISTER_URL: z.string().default("http://localhost:3001"),
    SENDER_URL: z.string().default("http://localhost:3002"),
    PORT: z.coerce.number().int().default(3000),
    RECEIVER_WORKER: z.string().default("src/index.ts"),

    // External APIs / venue keys (absent -> the integration is skipped)
    CMC_API_KEY: optionalString,
    MEXC_API_KEY: optionalString,
    MEXC_API_SECRET: optionalString,
    OKX_API_KEY: optionalString,
    OKX_API_SECRET: optionalString,
    OKX_API_PASSPHRASE: optionalString,
    BYBIT_API_KEY: optionalString,
    BYBIT_API_SECRET: optionalString,

    // nginx TLS reverse proxy
    LOCAL_DOMAIN: z.string().default("localhost"),
    UI_UPSTREAM: z.string().default("host.docker.internal:3000"),
    NGINX_HTTP_PORT: z.coerce.number().int().default(80),
    NGINX_HTTPS_PORT: z.coerce.number().int().default(443),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        const issues = parsed.error.issues
            .map((issue) => {
                const path = issue.path.join(".") || "(root)";
                return `  - ${path}: ${issue.message}`;
            })
            .join("\n");
        throw new Error(`Invalid environment variables:\n${issues}`);
    }
    return parsed.data;
}

/** Validated environment, evaluated once at import time. */
export const env: Env = loadEnv();

/** RabbitMQ URL, honoring the legacy `RABBITMQ_URL` alias. */
export function amqpUrl(): string {
    return (
        env.AMQP_URL ??
        env.RABBITMQ_URL ??
        "amqp://arbitrator:arbitrator@localhost:5672"
    );
}

/** lister base URL. */
export function listerUrl(): string {
    return env.LISTER_URL;
}

/** sender base URL. */
export function senderUrl(): string {
    return env.SENDER_URL;
}
