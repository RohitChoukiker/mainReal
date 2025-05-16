"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  isAuthenticated as checkAuth, 
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

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: string | null;
  isLoading: boolean;
  login: (userData: any) => void;
  logout: () => void;
  checkRole: (allowedRoles: string[]) => boolean;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  // Initialize auth state
  useEffect(() => {
    // Use setTimeout to ensure this runs after hydration
    // This prevents hydration mismatches
    const timer = setTimeout(() => {
      try {
        // Check authentication status
        const authStatus = checkAuth();
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
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Login function
  const login = (userData: any) => {
    setAuthenticated(true);
    
    // Remove token from user data before setting state
    const { token, ...userWithoutToken } = userData;
    setUser(userWithoutToken as User);
    setRole(userData.role);
  };

  // Logout function
  const logout = () => {
    authLogout();
    setAuthenticated(false);
    setUser(null);
    setRole(null);
    router.push("/landing");
  };

  // Check if user has one of the allowed roles
  const checkRole = (allowedRoles: string[]): boolean => {
    if (!role) return false;
    return allowedRoles.includes(role);
  };

  // Context value
  const value = {
    isAuthenticated: authenticated,
    user,
    role,
    isLoading,
    login,
    logout,
    checkRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the auth context
export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  
  return context;
}