import { spawn, execSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const clientJs = path.join(root, "node_modules", ".prisma", "client", "index.js");
const schemaFile = path.join(root, "prisma", "schema.prisma");
const imagesDir = path.join(root, "apps", "web", "public", "images", "products");

function run(command, env = {}) {
  execSync(command, {
    cwd: root,
    stdio: "inherit",
    shell: true,
    env: { ...process.env, ...env },
  });
}

export function ensureEnv() {
  const envPath = path.join(root, ".env");
  const examplePath = path.join(root, ".env.example");
  if (!fs.existsSync(envPath) && fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log("Created .env from .env.example");
  }
}

function clientExists() {
  return fs.existsSync(clientJs);
}

function schemaIsNewerThanClient() {
  if (!clientExists()) return true;
  return fs.statSync(schemaFile).mtimeMs > fs.statSync(clientJs).mtimeMs;
}

function generatePrismaClient() {
  if (!schemaIsNewerThanClient()) {
    return;
  }

  try {
    run("npx prisma generate");
  } catch (error) {
    if (clientExists()) {
      console.log("Prisma client is already available; continuing without regenerating.");
      return;
    }
    throw error;
  }
}

function productImageCount() {
  if (!fs.existsSync(imagesDir)) return 0;
  return fs.readdirSync(imagesDir).filter((name) => /\.(jpe?g|png|webp)$/i.test(name)).length;
}

function ensureProductImages() {
  const count = productImageCount();
  if (count >= 20) {
    return;
  }

  console.log("Product photos are missing — downloading catalog images…");
  try {
    run("node scripts/download-product-images.mjs");
  } catch {
    console.warn(
      "Could not download product photos (network required once). The store still runs; products may show placeholders until photos are present under apps/web/public/images/products/."
    );
  }
}

export function setupDatabase() {
  ensureEnv();
  generatePrismaClient();
  run("npx prisma db push --skip-generate");
  run("npx prisma db seed");
  ensureProductImages();
}

function apiIsReady(port = 3001) {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${port}/api/health`, { timeout: 800 }, (res) => {
      res.resume();
      resolve(res.statusCode === 200);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

function startNpmScript(script, env = {}) {
  const child = spawn(`npm run ${script}`, {
    cwd: root,
    stdio: "inherit",
    shell: true,
    windowsHide: true,
    env: { ...process.env, ...env },
  });

  const stop = () => {
    if (child.pid) {
      try {
        if (process.platform === "win32") {
          execSync(`taskkill /pid ${child.pid} /T /F`, { stdio: "ignore" });
        } else {
          child.kill("SIGTERM");
        }
      } catch {
        child.kill();
      }
    }
  };

  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
}

/** Force the ports Vite's proxy expects, even if an old .env set PORT=3000. */
function developmentEnv() {
  return {
    NODE_ENV: "development",
    PORT: "3001",
    // Leave unset so API CORS accepts any localhost / 127.0.0.1 Vite port.
    CLIENT_ORIGIN: "",
  };
}

export async function startDev() {
  const env = developmentEnv();
  const apiReady = await apiIsReady(3001);
  if (apiReady) {
    console.log("API already running at http://127.0.0.1:3001");
    console.log("Starting the storefront…");
    console.log("Open http://127.0.0.1:5173");
    startNpmScript("dev:web", env);
    return;
  }

  console.log("Starting Harbor…");
  console.log("  Storefront  http://127.0.0.1:5173");
  console.log("  API         http://127.0.0.1:3001");
  startNpmScript("dev:serve", env);
}

const invoked =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invoked) {
  setupDatabase();
}
