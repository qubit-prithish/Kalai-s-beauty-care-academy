import Link from "next/link";
import { ENTITY_ORDER, ENTITIES } from "@/app/admin/config";
import { logout } from "@/app/admin/actions";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-ink-border px-6 py-3">
        <nav className="flex flex-wrap items-center gap-3 text-sm">
          <Link href="/admin" className="font-bold text-gold-200">Admin</Link>
          {ENTITY_ORDER.map((k) => (
            <Link key={k} href={`/admin/${k}`} className="text-cream-muted hover:text-cream">{ENTITIES[k].label}</Link>
          ))}
          <Link href="/admin/enquiries" className="text-cream-muted hover:text-cream">Enquiries</Link>
        </nav>
        <form action={logout}><button className="text-sm text-rose-300">Logout</button></form>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
