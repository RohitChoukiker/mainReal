"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { logout } from "@/utils/auth";

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  className?: string;
}

export default function LogoutButton({
  variant = "outline",
  size = "default",
  showIcon = true,
  className = "",
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Call the logout API endpoint
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        // Clear client-side auth data
        logout();
        
        // Show success message
        toast.success("Logged out successfully");
        
        // Redirect to landing page
        router.push("/landing");
      } else {
        // If the API call fails, still try to logout on the client side
        logout();
        router.push("/landing");
        toast.error("Error during logout, but you've been logged out locally");
      }
    } catch (error) {
      console.error("Logout error:", error);
      
      // Even if there's an error, attempt to logout on the client side
      logout();
      router.push("/landing");
      toast.error("Error during logout, but you've been logged out locally");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={className}
    >
      {showIcon && <LogOut className="mr-2 h-4 w-4" />}
      {isLoggingOut ? "Logging out..." : "Logout"}
    </Button>
  );
}