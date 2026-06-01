"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { updateEnquiryStatus, deleteEnquiry } from "@/app/admin/actions";
import type { EnquiryStatus } from "@/lib/content/types";
import { cn } from "@/lib/cn";

type Props = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  topic: string;
  message: string;
  status: EnquiryStatus;
  translations: {
    status: string;
    statusNew: string;
    statusContacted: string;
    statusInProgress: string;
    statusResolved: string;
    deleteConfirm: string;
    deleteSuccess: string;
    statusUpdateSuccess: string;
  };
};

const statusColors: Record<EnquiryStatus, string> = {
  new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  contacted: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  in_progress: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  resolved: "bg-green-500/10 text-green-400 border-green-500/20",
};

export function EnquiryRow({
  id,
  createdAt,
  name,
  phone,
  topic,
  message,
  status: initialStatus,
  translations: t,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<EnquiryStatus>(initialStatus);

  async function handleStatusChange(newStatus: EnquiryStatus) {
    const prevStatus = status;
    setStatus(newStatus); // Optimistic update
    startTransition(async () => {
      const res = await updateEnquiryStatus(id, newStatus);
      if (res.error) {
        setStatus(prevStatus);
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  }

  async function handleDelete() {
    if (!confirm(t.deleteConfirm)) return;
    startTransition(async () => {
      const res = await deleteEnquiry(id);
      if (res.error) {
        alert(res.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <tr className={cn("border-t border-ink-border align-top text-cream transition-opacity", isPending && "opacity-50")}>
      <td className="px-3 py-4 whitespace-nowrap text-cream-dim text-xs">
        {new Date(createdAt).toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </td>
      <td className="px-3 py-4">
        <div className="font-medium text-cream">{name}</div>
        <div className="text-cream-dim text-xs mt-0.5">{phone}</div>
      </td>
      <td className="px-3 py-4 text-xs font-mono uppercase tracking-wider text-gold-300">
        {topic}
      </td>
      <td className="px-3 py-4 max-w-xs text-sm leading-relaxed text-cream-muted">
        {message || "—"}
      </td>
      <td className="px-3 py-4">
        <div className="flex flex-col gap-2">
          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-tighter w-fit", statusColors[status])}>
            {status === "new" && t.statusNew}
            {status === "contacted" && t.statusContacted}
            {status === "in_progress" && t.statusInProgress}
            {status === "resolved" && t.statusResolved}
          </span>
          <select
            value={status}
            disabled={isPending}
            onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus)}
            className="bg-ink-raised border border-ink-border text-cream text-[10px] rounded px-1 py-0.5 focus:outline-none focus:border-gold-500/50"
          >
            <option value="new">{t.statusNew}</option>
            <option value="contacted">{t.statusContacted}</option>
            <option value="in_progress">{t.statusInProgress}</option>
            <option value="resolved">{t.statusResolved}</option>
          </select>
        </div>
      </td>
      <td className="px-3 py-4 text-right">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-rose-400 hover:text-rose-300 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
          title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
        </button>
      </td>
    </tr>
  );
}
