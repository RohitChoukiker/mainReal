"use client"

import { useState, useEffect } from "react"
import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export default function AgentHeader() {
//   const { notifications, addNotification } = useDashboard()
  const [unreadCount, setUnreadCount] = useState(0)

//   useEffect(() => {
//     setUnreadCount(notifications.filter((n) => !n.read).length)
//   }, [notifications])

//   // Simulate new notifications
//   useEffect(() => {
//     const interval = setInterval(() => {
//       addNotification({
//         id: Date.now(),
//         message: `New notification at ${new Date().toLocaleTimeString()}`,
//         time: "Just now",
//         read: false,
//       })
//     }, 1000) // Add a new notification every 30 seconds

//     return () => clearInterval(interval)
//   }, [addNotification])

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Agent Dashboard</h1>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              {/* <DropdownMenuSeparator />
              {notifications.slice(0, 5).map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start">
                  <span>{notification.message}</span>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </DropdownMenuItem>
              ))}
              {notifications.length > 5 && (
                <DropdownMenuItem>
                  <span className="text-sm text-gray-500">View all notifications</span>
                </DropdownMenuItem> */}
              {/* )} */}
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

