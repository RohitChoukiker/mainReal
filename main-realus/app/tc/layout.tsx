import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { ClipboardCheck, ClipboardList, FileCheck, CheckSquare, AlertCircle, CheckCircle, Settings } from "lucide-react"

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
]

export default function TCLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar items={sidebarItems} title="TC Panel" icon={<ClipboardCheck className="h-5 w-5" />} />
      <div className="md:ml-64 min-h-screen">
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

