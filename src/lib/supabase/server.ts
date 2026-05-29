import "server-only";

// ─────────────────────────────────────────────────────────────────────────────
// Server Supabase client (for Server Components, Server Actions, Route Handlers).
//
// Bridges Supabase auth to Next.js cookies. In Server Components the cookie
// store is read-only, so writes are wrapped in try/catch — session refresh in
// those cases is handled by the middleware (see ./middleware.ts).
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requirePublicSupabaseConfig } from "./env";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = requirePublicSupabaseConfig();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component where cookies are read-only.
          // The middleware refreshes the session cookies on every request,
          // so this can be safely ignored.
        }
      },
    },
  });
}
