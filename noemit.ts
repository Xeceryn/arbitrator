import * as fs from "node:fs";

import { $ } from "bun";

const APPS_DIR = "./apps";
const PACKAGES_DIR = "./packages";

const apps = fs.readdirSync(APPS_DIR);
const packages = fs.readdirSync(PACKAGES_DIR);

for (const toBuild of [...apps, ...packages]) {
    const path = `${APPS_DIR}/${toBuild}`;
    if (fs.statSync(path).isDirectory()) {
        const cmd = await $`./node_modules/.bin/tsc --noEmit --rootDir ${path}`;
        if (cmd.exitCode !== 0) {
            console.error(`Error building ${toBuild}`);
            console.error(cmd.stderr);
        }

        console.log(`Built ${toBuild}`);
    }
    console.log("not a directory, skipping");
}
