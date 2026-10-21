import { aot } from "elysia/plugin/aot/bun";

/**
 * Production bundle.
 *
 * AOT (`aot()`) is **disabled** here: every row schema carries timestamp
 * codecs (`t.Encode` for `createdAt`/`updatedAt`) so responses are validated as
 * ISO strings while the repository returns `Date`. In `elysia@2.0.0-rc.0` a
 * codec in a *response* schema makes the AOT bundle die at startup with
 * `The superclass is not a constructor` (module ordering; same crash as
 * elysiajs/elysia#2024 for literal unions). Retention: flip `AOT` to `true`
 * once that is fixed upstream and re-check `bun dist/index.js`.
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
