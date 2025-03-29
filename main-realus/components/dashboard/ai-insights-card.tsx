import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, TrendingUp, AlertTriangle, Clock } from "lucide-react"

interface Insight {
  id: string
  type: "tip" | "trend" | "warning" | "delay"
  content: string
}

interface AIInsightsCardProps {
  insights: Insight[]
}

export function AIInsightsCard({ insights }: AIInsightsCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "tip":
        return <Lightbulb className="h-5 w-5 text-yellow-500" />
      case "trend":
        return <TrendingUp className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "delay":
        return <Clock className="h-5 w-5 text-blue-500" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  const getTitle = (type: string) => {
    switch (type) {
      case "tip":
        return "Helpful Tip"
      case "trend":
        return "Market Trend"
      case "warning":
        return "Risk Alert"
      case "delay":
        return "Delay Prediction"
      default:
        return "Insight"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI-Powered Insights</CardTitle>
        <CardDescription>Smart recommendations based on your data</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="flex p-3 rounded-lg bg-muted/50">
              <div className="mr-3 mt-0.5">{getIcon(insight.type)}</div>
              <div>
                <p className="text-sm font-medium mb-1">{getTitle(insight.type)}</p>
                <p className="text-sm text-muted-foreground">{insight.content}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

