import { bundleClientSideResources } from "./src/bundler";

// Generate the browser assets (Tailwind CSS, bundled scripts) into ./public so
// the runtime image can serve them without a Tailwind toolchain.
await bundleClientSideResources();

// Bundle the Elysia server itself.
const result = await Bun.build({
    entrypoints: ["./src/main.ts"],
    outdir: "./dist",
    target: "bun",
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
