"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Browser Supabase client (for Client Components).
//
// Uses the public anon key and reads/writes the auth session from cookies so it
// stays in sync with the server. Create a fresh client per call site; the
// underlying library memoizes the auth state via cookies.
// ─────────────────────────────────────────────────────────────────────────────

import { createBrowserClient } from "@supabase/ssr";
import { requirePublicSupabaseConfig } from "./env";

export function createClient() {
  const { url, anonKey } = requirePublicSupabaseConfig();
  return createBrowserClient(url, anonKey);
}
