import { setupDatabase } from "./setup.mjs";
import path from "node:path";
import { spawn, execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

process.env.NODE_ENV = "production";
process.env.PORT = process.env.PORT || "3000";
if (!process.env.CLIENT_ORIGIN) {
  process.env.CLIENT_ORIGIN = "http://localhost:3000";
}

setupDatabase();

console.log("Building the storefront…");
execSync("npm run build --workspace=@ecommerce/web", {
  cwd: root,
  stdio: "inherit",
  shell: true,
});

console.log(`Starting Harbor at http://localhost:${process.env.PORT}`);

const child = spawn("npm run start --workspace=@ecommerce/api", {
  cwd: root,
  stdio: "inherit",
  shell: true,
  windowsHide: true,
  env: {
    ...process.env,
    NODE_ENV: "production",
    PORT: process.env.PORT,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  },
});

const stop = () => {
  if (child.pid && process.platform === "win32") {
    try {
      execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: "ignore" });
    } catch {
      child.kill();
    }
  } else {
    child.kill("SIGTERM");
  }
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);
child.on("exit", (code) => process.exit(code ?? 0));
