"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null as null | { error?: string });
  return (
    <main className="grid min-h-screen place-items-center p-6">
      <form action={action} className="w-full max-w-sm rounded-2xl border border-ink-border bg-ink-surface p-8">
        <h1 className="text-2xl font-bold text-gold-200">Kalai&apos;s Admin</h1>
        <p className="mt-1 text-sm text-cream-muted">Sign in to manage content.</p>
        <label className="mt-6 block text-sm">Email
          <input name="email" type="email" required autoComplete="email"
            className="mt-1 w-full rounded-lg border border-ink-border bg-ink-page px-3 py-2 text-cream" />
        </label>
        <label className="mt-4 block text-sm">Password
          <input name="password" type="password" required autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-ink-border bg-ink-page px-3 py-2 text-cream" />
        </label>
        {state?.error ? <p className="mt-3 text-sm text-rose-300">{state.error}</p> : null}
        <button type="submit" disabled={pending}
          className="mt-6 w-full rounded-full bg-gold-gradient px-5 py-2.5 font-semibold text-ink-page disabled:opacity-60">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}
