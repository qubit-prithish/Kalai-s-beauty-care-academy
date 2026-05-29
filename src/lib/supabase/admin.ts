import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client. BYPASSES RLS — server-only, never import into
 * client code. Use only in trusted server actions (e.g. admin operations,
 * seeding). Requires SUPABASE_SERVICE_ROLE_KEY.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
      realtime: { params: { eventsPerSecond: 0 } },
    },
  );
}
