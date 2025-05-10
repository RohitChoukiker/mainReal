import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"

interface TransactionOverviewCardProps {
  title: string
  total: number
  completed: number
  pending: number
  atRisk: number
  isLoading?: boolean
}

export function TransactionOverviewCard({ 
  title, 
  total, 
  completed, 
  pending, 
  atRisk,
  isLoading = false
}: TransactionOverviewCardProps) {
  // Prevent division by zero
  const safeTotal = total || 1
  const completedPercentage = Math.round((completed / safeTotal) * 100)
  const pendingPercentage = Math.round((pending / safeTotal) * 100)
  const atRiskPercentage = Math.round((atRisk / safeTotal) * 100)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>Transaction overview</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-sm text-muted-foreground">Loading transactions...</p>
          </div>
        ) : (
          <>
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
                <Progress value={pendingPercentage} className="h-2 bg-muted" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                    <span>At Risk</span>
                  </div>
                  <span className="font-medium">{atRisk}</span>
                </div>
                <Progress value={atRiskPercentage} className="h-2 bg-muted" />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

