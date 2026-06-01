"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getServiceRoleClient, isAdminUser } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type SignInState = { error: string | null };

export async function signIn(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  if (!isSupabaseConfigured()) {
    return {
      error:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "Invalid email or password." };
  }

  // Enforce admin membership. Non-admin accounts are signed out immediately.
  const allowed = await isAdminUser(data.user.id);
  if (!allowed) {
    await supabase.auth.signOut();
    return {
      error: "This account is not authorized to access the admin dashboard.",
    };
  }

  redirect("/admin");
}

/** Legacy alias for HEAD references. */
export const login = signIn;

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

/** Legacy alias for HEAD references. */
export const logout = signOut;

// ── Generic CRUD (service role; called only from admin pages behind requireAdmin) ──
const PUBLIC_PATHS = ["/", "/courses", "/services", "/offers", "/gallery", "/testimonials", "/blog", "/contact"];

function revalidatePublic() {
  for (const p of PUBLIC_PATHS) revalidatePath(p, "layout");
}

export async function saveRow(table: string, id: string | null, values: Record<string, unknown>) {
  const db = getServiceRoleClient();
  if (id) {
    const { error } = await db.from(table).update(values).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await db.from(table).insert(values);
    if (error) return { error: error.message };
  }
  revalidatePublic();
  return { ok: true };
}

export async function deleteRow(table: string, id: string) {
  const db = getServiceRoleClient();
  const { error } = await db.from(table).delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePublic();
  return { ok: true };
}
