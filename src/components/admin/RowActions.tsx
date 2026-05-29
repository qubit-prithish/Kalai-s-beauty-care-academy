"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteRow } from "@/app/admin/actions";

export function RowActions({ table, id }: { table: string; id: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  return (
    <div className="flex gap-3 text-sm">
      <Link href={`/admin/${table}/${id}`} className="text-gold-200">Edit</Link>
      <button
        disabled={pending}
        onClick={() =>
          confirm("Delete this row?") &&
          start(async () => { await deleteRow(table, id); router.refresh(); })
        }
        className="text-rose-300"
      >
        Delete
      </button>
    </div>
  );
}
