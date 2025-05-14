import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"

export interface DelayPrediction {
  transactionId: string
  property: string
  currentStage: string
  delayProbability: number
  estimatedDelay: number
  reason: string
}

interface AIDelayPredictionWidgetProps {
  predictions: DelayPrediction[]
}

export function AIDelayPredictionWidget({ predictions }: AIDelayPredictionWidgetProps) {
  const getDelayIcon = (probability: number) => {
    if (probability < 30) return <CheckCircle className="h-5 w-5 text-green-500" />
    if (probability < 70) return <Clock className="h-5 w-5 text-yellow-500" />
    return <AlertTriangle className="h-5 w-5 text-red-500" />
  }

  const getDelayColor = (probability: number) => {
    if (probability < 30) return "bg-green-500"
    if (probability < 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">AI Delay Predictions</CardTitle>
        <CardDescription>Potential delays in your transactions</CardDescription>
      </CardHeader>
      <CardContent className="px-2">
        <div className="space-y-4">
          {predictions.map((prediction) => (
            <div key={prediction.transactionId} className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium">{prediction.property}</p>
                  <p className="text-xs text-muted-foreground">
                    ID: {prediction.transactionId} • {prediction.currentStage}
                  </p>
                </div>
                <div>{getDelayIcon(prediction.delayProbability)}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span>Delay Probability</span>
                  <span className="font-medium">{prediction.delayProbability}%</span>
                </div>
                <Progress
                  value={prediction.delayProbability}
                  className="h-1.5"
                  indicatorClassName={getDelayColor(prediction.delayProbability)}
                />
              </div>

              {prediction.delayProbability > 30 && (
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Potential Delay:</span> {prediction.estimatedDelay} days
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Reason:</span> {prediction.reason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

