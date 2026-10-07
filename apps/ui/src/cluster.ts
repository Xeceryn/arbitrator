import { spawn } from "bun";

import { bundleClientSideResources } from "./bundler";

const cpus = navigator.hardwareConcurrency; // Number of CPU cores
const buns = new Array(cpus);

await bundleClientSideResources();

for (let i = 0; i < cpus; i++) {
    buns[i] = spawn({
        cmd: ["bun", "run", "--watch", "src/index.ts", "--cluster"],
        stdout: "inherit",
        stderr: "inherit",
        stdin: "inherit",
    });
}

function kill() {
    for (const bun of buns) {
        bun.kill();
    }
    process.exit(0);
}

process.on("SIGINT", kill);
process.on("exit", kill);
