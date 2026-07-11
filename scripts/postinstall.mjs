import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientJs = path.join(root, "node_modules", ".prisma", "client", "index.js");

try {
  execSync("npx prisma generate", { cwd: root, stdio: "inherit", shell: true });
} catch {
  if (fs.existsSync(clientJs)) {
    console.warn("prisma generate skipped (client already present).");
    process.exit(0);
  }
  console.warn("prisma generate failed. Run `npx prisma generate` after install if needed.");
  process.exit(0);
}
