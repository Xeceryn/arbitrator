import { aot } from "elysia/plugin/aot/bun";

/**
 * Production bundle with Elysia **ahead-of-time** compilation.
 *
 * `aot()` evaluates `src/index.ts` at build time (the entry exports `app`) and
 * emits precompiled route handlers, so the server does not JIT-compile routes on
 * the first request: lower startup time and lower peak memory. Side effects
 * (listen, scheduler, orchestrator bootstrap) are guarded with `inAotBuild()`.
 *
 * Depends on `patches/elysia@2.0.0-rc.0.patch`, which fixes three bugs in the
 * AOT plugin (see that file and `docs/elysia-2-migration.md`). Drop the patch
 * and retest on the next `elysia` release; until then, deleting it makes the
 * build fail or the bundle crash at startup.
 */
const result = await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "./dist",
    target: "bun",
    plugins: [aot("./src/index.ts", { target: "bun" })],
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
