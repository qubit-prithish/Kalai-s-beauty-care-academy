import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Shell } from "@/components/admin/Shell";

export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  await requireAdmin();
  const db = createAdminClient();
  const { data: rows } = await db
    .from("enquiries").select("*").order("created_at", { ascending: false }).limit(500);
  const list = rows ?? [];

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-cream">Enquiries ({list.length})</h1>
        <a href="/api/admin/enquiries.csv" className="rounded-full border border-ink-border px-4 py-2 text-sm text-cream-muted">Export CSV</a>
      </div>
      <div className="mt-5 overflow-x-auto rounded-xl border border-ink-border">
        <table className="w-full text-sm">
          <thead className="bg-ink-surface text-left text-cream-muted">
            <tr>
              <th className="px-3 py-2 font-medium">When</th>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Phone</th>
              <th className="px-3 py-2 font-medium">Interest</th>
              <th className="px-3 py-2 font-medium">Message</th>
              <th className="px-3 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <tr key={r.id as string} className="border-t border-ink-border align-top text-cream">
                <td className="px-3 py-2 whitespace-nowrap text-cream-dim">{new Date(r.created_at as string).toLocaleString("en-IN")}</td>
                <td className="px-3 py-2">{r.name as string}</td>
                <td className="px-3 py-2 whitespace-nowrap">{r.phone as string}</td>
                <td className="px-3 py-2">{(r.course_interest as string) ?? "—"}</td>
                <td className="px-3 py-2 max-w-xs">{(r.message as string) ?? "—"}</td>
                <td className="px-3 py-2">{(r.status as string) ?? "new"}</td>
              </tr>
            ))}
            {list.length === 0 ? <tr><td className="px-3 py-6 text-cream-dim" colSpan={6}>No enquiries yet.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
