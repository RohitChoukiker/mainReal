import type React from "react"
import { Sidebar } from "@/components/layout/sidebar"
import { Building2, Users, ClipboardList, AlertCircle, CheckSquare, BarChart3, Settings } from "lucide-react"

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
  return (
    <div className="min-h-screen bg-background">
      <Sidebar items={sidebarItems} title="Broker Panel" icon={<Building2 className="h-5 w-5" />} />
      <div className="md:ml-64 min-h-screen">
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

