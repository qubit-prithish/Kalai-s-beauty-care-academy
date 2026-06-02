import "server-only";

// ─────────────────────────────────────────────────────────────────────────────
// Service-role Supabase client (server-only, privileged).
//
// Uses SUPABASE_SERVICE_ROLE_KEY which BYPASSES Row Level Security. NEVER import
// this from a Client Component. It is used for trusted server-side checks such
// as verifying admin membership against a fully locked-down `admins` table.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./env";

let cached: SupabaseClient | null = null;

export function getServiceRoleClient() {
  if (cached) return cached;

  const url = getSupabaseUrl();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase service role is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY in your environment (e.g. Vercel project settings).",
    );
  }

  cached = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}

/** Legacy alias for generic CRUD actions. */
export const createAdminClient = getServiceRoleClient;

/**
 * Returns true if the given auth user is an admin.
 *
 * Membership is read with the service-role key so the `admins` table can keep
 * RLS fully locked (no client access at all). Fails closed: any error or
 * missing config returns false.
 */
export async function isAdminUser(userId: string): Promise<boolean> {
  try {
    const admin = getServiceRoleClient();
    const { data, error } = await admin
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) return false;
    return Boolean(data);
  } catch {
    return false;
  }
}
