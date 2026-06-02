/**
 * Verifies the hosted B1 setup (no Docker/CLI). Uses pg for DB-level checks and
 * plain fetch against PostgREST for anon RLS checks (avoids supabase-js realtime
 * init issues in Node).
 *  - tables exist; seed counts (11 courses, 8 services); 5 storage buckets
 *  - anon CAN read published rows, CANNOT write, CAN insert an enquiry but
 *    CANNOT read enquiries
 */
import "./env";
import { Client } from "pg";

const ok = (b: boolean) => (b ? "PASS" : "FAIL");

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!dbUrl || dbUrl.includes("YOUR-")) {
    console.error("✗ DATABASE_URL missing/invalid — cannot verify. STOP.");
    process.exit(1);
  }

  const results: string[] = [];

  // ── Direct DB checks ─────────────────────────────────────────────────────
  const pg = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await pg.connect();

  const tableNames = [
    "courses","services","gallery","testimonials","offers",
    "faqs","enquiries","settings","page_views","admins",
    "about_page", "about_why_choose_us", "about_facilities", "about_trainers",
  ];
  const tablesRes = await pg.query(
    `select table_name from information_schema.tables
     where table_schema='public' and table_name = any($1)`,
    [tableNames],
  );
  const present = new Set(tablesRes.rows.map((r) => r.table_name));
  results.push(`Tables present (${present.size}/${tableNames.length}): ${ok(tableNames.every((t) => present.has(t)))}`);

  const courseCount = Number((await pg.query("select count(*) from public.courses")).rows[0].count);
  const serviceCount = Number((await pg.query("select count(*) from public.services")).rows[0].count);
  const testiCount = Number((await pg.query("select count(*) from public.testimonials")).rows[0].count);
  const offerCount = Number((await pg.query("select count(*) from public.offers")).rows[0].count);
  const faqCount = Number((await pg.query("select count(*) from public.faqs")).rows[0].count);
  const aboutPageCount = Number((await pg.query("select count(*) from public.about_page")).rows[0].count);
  
  results.push(`Seed — courses=${courseCount}/11, services=${serviceCount}/8, testimonials=${testiCount}, offers=${offerCount}, faqs=${faqCount}, about_page=${aboutPageCount}/1: ${ok(courseCount === 11 && serviceCount === 8 && aboutPageCount === 1)}`);

  const buckets = (await pg.query("select id from storage.buckets where id = any($1)", [["gallery","courses","services","banners","about"]])).rows.map((r) => r.id);
  results.push(`Storage buckets (${buckets.length}/5): ${ok(buckets.length === 5)}`);

  const rlsOff = (await pg.query(
    `select count(*) from pg_tables where schemaname='public' and tablename = any($1) and rowsecurity = false`,
    [tableNames],
  )).rows[0].count;
  results.push(`RLS enabled on all tables: ${ok(Number(rlsOff) === 0)}`);

  await pg.end();

  // ── Anon checks via PostgREST (fetch) ────────────────────────────────────
  if (supaUrl && anonKey) {
    const rest = `${supaUrl}/rest/v1`;
    const anonHeaders = { apikey: anonKey, Authorization: `Bearer ${anonKey}` };

    const readRes = await fetch(`${rest}/courses?select=slug&published=eq.true&limit=20`, { headers: anonHeaders });
    const readRows = readRes.ok ? ((await readRes.json()) as unknown[]) : [];
    results.push(`Anon read published courses (${readRows.length}): ${ok(readRes.ok && readRows.length > 0)}`);

    const writeRes = await fetch(`${rest}/courses`, {
      method: "POST",
      headers: { ...anonHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ slug: "hack-" + Date.now(), name_en: "x", name_ta: "x" }),
    });
    results.push(`Anon BLOCKED from writing courses (HTTP ${writeRes.status}): ${ok(writeRes.status === 401 || writeRes.status === 403)}`);

    const enqRes = await fetch(`${rest}/enquiries`, {
      method: "POST",
      // return=minimal: anon can INSERT but NOT SELECT back (enquiries are
      // admin-read only). This mirrors what the real frontend form sends.
      headers: { ...anonHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ name: "Verify Bot", phone: "9999999999", message: "verify", page_source: "verify-script" }),
    });
    results.push(`Anon CAN insert enquiry (HTTP ${enqRes.status}): ${ok(enqRes.status === 201)}`);

    const enqReadRes = await fetch(`${rest}/enquiries?select=id&limit=1`, { headers: anonHeaders });
    const enqReadRows = enqReadRes.ok ? ((await enqReadRes.json()) as unknown[]) : [];
    results.push(`Anon BLOCKED from reading enquiries (rows=${enqReadRows.length}): ${ok(enqReadRows.length === 0)}`);

    // Clean up the test enquiry via service role (matches our marker).
    if (serviceKey) {
      await fetch(`${rest}/enquiries?page_source=eq.verify-script`, {
        method: "DELETE",
        headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` },
      });
    }
  } else {
    results.push("Anon checks SKIPPED (missing anon key).");
  }

  console.log("\n=== B1 VERIFICATION ===");
  results.forEach((r) => console.log(" • " + r));
  const failed = results.some((r) => r.endsWith("FAIL"));
  console.log(failed ? "\nRESULT: FAIL" : "\nRESULT: ALL PASS");
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
