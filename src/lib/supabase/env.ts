// ─────────────────────────────────────────────────────────────────────────────
// Supabase environment access.
//
// Centralizes reading + validating the Supabase env vars so the rest of the app
// can fail gracefully (instead of crashing the whole site) when they are not
// configured. The public values are safe to expose to the browser; the service
// role key is read in a server-only module (./admin.ts).
// ─────────────────────────────────────────────────────────────────────────────

export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function getSupabaseAnonKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

/** True when the public client can be constructed (URL + anon key present). */
export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

/** Reads the public config or throws a clear, actionable error. */
export function requirePublicSupabaseConfig(): { url: string; anonKey: string } {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment (e.g. Vercel project settings).",
    );
  }
  return { url, anonKey };
}
