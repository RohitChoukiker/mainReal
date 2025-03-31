import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const url = req.nextUrl.pathname;

  if (!token || !role) {
    return NextResponse.redirect(new URL("/landing", req.url));
  }

  const roleBasedRoutes: Record<string, string[]> = {
    Agent: ["/agent/dashboard"],
    Broker: ["/Broker/dashboard"],
    Tc: ["/tc/dashboard"],
  };

  const allowedRoutes = roleBasedRoutes[role] || [];

  if (!allowedRoutes.includes(url)) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

// ✅ Matcher: Ye ensure karega ki sirf `/admin`, `/user`, aur `/moderator` routes pe middleware chale
export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/moderator/:path*"],
};
