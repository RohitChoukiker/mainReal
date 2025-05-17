"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth-context";
import { getRoleDashboard } from "@/utils/auth";

interface RoleSwitcherProps {
  availableRoles?: string[];
}

export default function RoleSwitcher({ availableRoles }: RoleSwitcherProps) {
  const { role, user } = useAuthContext();
  const router = useRouter();
  const [roles, setRoles] = useState<string[]>([]);

  // Initialize available roles
  useEffect(() => {
    // If availableRoles is provided, use it
    // Otherwise, use the user's role and any additional roles from the user object
    if (availableRoles && availableRoles.length > 0) {
      setRoles(availableRoles);
    } else if (user && role) {
      // In a real app, you might get additional roles from the user object
      // For now, we'll just use the current role
      setRoles([role]);
    }
  }, [availableRoles, user, role]);

  // Handle role switch
  const switchRole = async (newRole: string) => {
    if (newRole === role) return;

    try {
      // In a real app, you might need to call an API to switch roles
      // For now, we'll just redirect to the appropriate dashboard
      
      // Get the dashboard URL for the selected role
      const dashboardUrl = getRoleDashboard(newRole);
      
      // Redirect to the dashboard
      router.push(dashboardUrl);
    } catch (error) {
      console.error("Error switching role:", error);
    }
  };

  // Don't render if there's only one role
  if (roles.length <= 1) {
    return null;
  }

  return (
    <div className="p-4 bg-card rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-2">Switch Role</h3>
      <div className="flex flex-col space-y-2">
        {roles.map((roleOption) => (
          <button
            key={roleOption}
            onClick={() => switchRole(roleOption)}
            className={`px-4 py-2 rounded-md transition-colors ${
              roleOption === role
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {roleOption}
          </button>
        ))}
      </div>
    </div>
  );
}