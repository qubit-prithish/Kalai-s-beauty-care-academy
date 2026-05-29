import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";

const intl = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // /admin routes: only refresh the Supabase session (no locale routing).
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return updateSession(request);
  }
  return intl(request);
}

export const config = {
  // Match all pathnames except API routes, Next internals, and static files,
  // PLUS the /admin tree (so Supabase session cookies refresh there).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/admin/:path*"],
};
