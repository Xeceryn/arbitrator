import { aot } from "elysia/plugin/aot/bun";

/**
 * Production bundle with Elysia **ahead-of-time** compilation.
 *
 * `aot()` evaluates `src/index.ts` at build time (the entry exports `app`) and
 * emits precompiled route handlers, so the server does not JIT-compile routes on
 * the first request: lower startup time and lower peak memory. Side effects
 * (listen, scheduler, orchestrator bootstrap) are guarded with `inAotBuild()`.
 *
 * `strip: false` is required on `elysia@2.0.0-rc.0`: the default `strip: 'auto'`
 * stubs internal modules (cookie signing in `cookie/crypto.mjs`) that
 * `ws/route.mjs` still imports, so the bundle fails to build with
 * `No matching export … hasSyncHmac`, and codec response schemas crash the
 * bundle at startup with `The superclass is not a constructor`. Keep it.
 */
const result = await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    target: "bun",
    plugins: [aot("./src/index.ts", { target: "bun", strip: false })],
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
