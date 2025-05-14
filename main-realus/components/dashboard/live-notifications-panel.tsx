import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: "info" | "warning" | "success" | "error"
}

interface LiveNotificationsPanelProps {
  notifications: Notification[]
}

export function LiveNotificationsPanel({ notifications }: LiveNotificationsPanelProps) {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg">Notifications</CardTitle>
          <CardDescription>Recent updates and alerts</CardDescription>
        </div>
        <div className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              variant="destructive"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-4 max-h-[300px] overflow-auto pr-2">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${notification.read ? "bg-background" : "bg-muted/50 border-primary/20"}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-medium">{notification.title}</h4>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                {!notification.read && (
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                    Mark as read
                  </Button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">No new notifications</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

