import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { Shell } from "@/components/admin/Shell";
import { EntityForm } from "@/components/admin/EntityForm";
import { ENTITIES } from "../../config";

export const dynamic = "force-dynamic";

export default async function NewPage({ params }: { params: Promise<{ table: string }> }) {
  await requireAdmin();
  const { table } = await params;
  const cfg = ENTITIES[table];
  if (!cfg) notFound();
  return (
    <Shell>
      <h1 className="mb-5 text-xl font-bold text-cream">New {cfg.label}</h1>
      <EntityForm table={table} fields={cfg.fields} row={null} />
    </Shell>
  );
}
