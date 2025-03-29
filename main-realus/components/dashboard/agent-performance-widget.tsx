import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface AgentPerformance {
  id: string
  name: string
  avatar: string
  transactions: number
  completionRate: number
  avgTimeToClose: number
}

interface AgentPerformanceWidgetProps {
  agents: AgentPerformance[]
}

export function AgentPerformanceWidget({ agents }: AgentPerformanceWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Agent Performance</CardTitle>
        <CardDescription>Top performing agents this month</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-4">
          {agents.map((agent) => (
            <div key={agent.id} className="flex items-center p-2 rounded-lg hover:bg-muted">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={agent.avatar} alt={agent.name} />
                <AvatarFallback>{agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{agent.name}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{agent.transactions} transactions</span>
                  <span className="mx-2">•</span>
                  <span>{agent.avgTimeToClose} days avg.</span>
                </div>
              </div>
              <Badge variant={agent.completionRate >= 90 ? "success" : "default"} className="ml-2">
                {agent.completionRate}%
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

