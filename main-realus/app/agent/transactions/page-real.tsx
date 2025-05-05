"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, FileText, Upload, CheckSquare, AlertTriangle, Clock, CheckCircle, Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface Transaction {
  _id: string
  transactionId: string
  clientName: string
  propertyAddress: string
  city: string
  state: string
  zipCode: string
  transactionType: string
  price: number
  status: string
  closingDate: string
  createdAt: string
}

export default function MyTransactions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/agent/transactions/list')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch transactions')
        }

        setTransactions(data.transactions || [])
      } catch (error) {
        console.error('Error fetching transactions:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch transactions')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  // Filter transactions based on status
  const activeTransactions = transactions.filter(t => t.status === "New" || t.status === "InProgress" || t.status === "PendingDocuments" || t.status === "UnderReview")
  const completedTransactions = transactions.filter(t => t.status === "Approved" || t.status === "Closed")
  const cancelledTransactions = transactions.filter(t => t.status === "Cancelled")

  // Filter transactions based on search query
  const filteredTransactions = searchQuery
    ? transactions.filter(
        (t) =>
          t.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.clientName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : transactions

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return <Badge className="bg-blue-500">New</Badge>
      case "InProgress":
        return <Badge className="bg-yellow-500">In Progress</Badge>
      case "PendingDocuments":
        return <Badge className="bg-orange-500">Pending Documents</Badge>
      case "UnderReview":
        return <Badge className="bg-purple-500">Under Review</Badge>
      case "Approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "Closed":
        return <Badge className="bg-green-700">Closed</Badge>
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const renderTransactionTable = (transactionList: Transaction[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction</TableHead>
            <TableHead className="hidden md:table-cell">Client</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="hidden md:table-cell">Closing Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactionList.length > 0 ? (
            transactionList.map((transaction) => (
              <TableRow key={transaction._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{transaction.transactionId}</div>
                      <div className="text-xs text-muted-foreground">
                        {transaction.propertyAddress}, {transaction.city}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{transaction.clientName}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(transaction.createdAt)}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(transaction.closingDate)}</TableCell>
                <TableCell>
                  {getStatusBadge(transaction.status)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/agent/transactions/${transaction.transactionId}`}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </a>
                    </Button>
                    {(transaction.status !== "Approved" && transaction.status !== "Closed" && transaction.status !== "Cancelled") && (
                      <>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`/agent/upload-documents?transactionId=${transaction.transactionId}`}>
                            <Upload className="h-4 w-4" />
                            <span className="sr-only">Upload documents</span>
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <a href="/agent/tasks">
                            <CheckSquare className="h-4 w-4" />
                            <span className="sr-only">View tasks</span>
                          </a>
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Loading transactions...
                  </div>
                ) : (
                  "No transactions found"
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">My Transactions</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
            <CardDescription>Overview of your transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-3 rounded-lg bg-muted/50">
              <div className="mr-3 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <div className="text-sm font-medium">Active</div>
                <div className="text-xl font-bold">{activeTransactions.length}</div>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg bg-muted/50">
              <div className="mr-3 h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <div className="text-sm font-medium">Completed</div>
                <div className="text-xl font-bold">{completedTransactions.length}</div>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg bg-muted/50">
              <div className="mr-3 h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-300" />
              </div>
              <div>
                <div className="text-sm font-medium">Cancelled</div>
                <div className="text-xl font-bold">{cancelledTransactions.length}</div>
              </div>
            </div>

            <div className="mt-6">
              <Button asChild className="w-full">
                <a href="/agent/new-transaction">Create New Transaction</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Transaction List</CardTitle>
                <CardDescription>View and manage your real estate transactions</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search transactions..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="active">
              <TabsList className="grid w-full grid-cols-3 mb-4 mx-4 mt-2">
                <TabsTrigger value="active">Active ({activeTransactions.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedTransactions.length})</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled ({cancelledTransactions.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active">{renderTransactionTable(activeTransactions)}</TabsContent>
              <TabsContent value="completed">{renderTransactionTable(completedTransactions)}</TabsContent>
              <TabsContent value="cancelled">{renderTransactionTable(cancelledTransactions)}</TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}