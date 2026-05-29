"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function login(_prev: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { error: "Invalid email or password." };
  // Must be a registered admin.
  const { data: row } = await supabase
    .from("admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (!row) {
    await supabase.auth.signOut();
    return { error: "This account is not an admin." };
  }
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ── Generic CRUD (service role; called only from admin pages behind requireAdmin) ──
const PUBLIC_PATHS = ["/", "/courses", "/services", "/offers", "/gallery", "/testimonials", "/blog", "/contact"];

function revalidatePublic() {
  for (const p of PUBLIC_PATHS) revalidatePath(p, "layout");
}

export async function saveRow(table: string, id: string | null, values: Record<string, unknown>) {
  const db = createAdminClient();
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
  const db = createAdminClient();
  const { error } = await db.from(table).delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePublic();
  return { ok: true };
}
