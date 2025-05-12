"use client"

// This component has been modified to remove the messaging feature
// It now returns null (no badge)

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
  // Always return null since messaging feature is removed
  return null;
}