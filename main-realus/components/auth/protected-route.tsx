"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserRole } from "@/utils/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

/**
 * A component that protects routes by checking authentication and role
 * @param children The components to render if authenticated
 * @param allowedRoles Optional array of roles that are allowed to access the route
 */
export default function ProtectedRoute({ 
  children, 
  allowedRoles 
}: ProtectedRouteProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Use setTimeout to ensure this runs after hydration
    // This prevents hydration mismatches
    const timer = setTimeout(() => {
      // Check if user is authenticated
      const authenticated = isAuthenticated();
      
      if (!authenticated) {
        // Redirect to landing page if not authenticated
        router.replace("/landing");
        return;
      }
      
      // If allowedRoles is provided, check if user has the required role
      if (allowedRoles && allowedRoles.length > 0) {
        const userRole = getUserRole();
        
        if (!userRole || !allowedRoles.includes(userRole)) {
          // Redirect based on user role
          if (userRole === "Agent") {
            router.replace("/agent/dashboard");
          } else if (userRole === "Broker") {
            router.replace("/broker/dashboard");
          } else if (userRole === "Tc") {
            router.replace("/tc/dashboard");
          } else {
            router.replace("/landing");
          }
          return;
        }
      }
      
      // User is authenticated and has the required role
      setIsAuthorized(true);
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [router, allowedRoles]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Render children if authorized
  return isAuthorized ? <>{children}</> : null;
}