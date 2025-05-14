"use client"

import { Badge } from "@/components/ui/badge"

// This component has been modified to remove socket functionality
export function SocketStatus() {
  // Return a static badge indicating socket functionality is disabled
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-gray-400" />
      <Badge variant="outline" className="text-xs">
        Socket: Disabled
      </Badge>
    </div>
  )
}