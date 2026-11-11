import { readdir, rm } from "node:fs/promises";

import { $ } from "bun";

const DIST = "public/dist";

async function build_css() {
    await $`bunx -y tailwindcss -i ./assets/styles/styles.css -o ./public/css/styles.css --minify`;
}

/**
 * Every browser entry is requested by the pages as `/public/dist/<name>.js`
 * (see `helpers/BaseLayout.tsx`), so the output has to stay flat. `Bun.build`
 * otherwise mirrors the entrypoint path once it finds a project root — with
 * `apps/ui/package.json` + `tsconfig.json` present, `./assets/scripts/x.ts`
 * lands in `public/dist/assets/scripts/x.js` and the page 404s. Pin `root` and
 * `naming` to keep the flat layout the templates expect.
 */
async function bundle_dir(dirs: string) {
    const files = await readdir(dirs);
    const result = await Bun.build({
        entrypoints: files.map((file) => `${dirs}/${file}`),
        root: dirs,
        outdir: DIST,
        naming: "[name].js",
        target: "browser",
        // One IIFE per entry: these load as classic <script> tags, so top-level
        // names would otherwise share the global scope and collide.
        format: "iife",
        minify: true,
    });

    // Without this, a failed entry is only missing from `outputs` and the image
    // ships with a 404ing asset instead of failing the build.
    if (!result.success) {
        for (const log of result.logs) console.error(log);
        throw new Error(`Bundling ${dirs} failed`);
    }

    console.log(
        result.outputs
            .map(
                (output) => `${output.path.split("ui").pop()} | ${output.type}`,
            )
            .join("\n"),
        "\n",
    );
}

export async function bundleClientSideResources() {
    const start = Date.now();
    // Start from a clean directory: a file left over from an older output
    // layout otherwise hides the breakage in dev while the (dockerignored)
    // production context 404s.
    await rm(DIST, { recursive: true, force: true });
    await Promise.all([
        build_css(),
        bundle_dir("./assets/lib"),
        bundle_dir("./assets/scripts"),
    ]);
    const end = Date.now();
    console.log(`Bundling completed in ${end - start}ms`);
}
