"use client";

import ProtectedRoute from "./protected-route";

/**
 * Higher-order component to protect routes with authentication
 * @param Component The component to wrap with authentication protection
 * @param allowedRoles Optional array of roles that are allowed to access the route
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: string[]
) {
  return function WithAuth(props: P) {
    return (
      <ProtectedRoute allowedRoles={allowedRoles}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}