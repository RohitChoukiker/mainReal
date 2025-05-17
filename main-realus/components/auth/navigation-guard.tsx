"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/context/auth-context";
import { getRoleDashboard } from "@/utils/auth";

interface NavigationGuardProps {
  children: React.ReactNode;
}

export default function NavigationGuard({ children }: NavigationGuardProps) {
  const { isAuthenticated, role, isLoading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip if still loading
    if (isLoading) return;

    // If not authenticated, redirect to landing page
    if (!isAuthenticated) {
      router.replace("/landing");
      return;
    }

    // Define role-based route prefixes
    const roleBasedRoutePrefixes: Record<string, string[]> = {
      Agent: ["/agent"],
      Broker: ["/broker"],
      Tc: ["/tc"],
      Admin: ["/admin"],
    };

    // Get allowed route prefixes for the user's role
    const allowedPrefixes = role ? roleBasedRoutePrefixes[role] || [] : [];

    // Check if the current URL starts with any of the allowed prefixes
    const isAllowed = allowedPrefixes.some(prefix => pathname.startsWith(prefix));

    // If not allowed and trying to access a protected route, redirect to the appropriate dashboard
    if (!isAllowed) {
      const protectedPrefixes = Object.values(roleBasedRoutePrefixes).flat();
      const isProtectedRoute = protectedPrefixes.some(prefix => pathname.startsWith(prefix));

      if (isProtectedRoute) {
        const dashboardUrl = getRoleDashboard(role);
        router.replace(dashboardUrl);
      }
    }
  }, [isAuthenticated, role, pathname, router, isLoading]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}