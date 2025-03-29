"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, FileText, AlertTriangle, Search, Filter, ArrowUpDown, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TransactionStatusBadge } from "@/components/dashboard/transaction-status-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  price: string
  documents: {
    total: number
    verified: number
  }
  tasks: {
    total: number
    completed: number
  }
  riskLevel?: "low" | "medium" | "high"
}

export default function BrokerTransactions() {
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
      price: "$450,000",
      documents: {
        total: 8,
        verified: 5,
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
      agent: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      status: "in_progress",
      createdDate: "Mar 25, 2025",
      closingDate: "Apr 22, 2025",
      price: "$375,000",
      documents: {
        total: 8,
        verified: 6,
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
      agent: {
        name: "Michael Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      status: "pending",
      createdDate: "Apr 3, 2025",
      closingDate: "May 3, 2025",
      price: "$525,000",
      documents: {
        total: 8,
        verified: 2,
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
      agent: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      status: "completed",
      createdDate: "Mar 5, 2025",
      closingDate: "Apr 5, 2025",
      price: "$410,000",
      documents: {
        total: 8,
        verified: 8,
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
      agent: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      status: "cancelled",
      createdDate: "Feb 15, 2025",
      closingDate: "Mar 20, 2025",
      price: "$390,000",
      documents: {
        total: 8,
        verified: 4,
      },
      tasks: {
        total: 10,
        completed: 5,
      },
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
      price: "$495,000",
      documents: {
        total: 8,
        verified: 5,
      },
      tasks: {
        total: 14,
        completed: 8,
      },
    },
    {
      id: "TR-2345",
      property: "234 Birch Ave, Dallas, TX",
      client: "James Taylor",
      agent: {
        name: "John Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      status: "completed",
      createdDate: "Mar 1, 2025",
      closingDate: "Apr 1, 2025",
      price: "$350,000",
      documents: {
        total: 8,
        verified: 8,
      },
      tasks: {
        total: 12,
        completed: 12,
      },
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
            <TableHead className="hidden md:table-cell">Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Closing Date</TableHead>
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
                <TableCell className="hidden md:table-cell">{transaction.price}</TableCell>
                <TableCell>
                  <TransactionStatusBadge status={transaction.status} />
                </TableCell>
                <TableCell className="hidden md:table-cell">{transaction.closingDate}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
      <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Transaction Summary</CardTitle>
            <CardDescription>Overview of all transactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-3 rounded-lg bg-muted/50">
              <div className="mr-3 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <div className="text-sm font-medium">Total Transactions</div>
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
                <FileText className="h-5 w-5 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <div className="text-sm font-medium">Active</div>
                <div className="text-xl font-bold">{activeTransactions.length}</div>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export Transactions</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Transaction List</CardTitle>
                <CardDescription>View and manage all brokerage transactions</CardDescription>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
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
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-4 mb-4 mx-4 mt-2">
                <TabsTrigger value="all">All ({transactions.length})</TabsTrigger>
                <TabsTrigger value="active">Active ({activeTransactions.length})</TabsTrigger>
                <TabsTrigger value="at_risk">At Risk ({atRiskTransactions.length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({completedTransactions.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all">{renderTransactionTable(filteredTransactions)}</TabsContent>

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Transaction Performance by Agent</CardTitle>
              <CardDescription>Compare transaction metrics across agents</CardDescription>
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              <span>Sort by Volume</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Total Transactions</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>At Risk</TableHead>
                  <TableHead>Total Volume</TableHead>
                  <TableHead>Avg. Closing Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    name: "John Smith",
                    avatar: "/placeholder.svg?height=40&width=40",
                    total: 24,
                    active: 10,
                    completed: 12,
                    atRisk: 2,
                    volume: "$8.2M",
                    avgClosingTime: "21 days",
                  },
                  {
                    name: "Sarah Johnson",
                    avatar: "/placeholder.svg?height=40&width=40",
                    total: 18,
                    active: 8,
                    completed: 9,
                    atRisk: 1,
                    volume: "$6.5M",
                    avgClosingTime: "19 days",
                  },
                  {
                    name: "Michael Brown",
                    avatar: "/placeholder.svg?height=40&width=40",
                    total: 15,
                    active: 7,
                    completed: 7,
                    atRisk: 1,
                    volume: "$5.8M",
                    avgClosingTime: "24 days",
                  },
                ].map((agent, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={agent.avatar} alt={agent.name} />
                          <AvatarFallback>{agent.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{agent.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{agent.total}</TableCell>
                    <TableCell>{agent.active}</TableCell>
                    <TableCell>{agent.completed}</TableCell>
                    <TableCell>{agent.atRisk}</TableCell>
                    <TableCell>{agent.volume}</TableCell>
                    <TableCell>{agent.avgClosingTime}</TableCell>
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

