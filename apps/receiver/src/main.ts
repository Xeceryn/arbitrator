const cpus = navigator.hardwareConcurrency;
// const cpus = 4;
const children: Bun.Subprocess[] = [];

// In local development the worker is the TypeScript source. A built image ships
// a bundle instead, so it sets RECEIVER_WORKER to e.g. `dist/index.js`.
const worker = Bun.env.RECEIVER_WORKER ?? "src/index.ts";

for (let index = 0; index < cpus; index++) {
  children.push(
    Bun.spawn({
      cmd: ["bun", "run", worker, "--cluster"],
      stdout: "inherit",
      stderr: "inherit",
      stdin: "inherit",
    }),
  );
}

/**
 * on parent exit code (SIGTERM etc),
 */
function kill() {
  for (const child of children) {
    child.kill();
  }
}

function shutdown() {
  kill();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
process.on("exit", kill);
