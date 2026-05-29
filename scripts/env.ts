// Loads .env.local (preferred) then .env, mirroring Next.js precedence, so the
// scripts pick up the same variables the app uses. Import this FIRST.
import { config } from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";

for (const file of [".env.local", ".env"]) {
  const p = path.join(process.cwd(), file);
  if (existsSync(p)) config({ path: p });
}
