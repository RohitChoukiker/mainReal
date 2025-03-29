import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface TransactionOverviewCardProps {
  title: string
  total: number
  completed: number
  pending: number
  atRisk: number
}

export function TransactionOverviewCard({ title, total, completed, pending, atRisk }: TransactionOverviewCardProps) {
  const completedPercentage = Math.round((completed / total) * 100)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>Transaction overview</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-4">{total}</div>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                <span>Completed</span>
              </div>
              <span className="font-medium">{completed}</span>
            </div>
            <Progress value={completedPercentage} className="h-2 bg-muted" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-500 mr-2"></div>
                <span>Pending</span>
              </div>
              <span className="font-medium">{pending}</span>
            </div>
            <Progress value={(pending / total) * 100} className="h-2 bg-muted" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                <span>At Risk</span>
              </div>
              <span className="font-medium">{atRisk}</span>
            </div>
            <Progress value={(atRisk / total) * 100} className="h-2 bg-muted" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

