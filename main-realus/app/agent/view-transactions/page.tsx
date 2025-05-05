"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface Transaction {
  _id: string
  transactionId: string
  clientName: string
  propertyAddress: string
  transactionType: string
  price: number
  status: string
  createdAt: string
}

export default function ViewTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('/api/agent/transactions/list')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch transactions')
        }

        setTransactions(data.transactions)
      } catch (error) {
        console.error('Error fetching transactions:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch transactions')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-bold text-red-500">Error</h2>
        <p className="mt-2">{error}</p>
        <Button 
          className="mt-4" 
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-bold">No Transactions Found</h2>
        <p className="mt-2 text-muted-foreground">
          You haven't created any transactions yet.
        </p>
        <Button 
          className="mt-4" 
          asChild
        >
          <a href="/agent/new-transaction">Create New Transaction</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">My Transactions</h1>
        <Button asChild>
          <a href="/agent/new-transaction">New Transaction</a>
        </Button>
      </div>

      <div className="grid gap-4">
        {transactions.map((transaction) => (
          <Card key={transaction._id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{transaction.clientName}</CardTitle>
                  <CardDescription className="mt-1">
                    ID: {transaction.transactionId}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {transaction.status}
                  </span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Property</p>
                  <p className="text-sm">{transaction.propertyAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p className="text-sm">{transaction.transactionType}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Price</p>
                  <p className="text-sm">${transaction.price.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" asChild>
                  <a href={`/agent/transactions/${transaction.transactionId}`}>View Details</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}