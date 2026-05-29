/**
 * Creates (or updates) the single admin auth user via the Auth Admin REST API
 * (service role) and registers the user id in public.admins via DATABASE_URL.
 * Uses plain fetch + pg to avoid supabase-js realtime/WebSocket init issues in
 * Node. The password is read from the environment at runtime — never hardcoded.
 *
 *   ADMIN_PASSWORD=yourStrongPassword npm run admin:create
 */
import "./env";
import { Client } from "pg";

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const dbUrl = process.env.DATABASE_URL;

  if (!url || !serviceKey || !email || !dbUrl) {
    console.error("✗ Missing SUPABASE URL / SERVICE ROLE / ADMIN_EMAIL / DATABASE_URL.");
    process.exit(1);
  }
  if (!password || password.length < 8) {
    console.error("✗ Set a strong ADMIN_PASSWORD (>=8 chars): ADMIN_PASSWORD=... npm run admin:create");
    process.exit(1);
  }

  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    "Content-Type": "application/json",
  };
  const base = `${url}/auth/v1/admin/users`;

  // Look up existing user by email.
  let userId: string | undefined;
  const listRes = await fetch(`${base}?per_page=200`, { headers });
  if (listRes.ok) {
    const body = (await listRes.json()) as { users?: { id: string; email?: string }[] };
    userId = body.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
  }

  if (userId) {
    const up = await fetch(`${base}/${userId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ password, email_confirm: true }),
    });
    if (!up.ok) {
      console.error("✗ update user failed:", await up.text());
      process.exit(1);
    }
    console.log(`• Admin user existed; password reset for ${email}.`);
  } else {
    const cr = await fetch(base, {
      method: "POST",
      headers,
      body: JSON.stringify({ email, password, email_confirm: true }),
    });
    if (!cr.ok) {
      console.error("✗ create user failed:", await cr.text());
      process.exit(1);
    }
    const created = (await cr.json()) as { id: string };
    userId = created.id;
    console.log(`✓ Created admin auth user ${email}.`);
  }

  if (!userId) {
    console.error("✗ Could not resolve admin user id.");
    process.exit(1);
  }

  const pg = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await pg.connect();
  await pg.query(
    `insert into public.admins(user_id, email) values ($1, $2)
     on conflict (user_id) do update set email = excluded.email`,
    [userId, email],
  );
  await pg.end();

  console.log(`✓ Registered ${email} in public.admins. Admin is ready.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
