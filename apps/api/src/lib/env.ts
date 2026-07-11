import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
dotenv.config({ path: path.join(repoRoot, ".env") });

const dbFile = path.join(repoRoot, "prisma", "dev.db").replace(/\\/g, "/");
process.env.DATABASE_URL = `file:${dbFile}`;
