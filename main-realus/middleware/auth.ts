import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const url = req.nextUrl.pathname;

  // If no token or role, redirect to landing page
  if (!token || !role) {
    return NextResponse.redirect(new URL("/landing", req.url));
  }

  // Define which route prefixes are allowed for each role
  const roleBasedRoutePrefixes: Record<string, string[]> = {
    Agent: ["/agent"],
    Broker: ["/broker"],
    Tc: ["/tc"],
    Admin: ["/admin"],
  };

  // Get allowed route prefixes for the user's role
  const allowedPrefixes = roleBasedRoutePrefixes[role] || [];

  // Check if the current URL starts with any of the allowed prefixes
  const isAllowed = allowedPrefixes.some(prefix => url.startsWith(prefix));

  // If not allowed, redirect to unauthorized page
  if (!isAllowed) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  return NextResponse.next();
}

// ✅ Matcher: Ye ensure karega ki sirf authorized routes pe middleware chale
export const config = {
  matcher: [
    "/admin/:path*", 
    "/user/:path*", 
    "/moderator/:path*",
    "/agent/:path*",
    "/broker/:path*",
    "/tc/:path*"
  ],
};
