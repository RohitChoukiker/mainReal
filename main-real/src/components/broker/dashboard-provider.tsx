"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

type Notification = {
  id: number
  message: string
  time: string
  read: boolean
}

type DashboardContextType = {
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  markNotificationAsRead: (id: number) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev])
  }, [])

  const markNotificationAsRead = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }, [])

  return (
    <DashboardContext.Provider value={{ notifications, addNotification, markNotificationAsRead }}>
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}

