// script to clean up node modules inside ./apps and ./packages
import * as fs from "node:fs/promises";
import * as path from "node:path";

const workspaces = ["apps", "packages"] as const;

async function removeNodeModules(dir: string) {
  const target = path.join(dir, "node_modules");

  try {
    await fs.access(target);
  } catch {
    return;
  }

  console.log(`removing ${target}`);
  await fs.rm(target, { recursive: true, force: true });
}

async function cleanWorkspace(parent: string) {
  const entries = await fs.readdir(parent, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      await removeNodeModules(path.join(parent, entry.name));
    }
  }
}

async function main() {
  for (const workspace of workspaces) {
    await cleanWorkspace(workspace);
  }

  // root
  await removeNodeModules(".");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
