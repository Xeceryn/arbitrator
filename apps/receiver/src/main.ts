const cpus = navigator.hardwareConcurrency;
const children: Bun.Subprocess[] = [];

for (let index = 0; index < cpus; index++) {
  children.push(
    Bun.spawn({
      cmd: ["bun", "run", "--watch", "src/index.ts", "--cluster"],
      stdout: "inherit",
      stderr: "inherit",
      stdin: "inherit",
    }),
  );
}

function kill() {
  for (const child of children) {
    child.kill();
  }
}

process.on("SIGINT", kill);
process.on("exit", kill);
