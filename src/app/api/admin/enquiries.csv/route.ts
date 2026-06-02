import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminUser } from "@/lib/supabase/admin";

const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const allowed = await isAdminUser(user.id);
  if (!allowed) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const db = createAdminClient();
  const { data: rows } = await db.from("enquiries").select("*").order("created_at", { ascending: false });
  const cols = ["created_at", "name", "phone", "course_interest", "message", "page_source", "status"];
  const lines = [cols.join(",")];
  for (const r of rows ?? []) lines.push(cols.map((c) => esc((r as Record<string, unknown>)[c])).join(","));

  return new NextResponse(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="enquiries-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
