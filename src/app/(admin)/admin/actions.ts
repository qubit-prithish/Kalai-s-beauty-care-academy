"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getServiceRoleClient, isAdminUser } from "@/lib/supabase/admin";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { requireAdmin } from "@/lib/admin-auth";
import type { EnquiryStatus } from "@/lib/content/types";
import { ENTITIES } from "./config";

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
const PUBLIC_PATHS = [
  "/",
  "/courses",
  "/services",
  "/offers",
  "/gallery",
  "/testimonials",
  "/blog",
  "/contact",
  "/faq",
];

function revalidatePublic(table?: string, slug?: string) {
  // 1. Revalidate top-level listing pages (and their layouts)
  for (const p of PUBLIC_PATHS) {
    revalidatePath(p, "layout");
    // Also explicitly revalidate Tamil prefixed paths for listing pages
    revalidatePath(`/ta${p}`, "layout");
  }

  // 2. If we have a specific slug (courses/services/blog), revalidate that specific detail page
  if (slug) {
    const locales = ["en", "ta"];
    for (const loc of locales) {
      const prefix = loc === "en" ? "" : `/${loc}`;
      if (table === "courses") {
        revalidatePath(`${prefix}/courses/${slug}`, "page");
      } else if (table === "services") {
        revalidatePath(`${prefix}/services/${slug}`, "page");
      } else if (table === "blog_posts") {
        revalidatePath(`${prefix}/blog/${slug}`, "page");
      }
    }
  }
}

async function cleanupStorage(db: SupabaseClient, value: unknown) {
  if (typeof value === "string") {
    // Match all storage URLs. The regex is global (g) to find multiple images in HTML.
    const matches = value.matchAll(/\/storage\/v1\/object\/public\/([^/]+)\/([^"'\s>]+)/g);
    for (const match of matches) {
      const bucket = match[1];
      const path = match[2];
      await db.storage.from(bucket).remove([path]);
    }
  } else if (Array.isArray(value)) {
    for (const item of value) await cleanupStorage(db, item);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) await cleanupStorage(db, item);
  }
}

export async function saveRow(table: string, id: string | null, values: Record<string, unknown>) {
  await requireAdmin();
  const cfg = ENTITIES[table];
  if (!cfg) return { error: "Unauthorized table access" };

  // Only allow updating/inserting fields defined in the config.
  const allowedKeys = new Set(cfg.fields.map(f => f.name));
  const cleanValues: Record<string, unknown> = {};
  for (const key of Object.keys(values)) {
    if (allowedKeys.has(key)) cleanValues[key] = values[key];
  }

  const db = getServiceRoleClient();
  if (id) {
    const { error } = await db.from(table).update(cleanValues).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await db.from(table).insert(cleanValues);
    if (error) return { error: error.message };
  }
  revalidatePublic(table, values.slug as string | undefined);
  return { ok: true };
}

export async function deleteRow(table: string, id: string) {
  await requireAdmin();
  if (!ENTITIES[table]) return { error: "Unauthorized table access" };

  const db = getServiceRoleClient();

  // Fetch the entire row before deleting so we can clean up any storage files.
  const { data: row } = await db.from(table).select("*").eq("id", id).single();
  let slug: string | undefined;
  if (row) {
    if ("slug" in row) slug = String(row.slug);
    await cleanupStorage(db, row);
  }

  const { error } = await db.from(table).delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePublic(table, slug);
  return { ok: true };
}

export async function updateEnquiryStatus(id: string, status: EnquiryStatus) {
  await requireAdmin();
  const db = getServiceRoleClient();
  const { error } = await db.from("enquiries").update({ status }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/enquiries");
  return { ok: true };
}

export async function deleteEnquiry(id: string) {
  await requireAdmin();
  const db = getServiceRoleClient();
  const { error } = await db.from("enquiries").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/enquiries");
  return { ok: true };
}
