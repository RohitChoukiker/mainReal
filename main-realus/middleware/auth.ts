import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const url = req.nextUrl.pathname;

  console.log(`Middleware running for URL: ${url}`);
  console.log(`Token: ${token ? "Found" : "Not found"}, Role: ${role || "Not found"}`);

  // If no token or role, redirect to landing page
  if (!token || !role) {
    console.log(`No token or role found, redirecting to landing page`);
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
  console.log(`Allowed prefixes for role ${role}:`, allowedPrefixes);

  // Check if the current URL starts with any of the allowed prefixes
  const isAllowed = allowedPrefixes.some(prefix => url.startsWith(prefix));
  console.log(`Is URL allowed: ${isAllowed}`);

  // If not allowed, redirect to the appropriate dashboard based on role
  if (!isAllowed) {
    console.log(`Access not allowed, redirecting based on role: ${role}`);
    
    // Define role-specific dashboards
    const roleDashboards: Record<string, string> = {
      Agent: "/agent/dashboard",
      Broker: "/broker/dashboard",
      Tc: "/tc/dashboard",
      Admin: "/admin/dashboard"
    };
    
    // Get the dashboard URL for the user's role, or default to unauthorized
    const redirectUrl = roleDashboards[role] || "/unauthorized";
    console.log(`Redirecting to: ${redirectUrl}`);
    
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  console.log(`Access allowed, proceeding to ${url}`);
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
