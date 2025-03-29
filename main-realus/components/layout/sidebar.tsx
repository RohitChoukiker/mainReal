"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { ModeToggle } from "@/components/mode-toggle"

interface SidebarProps {
  items: {
    title: string
    href: string
    icon: React.ReactNode
  }[]
  title: string
  icon: React.ReactNode
}

export function Sidebar({ items, title, icon }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the mobile sidebar when the route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

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
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                        pathname === item.href ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )}
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </ScrollArea>
            <div className="p-4 border-t flex justify-end">
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
          </div>
        </ScrollArea>
        <div className="p-4 border-t flex justify-end">
          <ModeToggle />
        </div>
      </div>
    </>
  )
}

