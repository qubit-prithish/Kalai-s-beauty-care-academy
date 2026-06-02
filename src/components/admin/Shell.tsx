import Link from "next/link";
import { ENTITY_ORDER, ENTITIES } from "@/app/(admin)/admin/config";
import { signOut } from "@/app/(admin)/admin/actions";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-page text-cream">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-ink-border bg-ink-page/80 px-6 py-3 backdrop-blur-md">
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/admin" className="font-display text-lg font-bold text-gold-200">Admin</Link>
          <div className="h-4 w-px bg-ink-border mx-1 hidden sm:block" />
          {ENTITY_ORDER.map((k) => (
            <Link 
              key={k} 
              href={`/admin/${k}`} 
              className="text-cream-muted transition-colors hover:text-gold-200"
            >
              {ENTITIES[k].label}
            </Link>
          ))}
          <Link 
            href="/admin/enquiries" 
            className="text-cream-muted transition-colors hover:text-gold-200"
          >
            Enquiries
          </Link>
        </nav>
        <form action={signOut}>
          <button className="rounded-full border border-rose-500/30 px-3 py-1 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500/10">
            Sign out
          </button>
        </form>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
