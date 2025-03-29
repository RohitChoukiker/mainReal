"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Eye, CheckSquare, AlertTriangle, CheckCircle, Search, Filter, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TransactionStatusBadge } from "@/components/dashboard/transaction-status-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

interface Transaction {
  id: string
  property: string
  client: string
  agent: {
    name: string
    avatar: string
  }
  status: "pending" | "in_progress" | "at_risk" | "completed" | "cancelled"
  createdDate: string
  closingDate: string
  documents: {
    total: number
    verified: number
  }
  tasks: {
    total: number
    completed: number
  }
  riskLevel?: "low" | "medium" | "high"
  completionPercentage: number
}

export default function TCTransactions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TR-7829",
      property: "123 Main St, Austin, TX",
      client: "Robert Johnson",
      agent: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      status: "at_risk",
      createdDate: "Apr 1, 2025",
      closingDate: "Apr 15, 2025",
      documents: {
        total: 8,
        verified: 5,
      },
      tasks: {
        total: 12,
        completed: 7,
      },
      riskLevel: "high",
      completionPercentage: 60,
    },
    {
      id: "TR-6543",
      property: "456 Oak Ave, Dallas, TX",
      client: "Jennifer Williams",
      agent: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      status: "in_progress",
      createdDate: "Mar 25, 2025",
      closingDate: "Apr 22, 2025",
      documents: {
        total: 8,
        verified: 6,
      },
      tasks: {
        total: 10,
        completed: 6,
      },
      completionPercentage: 75,
    },
    {
      id: "TR-9021",
      property: "789 Pine Rd, Houston, TX",
      client: "Michael Davis",
      agent: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      status: "pending",
      createdDate: "Apr 3, 2025",
      closingDate: "May 3, 2025",
      documents: {
        total: 8,
        verified: 2,
      },
      tasks: {
        total: 12,
        completed: 3,
      },
      completionPercentage: 25,
    },
    {
      id: "TR-5432",
      property: "321 Elm St, San Antonio, TX",
      client: "Lisa Martinez",
      agent: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      status: "completed",
      createdDate: "Mar 5, 2025",
      closingDate: "Apr 5, 2025",
      documents: {
        total: 8,
        verified: 8,
      },
      tasks: {
        total: 12,
        completed: 12,
      },
      completionPercentage: 100,
    },
    {
      id: "TR-8765",
      property: "654 Birch Blvd, Fort Worth, TX",
      client: "David Wilson",
      agent: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      status: "cancelled",
      createdDate: "Feb 15, 2025",
      closingDate: "Mar 20, 2025",
      documents: {
        total: 8,
        verified: 4,
      },
      tasks: {
        total: 10,
        completed: 5,
      },
      completionPercentage: 45,
    },
    {
      id: "TR-3456",
      property: "890 Cedar Ln, Houston, TX",
      client: "Amanda Garcia",
      agent: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      status: "in_progress",
      createdDate: "Mar 28, 2025",
      closingDate: "Apr 28, 2025",
      documents: {
        total: 8,
        verified: 5,
      },
      tasks: {
        total: 14,
        completed: 8,
      },
      completionPercentage: 65,
    },
  ])

  const activeTransactions = transactions.filter((t) => t.status !== "completed" && t.status !== "cancelled")
  const atRiskTransactions = transactions.filter((t) => t.status === "at_risk")
  const completedTransactions = transactions.filter((t) => t.status === "completed")

  // Apply filters
  let filteredTransactions = transactions

  // Apply status filter
  if (statusFilter !== "all") {
    filteredTransactions = filteredTransactions.filter((t) => t.status === statusFilter)
  }

  // Apply search filter
  if (searchQuery) {
    filteredTransactions = filteredTransactions.filter(
      (t) =>
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.property.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.agent.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  const renderTransactionTable = (transactionList: Transaction[]) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction</TableHead>
            <TableHead className="hidden md:table-cell">Client</TableHead>
            <TableHead className="hidden md:table-cell">Agent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Closing Date</TableHead>
            <TableHead>Progress</TableHead>
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
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={transaction.agent.avatar} alt={transaction.agent.name} />
                      <AvatarFallback>{transaction.agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span>{transaction.agent.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <TransactionStatusBadge status={transaction.status} />
                </TableCell>
                <TableCell className="hidden md:table-cell">{transaction.closingDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          transaction.completionPercentage < 30
                            ? "bg-red-500"
                            : transaction.completionPercentage < 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${transaction.completionPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">{transaction.completionPercentage}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/tc/document-review?transaction=${transaction.id}`}>
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">Review documents</span>
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <a href={`/tc/tasks?transaction=${transaction.id}`}>
                        <CheckSquare className="h-4 w-4" />
                        <span className="sr-only">Manage tasks</span>
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
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
      <h1 className="text-3xl font-bold tracking-tight">Assigned Transactions</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
            <CardDescription>Overview of your assigned transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-3 rounded-lg bg-muted/50">
              <div className="mr-3 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <div className="text-sm font-medium">Total Assigned</div>
                <div className="text-xl font-bold">{transactions.length}</div>
              </div>
            </div>

            <div className="flex items-center p-3 rounded-lg bg-muted/50">
              <div className="mr-3 h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <div className="text-sm font-medium">At Risk</div>
                <div className="text-xl font-bold">{atRiskTransactions.length}</div>
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

            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5" />
                <span className="font-medium">Upcoming Closings</span>
              </div>
              <p className="text-sm">
                You have{" "}
                {
                  activeTransactions.filter((t) => {
                    const closingDate = new Date(t.closingDate)
                    const today = new Date()
                    const diffTime = closingDate.getTime() - today.getTime()
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                    return diffDays <= 7 && diffDays > 0
                  }).length
                }{" "}
                transactions closing in the next 7 days.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Transaction List</CardTitle>
                <CardDescription>View and manage your assigned transactions</CardDescription>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search transactions..." />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filter" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="at_risk">At Risk</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="active">
              <TabsList className="grid w-full grid-cols-3 mb-4 mx-4 mt-2">
                <TabsTrigger value="active">Active ({activeTransactions.length})</TabsTrigger>
                <TabsTrigger value="at_risk">At Risk ({atRiskTransactions.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedTransactions.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="active">
                {renderTransactionTable(
                  filteredTransactions.filter((t) => t.status !== "completed" && t.status !== "cancelled"),
                )}
              </TabsContent>

              <TabsContent value="at_risk">
                {renderTransactionTable(filteredTransactions.filter((t) => t.status === "at_risk"))}
              </TabsContent>

              <TabsContent value="completed">
                {renderTransactionTable(filteredTransactions.filter((t) => t.status === "completed"))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Progress</CardTitle>
          <CardDescription>Track the progress of your active transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activeTransactions.map((transaction) => (
              <div key={transaction.id} className="space-y-2">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <h3 className="font-medium">
                      {transaction.id} - {transaction.property}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Agent: {transaction.agent.name} | Closing: {transaction.closingDate}
                    </p>
                  </div>
                  <TransactionStatusBadge status={transaction.status} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Documents</span>
                      <span className="font-medium">
                        {transaction.documents.verified}/{transaction.documents.total}
                      </span>
                    </div>
                    <Progress
                      value={(transaction.documents.verified / transaction.documents.total) * 100}
                      className="h-2 bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Tasks</span>
                      <span className="font-medium">
                        {transaction.tasks.completed}/{transaction.tasks.total}
                      </span>
                    </div>
                    <Progress
                      value={(transaction.tasks.completed / transaction.tasks.total) * 100}
                      className="h-2 bg-muted"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/tc/document-review?transaction=${transaction.id}`}>Review Documents</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/tc/tasks?transaction=${transaction.id}`}>Manage Tasks</a>
                  </Button>
                </div>
              </div>
            ))}

            {activeTransactions.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">No active transactions found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

