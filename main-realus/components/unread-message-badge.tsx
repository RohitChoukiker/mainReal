"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

interface UnreadMessageBadgeProps {
  taskId: string
  userRole: 'agent' | 'tc'
  pollingInterval?: number
}

export function UnreadMessageBadge({ 
  taskId, 
  userRole,
  pollingInterval = 10000 
}: UnreadMessageBadgeProps) {
  const [unreadCount, setUnreadCount] = useState(0)
  
  useEffect(() => {
    // Function to fetch unread message count
    const fetchUnreadCount = async () => {
      try {
        const timestamp = new Date().getTime()
        const response = await fetch(`/api/tasks/${taskId}/messages/unread?role=${userRole}&t=${timestamp}`, {
          credentials: 'include'
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch unread count: ${response.status}`)
        }
        
        const data = await response.json()
        setUnreadCount(data.unreadCount || 0)
      } catch (error) {
        console.error("Error fetching unread count:", error)
      }
    }
    
    // Fetch immediately
    fetchUnreadCount()
    
    // Set up polling
    const interval = setInterval(fetchUnreadCount, pollingInterval)
    
    // Clean up
    return () => clearInterval(interval)
  }, [taskId, userRole, pollingInterval])
  
  if (unreadCount === 0) {
    return null
  }
  
  return (
    <Badge variant="destructive" className="ml-1 animate-pulse">
      {unreadCount}
    </Badge>
  )
}