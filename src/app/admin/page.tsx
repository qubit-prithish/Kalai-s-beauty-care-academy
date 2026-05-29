import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { Shell } from "@/components/admin/Shell";
import { ENTITY_ORDER, ENTITIES } from "./config";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const user = await requireAdmin();
  return (
    <Shell>
      <h1 className="text-xl font-bold text-cream">Dashboard</h1>
      <p className="mt-1 text-sm text-cream-muted">Signed in as {user.email}</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {ENTITY_ORDER.map((k) => (
          <Link key={k} href={`/admin/${k}`}
            className="rounded-xl border border-ink-border bg-ink-surface p-4 hover:border-gold-500/40">
            <div className="font-semibold text-gold-200">{ENTITIES[k].label}</div>
          </Link>
        ))}
        <Link href="/admin/enquiries" className="rounded-xl border border-ink-border bg-ink-surface p-4 hover:border-gold-500/40">
          <div className="font-semibold text-gold-200">Enquiries</div>
        </Link>
      </div>
    </Shell>
  );
}
