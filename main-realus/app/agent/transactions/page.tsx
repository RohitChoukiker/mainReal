"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, FileText, Upload, CheckSquare, AlertTriangle, Clock, CheckCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TransactionStatusBadge } from "@/components/dashboard/transaction-status-badge"

interface Transaction {
  id: string
  property: string
  client: string
  status: "pending" | "in_progress" | "at_risk" | "completed" | "cancelled"
  createdDate: string
  closingDate: string
  price: string
  documents: {
    total: number
    uploaded: number
  }
  tasks: {
    total: number
    completed: number
  }
  riskLevel?: "low" | "medium" | "high"
}

export default function MyTransactions() {
  const [searchQuery, setSearchQuery] = useState("")

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TR-7829",
      property: "123 Main St, Austin, TX",
      client: "Robert Johnson",
      status: "at_risk",
      createdDate: "Apr 1, 2025",
      closingDate: "Apr 15, 2025",
      price: "$450,000",
      documents: {
        total: 8,
        uploaded: 5,
      },
      tasks: {
        total: 12,
        completed: 7,
      },
      riskLevel: "high",
    },
    {
      id: "TR-6543",
      property: "456 Oak Ave, Dallas, TX",
      client: "Jennifer Williams",
      status: "in_progress",
      createdDate: "Mar 25, 2025",
      closingDate: "Apr 22, 2025",
      price: "$375,000",
      documents: {
        total: 8,
        uploaded: 6,
      },
      tasks: {
        total: 10,
        completed: 6,
      },
    },
    {
      id: "TR-9021",
      property: "789 Pine Rd, Houston, TX",
      client: "Michael Davis",
      status: "pending",
      createdDate: "Apr 3, 2025",
      closingDate: "May 3, 2025",
      price: "$525,000",
      documents: {
        total: 8,
        uploaded: 2,
      },
      tasks: {
        total: 12,
        completed: 3,
      },
    },
    {
      id: "TR-5432",
      property: "321 Elm St, San Antonio, TX",
      client: "Lisa Martinez",
      status: "completed",
      createdDate: "Mar 5, 2025",
      closingDate: "Apr 5, 2025",
      price: "$410,000",
      documents: {
        total: 8,
        uploaded: 8,
      },
      tasks: {
        total: 12,
        completed: 12,
      },
    },
    {
      id: "TR-8765",
      property: "654 Birch Blvd, Fort Worth, TX",
      client: "David Wilson",
      status: "cancelled",
      createdDate: "Feb 15, 2025",
      closingDate: "Mar 20, 2025",
      price: "$390,000",
      documents: {
        total: 8,
        uploaded: 4,
      },
      tasks: {
        total: 10,
        completed: 5,
      },
    },
  ])

  const activeTransactions = transactions.filter((t) => t.status !== "completed" && t.status !== "cancelled")
  const completedTransactions = transactions.filter((t) => t.status === "completed")
  const cancelledTransactions = transactions.filter((t) => t.status === "cancelled")

  const filteredTransactions = searchQuery
    ? transactions.filter(
        (t) =>
          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.client.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : transactions

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
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{transaction.id}</div>
                      <div className="text-xs text-muted-foreground">{transaction.property}</div>
                    </div>
                    {transaction.riskLevel === "high" && <AlertTriangle className="h-4 w-4 text-destructive" />}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{transaction.client}</TableCell>
                <TableCell className="hidden md:table-cell">{transaction.createdDate}</TableCell>
                <TableCell className="hidden md:table-cell">{transaction.closingDate}</TableCell>
                <TableCell>
                  <TransactionStatusBadge status={transaction.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                    {transaction.status !== "completed" && transaction.status !== "cancelled" && (
                      <>
                        <Button variant="ghost" size="icon" asChild>
                          <a href="/agent/upload-documents">
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
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )

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

      <Card>
        <CardHeader>
          <CardTitle>Transaction Progress</CardTitle>
          <CardDescription>Track the progress of your active transactions</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead>Documents</TableHead>
                  <TableHead>Tasks</TableHead>
                  <TableHead className="hidden md:table-cell">Closing Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{transaction.id}</div>
                          <div className="text-xs text-muted-foreground">{transaction.property}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{transaction.price}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-xs flex justify-between">
                          <span>Documents</span>
                          <span>
                            {transaction.documents.uploaded}/{transaction.documents.total}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{
                              width: `${(transaction.documents.uploaded / transaction.documents.total) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-xs flex justify-between">
                          <span>Tasks</span>
                          <span>
                            {transaction.tasks.completed}/{transaction.tasks.total}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${(transaction.tasks.completed / transaction.tasks.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{transaction.closingDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href="/agent/upload-documents">Upload Documents</a>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">View details</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

