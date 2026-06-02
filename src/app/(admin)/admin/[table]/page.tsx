import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Shell } from "@/components/admin/Shell";
import { RowActions } from "@/components/admin/RowActions";
import { ENTITIES } from "../config";

export const dynamic = "force-dynamic";

export default async function ListPage({ params }: { params: Promise<{ table: string }> }) {
  await requireAdmin();
  const { table } = await params;
  const cfg = ENTITIES[table];
  if (!cfg) notFound();

  const db = createAdminClient();
  const { data: rows } = await db.from(cfg.table).select("*").order(cfg.orderBy, { ascending: true });
  const listFields = cfg.fields.filter((f) => f.list);

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-cream">{cfg.label}</h1>
        {!cfg.singleton && (
          <Link href={`/admin/${table}/new`} className="rounded-full bg-gold-gradient px-4 py-2 text-sm font-semibold text-ink-page">+ New</Link>
        )}
      </div>
      <div className="mt-5 overflow-x-auto rounded-xl border border-ink-border">
        <table className="w-full text-sm">
          <thead className="bg-ink-surface text-left text-cream-muted">
            <tr>
              {listFields.map((f) => <th key={f.name} className="px-3 py-2 font-medium">{f.label}</th>)}
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((r) => (
              <tr key={r.id as string} className="border-t border-ink-border">
                {listFields.map((f) => (
                  <td key={f.name} className="px-3 py-2 text-cream">
                    {typeof r[f.name] === "boolean" ? (r[f.name] ? "✓" : "—") : String(r[f.name] ?? "—")}
                  </td>
                ))}
                <td className="px-3 py-2 text-right"><RowActions table={table} id={r.id as string} noDelete={cfg.singleton} /></td>
              </tr>
            ))}
            {(rows ?? []).length === 0 ? (
              <tr><td className="px-3 py-6 text-cream-dim" colSpan={listFields.length + 1}>No rows yet.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
