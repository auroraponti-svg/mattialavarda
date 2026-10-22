import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

// Controllo rapido all'ingresso di /admin: senza cookie di accesso valido si va
// al login. Le pagine e le route dell'admin rifanno comunque il controllo
// (questo è solo il primo filtro, non l'unica difesa).
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const loggedIn = await verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);

  if (path !== "/admin/login" && !loggedIn) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (path === "/admin/login" && loggedIn) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
