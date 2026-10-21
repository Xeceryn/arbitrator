import fs from "fs";
import path from "node:path";

const appsDir = path.join(__dirname, "..", "apps");
const packagesDir = path.join(__dirname, "..", "packages");

const apps = fs.readdirSync(appsDir);
const packages = fs.readdirSync(packagesDir);

const unused_apps = ["galactus", "gate-proxy", "potential", "ticker"];
for (const app of apps) {
    if (unused_apps.includes(app)) {
        continue;
    }
    console.log(`Typechecking app ${app}`);
    await Bun.$`bun check --cwd apps/${app}`;
}

for (const thePackage of packages) {
    console.log(`Typechecking package ${thePackage}`);
    await Bun.$`bun check --cwd packages/${thePackage}`;
}
