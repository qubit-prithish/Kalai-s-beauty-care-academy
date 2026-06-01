import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateAdminSession } from "./lib/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest): Promise<NextResponse> {
  // /admin is a non-localized area backed by Supabase Auth. Keep it OUT of the
  // next-intl pipeline (otherwise it gets treated as a locale segment and 404s)
  // and run the Supabase session refresh + route guard instead.
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return updateAdminSession(request);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except API routes, Next internals, and static files,
  // PLUS the /admin tree (so Supabase session cookies refresh there).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/admin/:path*"],
};
