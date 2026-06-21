"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Field } from "@/app/(admin)/admin/config";
import { saveRow } from "@/app/(admin)/admin/actions";

const inputCls =
  "mt-1 w-full rounded-lg border border-ink-border bg-ink-page px-3 py-2 text-sm text-cream";

function ImageField({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  async function upload(file: File) {
    setBusy(true);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("bucket", field.bucket ?? "gallery");
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setBusy(false);
    if (res.ok) onChange((await res.json()).url);
    else alert("Upload failed");
  }
  return (
    <div>
      <div className="flex items-center gap-3">
        <input type="file" accept="image/*" disabled={busy}
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} className="text-xs" />
        {busy ? <span className="text-xs text-cream-dim">Uploading…</span> : null}
      </div>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" className={inputCls} />
      {value ? <img src={value} alt={`Preview of uploaded ${field.name} image`} className="mt-2 h-20 rounded-lg object-cover" /> : null}
    </div>
  );
}

export function EntityForm({
  table, fields, row,
}: { table: string; fields: Field[]; row: Record<string, unknown> | null }) {
  const router = useRouter();
  const init: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = row?.[f.name];
    if (f.is_array && Array.isArray(raw)) {
      init[f.name] = raw.join("\n");
    } else {
      init[f.name] = raw ?? (f.type === "bool" ? false : "");
    }
  }
  const [values, setValues] = useState(init);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: string, v: unknown) => setValues((s) => ({ ...s, [k]: v }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setError(null);
    // Coerce types for the DB. Omit empty values so NOT NULL columns fall back
    // to their defaults instead of receiving an explicit null.
    const out: Record<string, unknown> = {};
    for (const f of fields) {
      const v = values[f.name];
      if (f.type === "number") {
        if (v !== "" && v !== null && v !== undefined) out[f.name] = Number(v);
      } else if (f.type === "bool") {
        out[f.name] = !!v;
      } else if (f.type === "date") {
        if (v) out[f.name] = new Date(String(v)).toISOString();
      } else if (f.name === "value_json") {
        try { out[f.name] = JSON.parse(String(v || "{}")); }
        catch { setError("value_json is not valid JSON"); setSaving(false); return; }
      } else if (f.is_array) {
        out[f.name] = String(v || "").split("\n").map(s => s.trim()).filter(Boolean);
      } else if (v !== "" && v !== null && v !== undefined) {
        out[f.name] = v;
      }
    }
    const res = await saveRow(table, (row?.id as string) ?? null, out);
    setSaving(false);
    if (res.error) setError(res.error);
    else router.push(`/admin/${table}`);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      {fields.map((f) => (
        <label key={f.name} className="block text-sm text-cream-muted">
          {f.label}
          {f.type === "textarea" ? (
            <textarea rows={f.name.startsWith("body") || f.name === "value_json" ? 8 : 3}
              value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} className={inputCls} />
          ) : f.type === "bool" ? (
            <div className="mt-1"><input type="checkbox" checked={!!values[f.name]} onChange={(e) => set(f.name, e.target.checked)} /></div>
          ) : f.type === "image" ? (
            <ImageField field={f} value={String(values[f.name] ?? "")} onChange={(v) => set(f.name, v)} />
          ) : f.type === "select" ? (
            <select value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)} className={inputCls}>
              <option value="">Select...</option>
              {f.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          ) : (
            <input type={f.type === "number" ? "number" : f.type === "date" ? "datetime-local" : "text"}
              value={f.type === "date" && values[f.name] ? String(values[f.name]).slice(0, 16) : String(values[f.name] ?? "")}
              onChange={(e) => set(f.name, e.target.value)} className={inputCls} />
          )}
        </label>
      ))}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}
      <div className="flex gap-3">
        <button type="submit" disabled={saving}
          className="rounded-full bg-gold-gradient px-5 py-2 font-semibold text-ink-page disabled:opacity-60">
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={() => router.push(`/admin/${table}`)} className="rounded-full border border-ink-border px-5 py-2 text-cream-muted">Cancel</button>
      </div>
    </form>
  );
}
