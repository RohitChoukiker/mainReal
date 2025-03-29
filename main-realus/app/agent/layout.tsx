import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { UserCircle, PlusCircle, ClipboardList, Upload, CheckSquare, AlertCircle, Settings } from "lucide-react"

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
]

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar items={sidebarItems} title="Agent Panel" icon={<UserCircle className="h-5 w-5" />} />
      <div className="md:ml-64 min-h-screen">
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

