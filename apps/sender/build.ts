import { aot } from "elysia/plugin/aot/bun";

/**
 * Production bundle.
 *
 * AOT (`aot()`) is **disabled** here: the plugin's build-time replay evaluates
 * the entry, which boots the orchestrator (worker pool + AMQP consumer) and the
 * nested replay build fails with `Bundle failed` on `elysia@2.0.0-rc.0`.
 * Retention: flip `AOT` to `true` once the orchestrator bootstrap can be kept
 * completely inert at build time (`inAotBuild()` guards already exist in
 * `src/index.ts`), and re-check `bun dist/index.js`.
 */
const AOT = false;

const result = await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    target: "bun",
    plugins: AOT ? [aot("./src/index.ts", { target: "bun" })] : [],
});

if (!result.success) {
    for (const log of result.logs) console.error(log);
    process.exit(1);
}

console.log(
    result.outputs
        .map((output) => `${output.path} | ${output.type}`)
        .join("\n"),
);
