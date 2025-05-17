"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth-context";
import { getRoleDashboard } from "@/utils/auth";

export function useRoleNavigation() {
  const { role, isAuthenticated } = useAuthContext();
  const router = useRouter();

  // Navigate to a specific role's dashboard
  const navigateToRoleDashboard = (specificRole?: string) => {
    const targetRole = specificRole || role;
    const dashboardUrl = getRoleDashboard(targetRole);
    router.push(dashboardUrl);
  };

  // Navigate to agent dashboard
  const navigateToAgentDashboard = () => {
    router.push("/agent/dashboard");
  };

  // Navigate to broker dashboard
  const navigateToBrokerDashboard = () => {
    router.push("/broker/dashboard");
  };

  // Navigate to TC dashboard
  const navigateToTcDashboard = () => {
    router.push("/tc/dashboard");
  };

  // Navigate to admin dashboard
  const navigateToAdminDashboard = () => {
    router.push("/admin/dashboard");
  };

  // Check if user can access a specific role's routes
  const canAccessRole = (roleToCheck: string): boolean => {
    if (!isAuthenticated || !role) return false;
    return role === roleToCheck;
  };

  // Navigate to a specific path if the user has the required role
  const navigateIfRole = (path: string, requiredRole: string) => {
    if (canAccessRole(requiredRole)) {
      router.push(path);
      return true;
    }
    return false;
  };

  return {
    navigateToRoleDashboard,
    navigateToAgentDashboard,
    navigateToBrokerDashboard,
    navigateToTcDashboard,
    navigateToAdminDashboard,
    canAccessRole,
    navigateIfRole,
  };
}