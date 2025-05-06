"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { UserCircle, PlusCircle, ClipboardList, Upload, CheckSquare, AlertCircle, Settings } from "lucide-react";
import ApprovalStatus from "@/components/approval-status";
import { toast as reactToastify } from "react-toastify";
import { useToast } from "@/hooks/use-toast";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/agent/dashboard",
    icon: <UserCircle className="h-5 w-5" />,
  },
  {
    title: "New Transaction",
    href: "/agent/new-transaction",
    icon: <PlusCircle className="h-5 w-5" />,
  },
  {
    title: "My Transactions",
    href: "/agent/transactions",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    title: "Upload Documents",
    href: "/agent/upload-documents",
    icon: <Upload className="h-5 w-5" />,
  },
  {
    title: "Tasks Assigned",
    href: "/agent/tasks",
    icon: <CheckSquare className="h-5 w-5" />,
  },
  {
    title: "Complaints",
    href: "/agent/complaints",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/agent/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isApproved, setIsApproved] = useState<boolean | undefined>(undefined);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in and approved
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/user/status");
        
        if (!response.ok) {
          // Not authenticated, redirect to login
          router.push("/landing");
          return;
        }
        
        const data = await response.json();
        console.log("User status data:", data);
        
        // Store user data in localStorage for later use
        if (data.role) {
          const userData = {
            role: data.role,
            isApproved: data.isApproved
          };
          localStorage.setItem('userData', JSON.stringify(userData));
        }
        
        // Check if user is an agent
        if (data.role !== "Agent") {
          reactToastify.error("Unauthorized: You must be an agent to access this page");
          router.push("/landing");
          return;
        }
        
        setIsApproved(data.isApproved);
        setIsLoading(false);
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/landing");
      }
    };
    
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      
      if (response.ok) {
        // Show success toast
        toast({
          title: "Successfully logged out",
          description: "You have been logged out successfully",
        });
        
        // Redirect immediately
        router.push("/");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      
      // Show error toast
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not approved, show approval status screen
  if (!isApproved) {
    return <ApprovalStatus isApproved={isApproved} onLogout={handleLogout} />;
  }

  // If approved, show the agent dashboard
  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        items={sidebarItems} 
        title="Agent Panel" 
        icon={<UserCircle className="h-5 w-5" />} 
        onLogout={handleLogout}
      />
      <div className="md:ml-64 min-h-screen">
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

