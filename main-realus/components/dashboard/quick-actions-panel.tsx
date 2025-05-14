import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export interface Action {
  icon: React.ReactNode
  label: string
  href: string
  variant?: "default" | "outline" | "secondary"
}

interface QuickActionsPanelProps {
  actions: Action[]
  title?: string
  description?: string
}

export function QuickActionsPanel({
  actions,
  title = "Quick Actions",
  description = "Frequently used actions",
}: QuickActionsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <Button key={index} variant={action.variant || "outline"} className="h-auto py-4 justify-start" asChild>
              <Link href={action.href}>
                <div className="flex flex-col items-center text-center w-full">
                  <div className="mb-2">{action.icon}</div>
                  <span className="text-xs">{action.label}</span>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

