import * as fs from "node:fs/promises";

const appsDir = "apps";
const packagesDir = "packages";

type PackageJSON = {
    name: string;
    version: string;
};

async function main() {
    const apps = await fs.readdir(appsDir);
    const packages = await fs.readdir(packagesDir);

    console.log("\napps:");
    for (const app of apps) {
        const packageJson = (await Bun.file(
            `${appsDir}/${app}/package.json`,
        ).json()) as PackageJSON;

        console.log(packageJson.name);
    }

    console.log("\npackages:");
    for (const packageName of packages) {
        const packageJson = (await Bun.file(
            `${packagesDir}/${packageName}/package.json`,
        ).json()) as PackageJSON;

        console.log(packageJson.name);
    }
}

main();
