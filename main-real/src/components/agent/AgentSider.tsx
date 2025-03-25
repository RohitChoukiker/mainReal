"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  FileText,
  AlertCircle,
  DollarSign,
  BarChart2,
  Settings,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/agent" },
  { icon: FileText, label: "New Transactions", href: "/agent/new-transaction" },
  { icon: FileText, label: "My Transactions", href: "/agent/my-transactions" },
  {
    icon: FileText,
    label: "Upload Documents",
    href: "/agent/upload-documents",
  },
  { icon: FileText, label: "Tasks Assigned", href: "/agent/asign-task" },
  { icon: FileText, label: "Complaints", href: "/agent/complaints" },

  { icon: Settings, label: "Settings", href: "/agent/settings	" },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && <h1 className="text-xl font-semibold">Agent</h1>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      <nav className="space-y-2 p-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 px-4 py-3 rounded-lg transition duration-150 ease-in-out",
              pathname === item.href
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
}
