"use client"

import { useEffect, useState } from "react"
import { useSocket } from "@/utils/useSocket"
import { Badge } from "@/components/ui/badge"

export function SocketStatus() {
  const { socket, isConnected, isAuthenticated, error } = useSocket()
  const [status, setStatus] = useState<string>("Initializing...")
  
  useEffect(() => {
    if (error) {
      setStatus(`Error: ${error.message}`)
    } else if (!socket) {
      setStatus("Initializing socket...")
    } else if (!isConnected) {
      setStatus("Connecting...")
    } else if (!isAuthenticated) {
      setStatus("Authenticating...")
    } else {
      setStatus("Connected")
    }
  }, [socket, isConnected, isAuthenticated, error])
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`} />
      <Badge variant="outline" className="text-xs">
        Socket: {status}
      </Badge>
    </div>
  )
}

function getStatusColor(status: string): string {
  if (status === "Connected") {
    return "bg-green-500"
  } else if (status.startsWith("Error")) {
    return "bg-red-500"
  } else {
    return "bg-yellow-500 animate-pulse"
  }
}