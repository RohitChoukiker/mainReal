"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Menu, X, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { ModeToggle } from "@/components/mode-toggle"
import dynamic from "next/dynamic"
import { useToast } from "@/hooks/use-toast"

// Dynamically import the TransactionPanel to avoid SSR issues with real-time data
const TransactionPanel = dynamic(
  () => import("@/components/broker/transaction-panel").then(mod => mod.default),
  { ssr: false }
)

interface SidebarProps {
  items: {
    title: string
    href: string
    icon: React.ReactNode
    badge?: string
    badgeVariant?: string
  }[]
  title: string
  icon: React.ReactNode
  onLogout?: () => Promise<void>
  taskPanel?: React.ReactNode
}

export function Sidebar({ items, title, icon, onLogout, taskPanel }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const isBrokerPanel = title === "Broker Panel"
  const { toast } = useToast()

  // Close the mobile sidebar when the route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])
  
  // Default logout handler if none is provided
  const handleLogout = async () => {
    if (onLogout) {
      await onLogout()
    } else {
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
  }

  return (
    <>
      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden fixed top-4 left-4 z-40">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold">
                {icon}
                <span>{title}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-3">
                <nav className="grid gap-1">
                  {items.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                        pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      {item.badge && (
                        <span className={cn(
                          "ml-auto flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium",
                          item.badgeVariant === "destructive" 
                            ? "bg-destructive text-destructive-foreground" 
                            : "bg-primary text-primary-foreground"
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>
                
                {/* Transaction Panel for Broker */}
                {isBrokerPanel && (
                  <div className="mt-6">
                    <TransactionPanel />
                  </div>
                )}
                
                {/* Task Panel for TC */}
                {taskPanel && (
                  <div className="mt-6">
                    {taskPanel}
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="p-4 border-t flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <ModeToggle />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col fixed inset-y-0 z-30 border-r bg-background">
        <div className="p-4 border-b flex items-center gap-2 font-semibold">
          {icon}
          <span>{title}</span>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-3">
            <nav className="grid gap-1">
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
            </nav>
            
            {/* Transaction Panel for Broker */}
            {isBrokerPanel && (
              <div className="mt-6">
                <TransactionPanel />
              </div>
            )}
            
            {/* Task Panel for TC */}
            {taskPanel && (
              <div className="mt-6">
                {taskPanel}
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
          <ModeToggle />
        </div>
      </div>
    </>
  )
}

