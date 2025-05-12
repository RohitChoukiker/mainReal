"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Eye, CheckSquare, AlertTriangle, CheckCircle, Search, Filter, Calendar, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TransactionStatusBadge } from "@/components/dashboard/transaction-status-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { TransactionDetailsModal } from "@/components/dashboard/transaction-details-modal"

interface ApiTransaction {
  transactionId: string;
  propertyAddress: string;
  city: string;
  state: string;
  clientName: string;
  agentId: string;
  status: string;
  createdAt: string;
  closingDate: string;
  price: number;
}

interface Transaction {
  id: string
  property: string
  client: string
  agent: {
    name: string
    avatar: string
  }
  status: "pending" | "in_progress" | "at_risk" | "completed" | "cancelled" | "New" | "new" | "ready_for_closure"
  createdDate: string
  closingDate: string
  price?: string
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
  const [isLoading, setIsLoading] = useState(true)
  const [apiTransactions, setApiTransactions] = useState<ApiTransaction[]>([])
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [error, setError] = useState<string | null>(null)

  // Function to open transaction details modal
  const openTransactionModal = (transaction: Transaction) => {
    console.log("Opening modal for transaction:", transaction)
    setSelectedTransaction(transaction)
    setIsDetailsModalOpen(true)
  }

  // Fetch real transactions from the API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log('Fetching transactions from API...')
        setIsLoading(true)
        const response = await fetch('/api/tc/transactions')
        
        if (!response.ok) {
          console.error('API response not OK:', response.status, response.statusText)
          throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`)
        }
        
        let data
        try {
          data = await response.json()
          console.log('Fetched transactions:', data)
        } catch (parseError) {
          console.error('Error parsing JSON response:', parseError)
          throw new Error('Failed to parse API response')
        }
        
        if (data && data.transactions && Array.isArray(data.transactions)) {
          console.log(`Successfully loaded ${data.transactions.length} transactions`)
          setApiTransactions(data.transactions)
        } else {
          console.warn('API returned no transactions or invalid format:', data)
          // Set empty array to avoid undefined errors
          setApiTransactions([])
        }
      } catch (error) {
        console.error('Error fetching transactions:', error)
        toast.error('Failed to load transactions. Please try again later.')
        // Set empty array to avoid undefined errors
        setApiTransactions([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTransactions()
  }, [])

  // Convert API transactions to the format expected by the UI with useEffect
  useEffect(() => {
    if (isLoading) return;
    
    try {
      console.log('Converting and setting transactions from API data');
      
      const convertedTransactions: Transaction[] = apiTransactions.map(t => {
        try {
          // Safely format dates with fallbacks
          let createdDate = "N/A";
          let closingDate = "N/A";
          
          try {
            if (t.createdAt) {
              createdDate = new Date(t.createdAt).toLocaleDateString();
            }
          } catch (e) {
            console.error("Error formatting createdAt date:", e);
          }
          
          try {
            if (t.closingDate) {
              closingDate = new Date(t.closingDate).toLocaleDateString();
            }
          } catch (e) {
            console.error("Error formatting closingDate date:", e);
          }
          
          // Format price with fallback
          let formattedPrice = "$0";
          try {
            if (t.price) {
              formattedPrice = `$${t.price.toLocaleString()}`;
            }
          } catch (e) {
            console.error("Error formatting price:", e);
          }
          
          // Calculate completion percentage (random for now)
          const completionPercentage = Math.floor(Math.random() * 100);
          
          return {
            id: t.transactionId || `TR-${Math.floor(Math.random() * 10000)}`,
            property: t.propertyAddress ? 
              `${t.propertyAddress}${t.city ? `, ${t.city}` : ''}${t.state ? `, ${t.state}` : ''}` : 
              "Address not available",
            client: t.clientName || "Unknown Client",
            agent: {
              name: t.agentId || "Unknown Agent",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            status: (t.status || "pending") as any,
            createdDate,
            closingDate,
            price: formattedPrice,
            documents: {
              total: 8,
              verified: Math.floor(Math.random() * 9),
            },
            tasks: {
              total: 12,
              completed: Math.floor(Math.random() * 13),
            },
            completionPercentage,
          };
        } catch (error) {
          console.error("Error converting transaction:", error, t);
          // Return a fallback transaction object if conversion fails
          return {
            id: `TR-${Math.floor(Math.random() * 10000)}`,
            property: "Error loading property details",
            client: "Unknown",
            agent: {
              name: "Unknown Agent",
              avatar: "/placeholder.svg?height=40&width=40",
            },
            status: "pending" as any,
            createdDate: "N/A",
            closingDate: "N/A",
            price: "$0",
            documents: {
              total: 0,
              verified: 0,
            },
            tasks: {
              total: 0,
              completed: 0,
            },
            completionPercentage: 0,
          };
        }
      });
      
      console.log(`Setting ${convertedTransactions.length} transactions`);
      setTransactions(convertedTransactions || []);
    } catch (error) {
      console.error('Error setting transactions:', error);
      // Set empty array as fallback
      setTransactions([]);
    }
  }, [apiTransactions, isLoading]);

  const activeTransactions = transactions.filter((t) => t.status !== "completed" && t.status !== "cancelled" && t.status !== "ready_for_closure")
  const atRiskTransactions = transactions.filter((t) => t.status === "at_risk")
  const readyForClosureTransactions = transactions.filter((t) => t.status === "ready_for_closure")
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  <span>Loading transactions...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : transactionList.length > 0 ? (
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
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openTransactionModal(transaction)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                    {transaction.status === "ready_for_closure" && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => window.location.href = `/tc/ready-for-closure?transaction=${transaction.id}`}
                      >
                        Forward to Broker
                      </Button>
                    )}
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
                    <SelectItem value="ready_for_closure">Ready for Closure</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="active">
              <TabsList className="grid w-full grid-cols-4 mb-4 mx-4 mt-2">
                <TabsTrigger value="active">Active ({activeTransactions.length})</TabsTrigger>
                <TabsTrigger value="at_risk">At Risk ({atRiskTransactions.length})</TabsTrigger>
                <TabsTrigger value="ready_for_closure">Ready for Closure ({readyForClosureTransactions.length})</TabsTrigger>
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

              <TabsContent value="ready_for_closure">
                {renderTransactionTable(filteredTransactions.filter((t) => t.status === "ready_for_closure"))}
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
      
      {/* Transaction Details Modal */}
      {isDetailsModalOpen && selectedTransaction && (
        <TransactionDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            console.log("Closing modal...");
            setIsDetailsModalOpen(false);
          }}
          transaction={selectedTransaction}
        />
      )}
    </div>
  )
}

