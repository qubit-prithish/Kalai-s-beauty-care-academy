import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "./LoginForm";

// Auth-dependent: never prerender.
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const configured = isSupabaseConfigured();

  // Already signed in as an admin? Skip the form.
  if (configured) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user && (await isAdminUser(user.id))) {
      redirect("/admin");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-luxe text-gold-300">
            Kalai&apos;s Beauty Care &amp; Academy
          </p>
          <h1 className="mt-3 font-display text-3xl text-cream">Admin sign in</h1>
          <p className="mt-2 text-sm text-cream-muted">
            Authorized staff only. Sign in to manage site content.
          </p>
        </div>

        <div className="rounded-3xl border border-ink-border bg-ink-surface p-8 shadow-soft">
          {configured ? (
            <LoginForm />
          ) : (
            <div className="space-y-4">
              <p className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                Supabase is not configured yet. Add{" "}
                <code className="font-mono text-amber-100">
                  NEXT_PUBLIC_SUPABASE_URL
                </code>{" "}
                and{" "}
                <code className="font-mono text-amber-100">
                  NEXT_PUBLIC_SUPABASE_ANON_KEY
                </code>{" "}
                (plus{" "}
                <code className="font-mono text-amber-100">
                  SUPABASE_SERVICE_ROLE_KEY
                </code>
                ) to your environment, then redeploy.
              </p>
              <LoginForm disabled />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
