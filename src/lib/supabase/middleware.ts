// ─────────────────────────────────────────────────────────────────────────────
// Middleware session bridge + /admin route guard.
//
// Runs only for /admin* requests (see src/middleware.ts). It:
//   1. Refreshes the Supabase auth session and syncs cookies onto the response.
//   2. Requires an authenticated session for every /admin route except the
//      login page. Unauthenticated users are redirected to /admin/login.
//
// The deeper "is this user actually an admin?" check (against the `admins`
// table) happens in the dashboard server component, where the service-role
// client is available. Keeping the DB lookup out of middleware avoids a query
// on every request and prevents redirect loops.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseUrl, getSupabaseAnonKey } from "./env";

const LOGIN_PATH = "/admin/login";

export async function updateAdminSession(
  request: NextRequest,
): Promise<NextResponse> {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();

  // If Supabase isn't configured, don't crash — send admins to the login page,
  // which renders a clear "not configured" message.
  if (!url || !anonKey) {
    if (request.nextUrl.pathname !== LOGIN_PATH) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANT: getUser() revalidates the token with the Supabase Auth server.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === LOGIN_PATH;

  if (!user && !isLoginPage) {
    const redirectUrl = new URL(LOGIN_PATH, request.url);
    redirectUrl.searchParams.set("redirectedFrom", pathname);
    const redirect = NextResponse.redirect(redirectUrl);
    // Carry over any refreshed auth cookies.
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  return response;
}
