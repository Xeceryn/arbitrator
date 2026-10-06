const cpus = navigator.hardwareConcurrency;
// const cpus = 2;
const children: Bun.Subprocess[] = [];

for (let index = 0; index < cpus; index++) {
  children.push(
    Bun.spawn({
      cmd: ["bun", "run", "src/concurrent.ts", "--cluster"],
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

process.on("SIGINT", kill);
process.on("exit", kill);
