import { readdir } from "node:fs/promises";

import { $ } from "bun";

async function build_css() {
    await $`bunx -y tailwindcss -i ./assets/styles/styles.css -o ./public/css/styles.css --minify`;
}

async function bundle_external_scripts() {
    const dirs = "./assets/lib";
    const files = await readdir(dirs);
    const result = await Bun.build({
        entrypoints: files.map((file) => `${dirs}/${file}`),
        outdir: "public/dist",
        target: "browser",
        minify: true,
    });
    console.log(
        result.outputs
            .map(
                (output) => `${output.path.split("ui").pop()} | ${output.type}`,
            )
            .join("\n"),
        "\n",
    );
}

// async function transpile_scripts() {
//   const dirs = "./assets/scripts";
//   const transpiler = new Bun.Transpiler({ loader: "ts" });
//   const files = await readdir(dirs);
//   // for (const file of files) {
//   //   const content = await readFile(`${dirs}/${file}`, "utf-8");
//   //   const result = await transpiler.transform(content);
//   //   await writeFile(`./public/dist/${file.replace(".ts", ".js")}`, result);
//   //   console.log(`Transpiled ${file}`);
//   // }
//   await Promise.all(
//     files.map(async (file) => {
//       const content = await readFile(`${dirs}/${file}`, "utf-8");
//       const result = await transpiler.transform(content);
//       await writeFile(`./public/dist/${file.replace(".ts", ".js")}`, result);
//       console.log(`Transpiled ${file}`);
//     }),
//   );
//   console.log();
// }

async function bundleScripts() {
    const dirs = "./assets/scripts";
    const files = await readdir(dirs);
    const result = await Bun.build({
        entrypoints: files.map((file) => `${dirs}/${file}`),
        outdir: "public/dist",
        target: "browser",
        minify: true,
    });
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
    await Promise.all([
        build_css(),
        bundle_external_scripts(),
        // transpile_scripts(),
        bundleScripts(),
    ]);
    const end = Date.now();
    console.log(`Bundling completed in ${end - start}ms`);
}
