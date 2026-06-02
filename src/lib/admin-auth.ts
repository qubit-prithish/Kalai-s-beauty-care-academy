import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/supabase/admin";

/** 
 * Returns the admin user if authenticated and authorized. 
 * Use this in Route Handlers where you want to return a JSON error instead of redirecting.
 */
export async function getAdminUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, error: "Unauthorized", status: 401 };
  
  const allowed = await isAdminUser(user.id);
  if (!allowed) return { user: null, error: "Forbidden", status: 403 };
  
  return { user, error: null };
}

/** Returns the admin user or redirects to /admin/login. Checks public.admins. */
export async function requireAdmin() {
  const { user, error, status } = await getAdminUser();
  
  if (error) {
    if (status === 403) {
      const supabase = await createClient();
      await supabase.auth.signOut();
    }
    redirect("/admin/login");
  }
  
  return user!;
}
