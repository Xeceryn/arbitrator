import { aot } from "elysia/plugin/aot/bun";

import { bundleClientSideResources } from "./src/bundler";

/**
 * AOT is off for the same reason as lister/sender: `elysia@2.0.0-rc.0`'s
 * plugin crashes or produces a bundle that dies at startup for this graph
 * (global `derive` in the htmx plugin / codec schemas). The entry already
 * exports `app` and guards its side effects with `inAotBuild()`, so flipping
 * this flag is the only change needed once upstream is fixed.
 */
const AOT = false;

// Generate the browser assets (Tailwind CSS, bundled scripts) into ./public so
// the runtime image can serve them without a Tailwind toolchain.
await bundleClientSideResources();

// Bundle the Elysia server itself, with ahead-of-time compiled routes: `aot()`
// evaluates `src/main.ts` (exporting `app`) and emits the precompiled handlers,
// so the server skips per-route JIT compilation on the first request.
const result = await Bun.build({
    entrypoints: ["./src/main.ts"],
    outdir: "./dist",
    target: "bun",
    plugins: AOT ? [aot("./src/main.ts", { target: "bun" })] : [],
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
