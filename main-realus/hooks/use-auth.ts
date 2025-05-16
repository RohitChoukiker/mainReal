"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  isAuthenticated, 
  getUser, 
  getUserRole, 
  logout as authLogout 
} from "@/utils/auth";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isApproved: boolean;
  brokerId?: string;
}

interface UseAuthReturn {
  isAuthenticated: boolean;
  user: User | null;
  role: string | null;
  isLoading: boolean;
  logout: () => void;
  redirectToLogin: () => void;
  checkRole: (allowedRoles: string[]) => boolean;
}

/**
 * Custom hook for authentication
 * @returns Authentication state and methods
 */
export function useAuth(): UseAuthReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Use setTimeout to ensure this runs after hydration
    // This prevents hydration mismatches
    const timer = setTimeout(() => {
      // Check authentication status
      const authStatus = isAuthenticated();
      setAuthenticated(authStatus);
      
      if (authStatus) {
        // Get user data
        const userData = getUser();
        if (userData) {
          // Remove token from user data before setting state
          const { token, ...userWithoutToken } = userData;
          setUser(userWithoutToken as User);
          setRole(userData.role);
        }
      }
      
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Logout function
  const logout = () => {
    authLogout();
    setAuthenticated(false);
    setUser(null);
    setRole(null);
  };

  // Redirect to login page
  const redirectToLogin = () => {
    router.push("/landing");
  };

  // Check if user has one of the allowed roles
  const checkRole = (allowedRoles: string[]): boolean => {
    if (!role) return false;
    return allowedRoles.includes(role);
  };

  return {
    isAuthenticated: authenticated,
    user,
    role,
    isLoading,
    logout,
    redirectToLogin,
    checkRole,
  };
}