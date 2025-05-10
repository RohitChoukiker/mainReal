"use client"

import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Building2, Users, ClipboardList, AlertCircle, CheckSquare, BarChart3, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/broker/dashboard",
    icon: <Building2 className="h-5 w-5" />,
  },
  {
    title: "Agent Approvals",
    href: "/broker/agents",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Transactions",
    href: "/broker/transactions",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    title: "Complaints",
    href: "/broker/complaints",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    title: "Closure Requests",
    href: "/broker/closure-requests",
    icon: <CheckSquare className="h-5 w-5" />,
  },
  {
    title: "Reports & Analytics",
    href: "/broker/reports",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Settings",
    href: "/broker/settings",
    icon: <Settings className="h-5 w-5" />,
  },
]

export default function BrokerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" })
      
      if (response.ok) {
        // Show success toast
        toast({
          title: "Successfully logged out",
          description: "You have been logged out successfully",
        })
        
        // Redirect immediately
        router.push("/")
      } else {
        throw new Error("Logout failed")
      }
    } catch (error) {
      console.error("Logout error:", error)
      
      // Show error toast
      toast({
        title: "Logout failed",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        items={sidebarItems} 
        title="Broker Panel" 
        icon={<Building2 className="h-5 w-5" />} 
        onLogout={handleLogout}
      />
      <div className="md:ml-64 min-h-screen">
        <main className="p-4 md:p-6">{children}</main>
      </div>
      <ToastContainer />
    </div>
  )
}

