/**
 * Minimal PostgREST read helper for PUBLIC content (anon key). Uses fetch — no
 * supabase-js, so it works in every context (Server Components, build-time
 * generateStaticParams, sitemap, edge) without realtime/WebSocket init issues.
 * RLS applies as `anon`, which is exactly right for published/active content.
 */
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export type QueryOpts = {
  /** PostgREST query string, e.g. "select=*&published=eq.true&order=sort_order". */
  query?: string;
  /** Next.js fetch revalidation in seconds. */
  revalidate?: number;
};

/** Returns rows from a table/view via PostgREST, or [] on misconfig/error. */
export async function restSelect<T = Record<string, unknown>>(
  table: string,
  opts: QueryOpts = {},
): Promise<T[]> {
  if (!URL || !ANON || URL.includes("YOUR-")) return [];
  const qs = opts.query ? `?${opts.query}` : "";
  const res = await fetch(`${URL}/rest/v1/${table}${qs}`, {
    headers: { apikey: ANON, Authorization: `Bearer ${ANON}` },
    next: { revalidate: opts.revalidate ?? 300 },
  });
  if (!res.ok) return [];
  return (await res.json()) as T[];
}

export async function restSingle<T = Record<string, unknown>>(
  table: string,
  opts: QueryOpts = {},
): Promise<T | null> {
  const rows = await restSelect<T>(table, opts);
  return rows[0] ?? null;
}
