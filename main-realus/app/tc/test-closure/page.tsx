"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export default function TestClosurePage() {
  const [transactionId, setTransactionId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const checkTransactionStatus = async () => {
    if (!transactionId) {
      toast({
        title: "Error",
        description: "Please enter a transaction ID",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch(`/api/tc/transactions/check-closure-status?transactionId=${transactionId}`)
      const data = await response.json()
      
      setResult(data)
      
      if (response.ok) {
        toast({
          title: "Success",
          description: data.message
        })
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to check transaction status",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("Error checking transaction status:", error)
      toast({
        title: "Error",
        description: "Failed to check transaction status",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Test Transaction Ready for Closure</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Check Transaction Status</CardTitle>
          <CardDescription>
            Enter a transaction ID to check if it's ready for closure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <div className="flex gap-2">
                <Input
                  id="transactionId"
                  placeholder="Enter transaction ID (e.g., TR-12345)"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                />
                <Button onClick={checkTransactionStatus} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Check Status"
                  )}
                </Button>
              </div>
            </div>
            
            {result && (
              <div className="mt-4 p-4 border rounded-md bg-muted">
                <h3 className="font-semibold mb-2">Result:</h3>
                <pre className="text-sm overflow-auto p-2 bg-background rounded">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">How to Test:</h3>
              <ol className="list-decimal list-inside space-y-2 mt-2">
                <li>Enter a valid transaction ID in the input field above</li>
                <li>Click "Check Status" to verify if the transaction is ready for closure</li>
                <li>The system will check if all requirements are met:
                  <ul className="list-disc list-inside ml-6 mt-1">
                    <li>All tasks are completed</li>
                    <li>All documents are verified</li>
                    <li>All complaints are resolved</li>
                  </ul>
                </li>
                <li>If all conditions are met, the transaction status will be updated to "ReadyForClosure"</li>
                <li>Check the result section for detailed information</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold">After Testing:</h3>
              <p className="mt-2">
                Go to the <a href="/tc/ready-for-closure" className="text-primary underline">Ready for Closure</a> page to see all transactions that are ready for closure.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}