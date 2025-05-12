"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, FileText } from "lucide-react"
import Link from "next/link"

interface Transaction {
  transactionId: string
  clientName: string
  status: string
  createdAt: string
  propertyAddress?: string
  city?: string
  state?: string
}

export default function TransactionPanel() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/tc/transactions?limit=5')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch transactions: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.transactions && Array.isArray(data.transactions)) {
          // Get the 5 most recent transactions
          setTransactions(data.transactions.slice(0, 5))
        }
      } catch (error) {
        console.error('Error fetching transactions for sidebar:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTransactions()
    
    // Set up polling to refresh transactions every 30 seconds
    const intervalId = setInterval(fetchTransactions, 30000)
    
    return () => clearInterval(intervalId)
  }, [])

  // Format date to a readable format
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (e) {
      return 'Invalid date'
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase()
    if (statusLower === 'new') return 'bg-blue-500'
    if (statusLower === 'inprogress' || statusLower === 'in_progress') return 'bg-yellow-500'
    if (statusLower === 'readyforclosure' || statusLower === 'ready_for_closure') return 'bg-green-500'
    if (statusLower === 'cancelled') return 'bg-red-500'
    return 'bg-gray-500'
  }

  return (
    <Card className="border-dashed">
      <CardHeader className="py-3">
        <CardTitle className="text-sm font-medium">Assigned Transactions</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-3">
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : transactions.length > 0 ? (
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <Link 
                key={transaction.transactionId} 
                href={`/tc/transactions?id=${transaction.transactionId}`}
                className="flex items-center gap-2 rounded-md p-2 text-sm hover:bg-muted transition-colors"
              >
                <div className="flex-shrink-0">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">{transaction.transactionId}</div>
                  <div className="truncate text-xs text-muted-foreground">{transaction.clientName}</div>
                  {transaction.propertyAddress && (
                    <div className="truncate text-xs text-muted-foreground">
                      {transaction.propertyAddress.substring(0, 15)}
                      {transaction.propertyAddress.length > 15 ? '...' : ''}
                      {transaction.city ? `, ${transaction.city}` : ''}
                    </div>
                  )}
                </div>
                <Badge 
                  variant="outline" 
                  className="ml-auto text-[10px] h-5 px-1.5 whitespace-nowrap"
                >
                  {transaction.status}
                </Badge>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-3 text-center text-xs text-muted-foreground">
            No transactions found
          </div>
        )}
        <div className="mt-3 pt-3 border-t">
          <Link 
            href="/tc/transactions" 
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            View all transactions →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}