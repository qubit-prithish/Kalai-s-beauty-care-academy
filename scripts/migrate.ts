/**
 * Applies every .sql file in supabase/migrations (in filename order) to the
 * HOSTED Supabase Postgres via DATABASE_URL. No Docker / no local stack.
 *
 * Tracks applied files in a _migrations table so re-runs are idempotent.
 *   Usage: npm run db:migrate
 */
import "./env";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { Client } from "pg";

const MIGRATIONS_DIR = path.join(process.cwd(), "supabase", "migrations");

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url || url.includes("YOUR-")) {
    console.error(
      "✗ DATABASE_URL is not set. Add the pooled connection string to .env.local first.",
    );
    process.exit(1);
  }

  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  await client.query(`
    create table if not exists public._migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    );
  `);

  const applied = new Set(
    (await client.query("select name from public._migrations")).rows.map(
      (r) => r.name as string,
    ),
  );

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  let count = 0;
  for (const file of files) {
    if (applied.has(file)) {
      console.log(`• skip   ${file} (already applied)`);
      continue;
    }
    const sql = readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8");
    process.stdout.write(`→ apply  ${file} ... `);
    try {
      await client.query("begin");
      await client.query(sql);
      await client.query("insert into public._migrations(name) values ($1)", [
        file,
      ]);
      await client.query("commit");
      console.log("ok");
      count++;
    } catch (e) {
      await client.query("rollback");
      console.error("FAILED\n", (e as Error).message);
      await client.end();
      process.exit(1);
    }
  }

  await client.end();
  console.log(`\n✓ Done. ${count} migration(s) applied, ${files.length} total.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
