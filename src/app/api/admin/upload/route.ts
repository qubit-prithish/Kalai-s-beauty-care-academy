import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { getServiceRoleClient } from "@/lib/supabase/admin";

// Admin-only media upload. Verifies the caller is a registered admin, then
// uploads to the given Storage bucket and returns the public URL.
export async function POST(req: Request) {
  const { user, error, status } = await getAdminUser();
  if (error) return NextResponse.json({ error }, { status });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const bucket = String(form.get("bucket") ?? "gallery");
  if (!file) return NextResponse.json({ error: "no file" }, { status: 400 });

  const ext = (file.name.split(".").pop() ?? "bin").toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const db = getServiceRoleClient();
  const { error: uploadError } = await db.storage.from(bucket).upload(path, file, {
    contentType: file.type || undefined,
    upsert: false,
  });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });
  const { data } = db.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
