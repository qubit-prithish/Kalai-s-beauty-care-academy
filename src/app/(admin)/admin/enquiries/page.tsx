import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { Shell } from "@/components/admin/Shell";
import { getTranslations } from "next-intl/server";
import { EnquiryRow } from "@/components/admin/EnquiryRow";
import type { EnquiryStatus } from "@/lib/content/types";

export const dynamic = "force-dynamic";

export default async function EnquiriesPage() {
  await requireAdmin();
  const t = await getTranslations("admin.enquiry");
  const db = createAdminClient();
  const { data: rows } = await db
    .from("enquiries")
    .select("id, name, phone, course_interest, message, status, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  const list = rows ?? [];

  const translations = {
    status: t("status"),
    statusNew: t("statusNew"),
    statusContacted: t("statusContacted"),
    statusInProgress: t("statusInProgress"),
    statusResolved: t("statusResolved"),
    deleteConfirm: t("deleteConfirm"),
    deleteSuccess: t("deleteSuccess"),
    statusUpdateSuccess: t("statusUpdateSuccess"),
  };

  return (
    <Shell>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-cream">Enquiries ({list.length})</h1>
        <a href="/api/admin/enquiries.csv" className="rounded-full border border-ink-border px-4 py-2 text-sm text-cream-muted transition-colors hover:border-gold-500/40 hover:text-cream">
          Export CSV
        </a>
      </div>
      <div className="mt-5 overflow-x-auto rounded-xl border border-ink-border bg-ink-raised/5">
        <table className="w-full text-sm">
          <thead className="bg-ink-surface text-left text-cream-muted uppercase text-[10px] tracking-widest font-bold">
            <tr>
              <th className="px-3 py-3">When</th>
              <th className="px-3 py-3">Student</th>
              <th className="px-3 py-3">Interest</th>
              <th className="px-3 py-3">Message</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {list.map((r) => (
              <EnquiryRow
                key={r.id as string}
                id={r.id as string}
                createdAt={r.created_at as string}
                name={r.name as string}
                phone={r.phone as string}
                topic={r.course_interest as string}
                message={r.message as string}
                status={(r.status as EnquiryStatus) || "new"}
                translations={translations}
              />
            ))}
            {list.length === 0 ? (
              <tr>
                <td className="px-3 py-12 text-center text-cream-dim italic" colSpan={6}>
                  No enquiries yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </Shell>
  );
}
