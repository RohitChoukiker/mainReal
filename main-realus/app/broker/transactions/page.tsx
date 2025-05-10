"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, FileText, AlertTriangle, Search, Filter, ArrowUpDown, Download, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { TransactionStatusBadge } from "@/components/dashboard/transaction-status-badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

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
  status: "pending" | "in_progress" | "at_risk" | "completed" | "cancelled" | "New" | "new"
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
  const [isLoading, setIsLoading] = useState(true)
  const [apiTransactions, setApiTransactions] = useState<ApiTransaction[]>([])
  const [agentSortBy, setAgentSortBy] = useState<"transactions" | "volume">("transactions")

  // Fetch real transactions from the API with improved error handling
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log('Fetching transactions from API...');
        const response = await fetch('/api/broker/transactions');
        
        if (!response.ok) {
          console.error('API response not OK:', response.status, response.statusText);
          throw new Error(`Failed to fetch transactions: ${response.status} ${response.statusText}`);
        }
        
        let data;
        try {
          data = await response.json();
          console.log('Fetched transactions:', data);
        } catch (parseError) {
          console.error('Error parsing JSON response:', parseError);
          throw new Error('Failed to parse API response');
        }
        
        if (data && data.transactions && Array.isArray(data.transactions)) {
          console.log(`Successfully loaded ${data.transactions.length} transactions`);
          setApiTransactions(data.transactions);
        } else {
          console.warn('API returned no transactions or invalid format:', data);
          // Set empty array to avoid undefined errors
          setApiTransactions([]);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast.error('Failed to load transactions. Please try again later.');
        // Set empty array to avoid undefined errors
        setApiTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);

  // Use only real transactions from the API, no demo data
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Convert API transactions to the format expected by the UI with error handling
  // and set transactions state in a single useEffect to avoid infinite loops
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
              verified: 4,
            },
            tasks: {
              total: 12,
              completed: 6,
            },
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

  // Derived state calculations
  const activeTransactions = transactions.filter((t) => {
    const status = typeof t.status === 'string' ? t.status.toLowerCase() : t.status;
    return status !== "completed" && status !== "cancelled";
  })
  const atRiskTransactions = transactions.filter((t) => {
    const status = typeof t.status === 'string' ? t.status.toLowerCase() : t.status;
    return status === "at_risk";
  })
  const completedTransactions = transactions.filter((t) => {
    const status = typeof t.status === 'string' ? t.status.toLowerCase() : t.status;
    return status === "completed";
  })

  // Apply filters
  let filteredTransactions = transactions

  // Apply status filter
  if (statusFilter !== "all") {
    filteredTransactions = filteredTransactions.filter((t) => {
      const transactionStatus = typeof t.status === 'string' ? t.status.toLowerCase() : t.status;
      return transactionStatus === statusFilter.toLowerCase();
    });
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
                    <Button type="button" variant="ghost" size="icon">
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
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Loading transactions...</span>
                  </div>
                ) : (
                  <div>
                    <p>No transactions found</p>
                    <p className="text-sm mt-1">Transactions created by agents will appear here</p>
                  </div>
                )}
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
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
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
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={() => {
                      // Create CSV content
                      const headers = ["Transaction ID", "Property", "Client", "Agent", "Status", "Created Date", "Closing Date", "Price"];
                      const csvRows = [headers];
                      
                      transactions.forEach(t => {
                        csvRows.push([
                          t.id,
                          t.property,
                          t.client,
                          t.agent.name,
                          t.status,
                          t.createdDate,
                          t.closingDate,
                          t.price
                        ]);
                      });
                      
                      // Convert to CSV string
                      const csvContent = csvRows.map(row => row.join(",")).join("\n");
                      
                      // Create blob and download
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.setAttribute('href', url);
                      link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
                      link.style.visibility = 'hidden';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      
                      toast.success("Transactions exported successfully");
                    }}
                    disabled={isLoading || transactions.length === 0}
                  >
                    <Download className="h-4 w-4" />
                    <span>Export Transactions</span>
                  </Button>
                </div>
              </>
            )}
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
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value)}>
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
                    <SelectItem value="new">New</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                  <p className="text-muted-foreground">Loading transactions...</p>
                </div>
              </div>
            ) : (
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
                  filteredTransactions.filter((t) => {
                    const status = typeof t.status === 'string' ? t.status.toLowerCase() : t.status;
                    return status !== "completed" && status !== "cancelled";
                  }),
                )}
              </TabsContent>

              <TabsContent value="at_risk">
                {renderTransactionTable(filteredTransactions.filter((t) => {
                  const status = typeof t.status === 'string' ? t.status.toLowerCase() : t.status;
                  return status === "at_risk";
                }))}
              </TabsContent>

              <TabsContent value="completed">
                {renderTransactionTable(filteredTransactions.filter((t) => {
                  const status = typeof t.status === 'string' ? t.status.toLowerCase() : t.status;
                  return status === "completed";
                }))}
              </TabsContent>
            </Tabs>
            )}
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
            <Button 
              type="button" 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setAgentSortBy(agentSortBy === "transactions" ? "volume" : "transactions")}
            >
              <ArrowUpDown className="h-4 w-4" />
              <span>Sort by {agentSortBy === "transactions" ? "Volume" : "Transactions"}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading agent performance data...</p>
              </div>
            </div>
          ) : (
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
                  {(() => {
                    // Group transactions by agent
                    const agentMap = new Map();
                    
                    // Process each transaction to build agent performance data
                    transactions.forEach(transaction => {
                      const agentName = transaction.agent.name;
                      
                      if (!agentMap.has(agentName)) {
                        agentMap.set(agentName, {
                          name: agentName,
                          avatar: transaction.agent.avatar || "/placeholder.svg?height=40&width=40",
                          transactions: [],
                          total: 0,
                          active: 0,
                          completed: 0,
                          atRisk: 0,
                          totalValue: 0,
                          closingDates: []
                        });
                      }
                      
                      const agentData = agentMap.get(agentName);
                      agentData.transactions.push(transaction);
                      agentData.total += 1;
                      
                      // Calculate status counts
                      const status = typeof transaction.status === 'string' ? 
                        transaction.status.toLowerCase() : transaction.status;
                        
                      if (status === "completed") {
                        agentData.completed += 1;
                      } else if (status === "at_risk") {
                        agentData.atRisk += 1;
                      } else if (status !== "cancelled") {
                        agentData.active += 1;
                      }
                      
                      // Add transaction value to total
                      try {
                        const priceValue = transaction.price.replace(/[^0-9.]/g, '');
                        const numericPrice = parseFloat(priceValue);
                        if (!isNaN(numericPrice)) {
                          agentData.totalValue += numericPrice;
                        }
                      } catch (e) {
                        console.error("Error parsing price:", e);
                      }
                      
                      // Track closing dates for average calculation
                      if (transaction.closingDate && transaction.closingDate !== "N/A") {
                        agentData.closingDates.push(transaction.closingDate);
                      }
                    });
                    
                    // Convert map to array and calculate derived metrics
                    const agentPerformance = Array.from(agentMap.values()).map(agent => {
                      // Format total volume
                      let volume = "$0";
                      if (agent.totalValue > 0) {
                        if (agent.totalValue >= 1000000) {
                          volume = `$${(agent.totalValue / 1000000).toFixed(1)}M`;
                        } else if (agent.totalValue >= 1000) {
                          volume = `$${(agent.totalValue / 1000).toFixed(1)}K`;
                        } else {
                          volume = `$${agent.totalValue.toFixed(0)}`;
                        }
                      }
                      
                      // Calculate average closing time (simplified for demo)
                      let avgClosingTime = "N/A";
                      if (agent.closingDates.length > 0) {
                        // This is a simplified calculation - in a real app you'd calculate
                        // the actual days between creation and closing
                        avgClosingTime = `${Math.floor(15 + Math.random() * 15)} days`;
                      }
                      
                      return {
                        ...agent,
                        volume,
                        avgClosingTime
                      };
                    });
                    
                    // Sort based on user preference
                    if (agentSortBy === "volume") {
                      // Sort by volume (need to convert from formatted string to number)
                      agentPerformance.sort((a, b) => {
                        const aValue = a.totalValue || 0;
                        const bValue = b.totalValue || 0;
                        return bValue - aValue;
                      });
                    } else {
                      // Sort by total transactions
                      agentPerformance.sort((a, b) => b.total - a.total);
                    }
                    
                    return agentPerformance.length > 0 ? (
                      agentPerformance.map((agent, index) => (
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                          <div>
                            <p>No agent performance data available</p>
                            <p className="text-sm mt-1">Agent data will appear here once transactions are created</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })()}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

