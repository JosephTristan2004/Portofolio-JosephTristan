// Satu perintah untuk React + server chat; tanpa skrip Bash.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const tasks = [
  ["--experimental-strip-types", "--watch", "server/index.ts"],
  [resolve(root, "node_modules/vite/bin/vite.js"), "--host", "127.0.0.1", "--port", "5173", "--strictPort"],
];
const children = [];
let stopping = false;

function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) if (!child.killed) child.kill("SIGTERM");
  process.exitCode = code;
}

for (const args of tasks) {
  const child = spawn(process.execPath, args, { cwd: root, stdio: "inherit" });
  children.push(child);
  child.on("error", (error) => {
    console.error(error.message);
    stop(1);
  });
  child.on("exit", (code) => { if (!stopping) stop(code ?? 1); });
}

process.on("SIGINT", () => stop());
process.on("SIGTERM", () => stop());
