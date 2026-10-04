import * as Path from "node:path";

import { aot } from "elysia/plugin/aot/bun";

const mainfile = Path.join(__dirname, "./main.ts");

const { outputs } = await Bun.build({
  entrypoints: [mainfile],
  outdir: Path.join(__dirname, "../dist"),
  target: "bun",
  plugins: [aot(mainfile)],
});

console.log(outputs);
