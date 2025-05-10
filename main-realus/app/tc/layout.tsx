"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { ClipboardCheck, ClipboardList, FileCheck, CheckSquare, AlertCircle, CheckCircle, Settings } from "lucide-react";
import ApprovalStatus from "@/components/approval-status";
import { toast as reactToastify } from "react-toastify";
import { useToast } from "@/hooks/use-toast";
import dynamic from "next/dynamic";

// Dynamically import the TaskPanel to avoid SSR issues with real-time data
const TaskPanel = dynamic(
  () => import("@/components/tc/task-panel").then(mod => mod.default),
  { ssr: false }
);

// Define the task interface
interface ApiTask {
  _id: string;
  status: string;
}

export default function TCLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [isApproved, setIsApproved] = useState<boolean | undefined>(undefined);
  const [pendingTaskCount, setPendingTaskCount] = useState<number>(0);
  const router = useRouter();
  const { toast } = useToast();

  // Check if user is logged in and approved
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/user/status");
        
        if (!response.ok) {
          // Not authenticated, redirect to login
          router.push("/login");
          return;
        }
        
        const data = await response.json();
        
        // Check if user is a TC
        if (data.role !== "Tc") {
          reactToastify.error("Unauthorized: You must be a Transaction Coordinator to access this page");
          router.push("/login");
          return;
        }
        
        setIsApproved(data.isApproved);
        setIsLoading(false);
      } catch (error) {
        console.error("Authentication error:", error);
        router.push("/login");
      }
    };
    
    checkAuth();
  }, [router]);

  // Fetch task count for the sidebar
  useEffect(() => {
    const fetchTaskCount = async () => {
      try {
        const response = await fetch("/api/tc/tasks");
        
        if (response.ok) {
          const data = await response.json();
          
          if (data.tasks && Array.isArray(data.tasks)) {
            // Count pending and overdue tasks
            const pendingCount = data.tasks.filter((task: ApiTask) => 
              task.status === "pending" || task.status === "in_progress" || task.status === "overdue"
            ).length;
            
            setPendingTaskCount(pendingCount);
          }
        }
      } catch (error) {
        console.error("Error fetching task count:", error);
      }
    };
    
    // Only fetch if user is approved
    if (isApproved) {
      fetchTaskCount();
    }
  }, [isApproved]);

  // Create sidebar items with dynamic task count
  const sidebarItems = [
    {
      title: "Dashboard",
      href: "/tc/dashboard",
      icon: <ClipboardCheck className="h-5 w-5" />,
    },
    {
      title: "Assigned Transactions",
      href: "/tc/transactions",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      title: "Document Review",
      href: "/tc/document-review",
      icon: <FileCheck className="h-5 w-5" />,
    },
    {
      title: "Task Management",
      href: "/tc/tasks",
      icon: <CheckSquare className="h-5 w-5" />,
      badge: pendingTaskCount > 0 ? pendingTaskCount.toString() : undefined,
      badgeVariant: "destructive"
    },
    {
      title: "Complaints",
      href: "/tc/complaints",
      icon: <AlertCircle className="h-5 w-5" />,
    },
    {
      title: "Ready for Closure",
      href: "/tc/ready-for-closure",
      icon: <CheckCircle className="h-5 w-5" />,
    },
    {
      title: "Settings",
      href: "/tc/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

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

  // If approved, show the TC dashboard
  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        items={sidebarItems} 
        title="TC Panel" 
        icon={<ClipboardCheck className="h-5 w-5" />} 
        onLogout={handleLogout}
        taskPanel={<TaskPanel />}
      />
      <div className="md:ml-64 min-h-screen">
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

