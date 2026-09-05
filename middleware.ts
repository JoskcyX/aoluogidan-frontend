import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/session";
import { SESSION_COOKIE } from "@/lib/api";

/**
 * Protects /admin and /api/admin routes.
 *
 * This app's data now lives in a separate backend service, so this
 * middleware no longer touches a database. It just verifies the signed
 * session JWT (set as an httpOnly cookie by /api/auth/login) and checks
 * its embedded role claim. The backend re-checks auth independently on
 * every request it receives — this is a fast first line of defense, not
 * the only one.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApiRoute = pathname.startsWith("/api/");

  // The login page itself must always be reachable, unauthenticated.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const user = await verifySessionToken(token);

  if (!user) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  // Editors can't manage other admin accounts.
  const superAdminOnly = pathname.startsWith("/admin/users") || pathname.startsWith("/api/admin/users");
  if (superAdminOnly && user.role !== "SUPER_ADMIN") {
    if (isApiRoute) {
      return NextResponse.json({ error: "You don't have permission to do that." }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
