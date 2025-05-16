"use client";

import { AuthProvider } from "@/context/auth-context";

export default function AuthProviderClient({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return <AuthProvider>{children}</AuthProvider>;
}