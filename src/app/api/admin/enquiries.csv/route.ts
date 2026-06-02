import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin-auth";
import { getServiceRoleClient } from "@/lib/supabase/admin";

const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export async function GET() {
  const { user, error, status } = await getAdminUser();
  if (error) return NextResponse.json({ error }, { status });

  const db = getServiceRoleClient();
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
