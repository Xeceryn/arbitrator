import { aot } from "elysia/plugin/aot/bun";

import { bundleClientSideResources } from "./src/bundler";

/**
 * `strip: false` is required on `elysia@2.0.0-rc.0` (see lister/sender): the
 * default `strip: 'auto'` stubs cookie signing that `ws/route.mjs` — pulled in
 * by `websocket()` for the signal/worker streams — still imports, so the build
 * fails with `No matching export … hasSyncHmac`.
 */
const AOT = true;

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
    plugins: AOT ? [aot("./src/main.ts", { target: "bun", strip: false })] : [],
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
