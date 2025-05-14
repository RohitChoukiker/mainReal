"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error("Error caught by error boundary:", error)
      setHasError(true)
      setError(error.error || new Error("An unknown error occurred"))
    }

    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error("Unhandled promise rejection caught by error boundary:", event)
      setHasError(true)
      setError(event.reason || new Error("An unhandled promise rejection occurred"))
    }

    // Add event listener for uncaught errors
    window.addEventListener("error", errorHandler)

    // Add event listener for unhandled promise rejections
    window.addEventListener("unhandledrejection", rejectionHandler)

    // Cleanup
    return () => {
      window.removeEventListener("error", errorHandler)
      window.removeEventListener("unhandledrejection", rejectionHandler)
    }
  }, [])

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle>Something went wrong</CardTitle>
            </div>
            <CardDescription>
              We apologize for the inconvenience. An unexpected error has occurred.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-3 rounded-md text-sm overflow-auto max-h-32">
              {error?.message || "Unknown error"}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = "/"}
            >
              Go to Home
            </Button>
            <Button 
              onClick={() => {
                setHasError(false)
                setError(null)
                window.location.reload()
              }}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}