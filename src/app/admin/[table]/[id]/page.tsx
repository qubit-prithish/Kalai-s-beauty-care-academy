import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Shell } from "@/components/admin/Shell";
import { EntityForm } from "@/components/admin/EntityForm";
import { ENTITIES } from "../../config";

export const dynamic = "force-dynamic";

export default async function EditPage({ params }: { params: Promise<{ table: string; id: string }> }) {
  await requireAdmin();
  const { table, id } = await params;
  const cfg = ENTITIES[table];
  if (!cfg) notFound();
  const db = createAdminClient();
  const { data: row } = await db.from(cfg.table).select("*").eq("id", id).maybeSingle();
  if (!row) notFound();
  // Stringify JSON column for the textarea editor.
  const prepared = { ...row } as Record<string, unknown>;
  if (prepared.value_json && typeof prepared.value_json === "object") {
    prepared.value_json = JSON.stringify(prepared.value_json, null, 2);
  }
  return (
    <Shell>
      <h1 className="mb-5 text-xl font-bold text-cream">Edit {cfg.label}</h1>
      <EntityForm table={table} fields={cfg.fields} row={prepared} />
    </Shell>
  );
}
