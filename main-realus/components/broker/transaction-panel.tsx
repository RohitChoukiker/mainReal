"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Eye, AlertTriangle, RefreshCcw } from "lucide-react"
import Link from "next/link"

interface Agent {
  _id: string
  name: string
  email: string
  mobile: string
}

interface Transaction {
  id: string
  property: string
  client: string
  agentId: string
  agentName?: string
  status: string
  createdDate: string
  timestamp: number
  brokerId?: string
}

interface AgentTransactions {
  agent: Agent
  transactions: Transaction[]
}

export default function TransactionPanel() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [agents, setAgents] = useState<Agent[]>([])
  const [agentTransactions, setAgentTransactions] = useState<AgentTransactions[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newTransactionAlert, setNewTransactionAlert] = useState(false)
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date())

  // Function to fetch agents
  const fetchAgents = async () => {
    try {
      const response = await fetch("/api/broker/agents", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache"
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch agents: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("Fetched agent data:", data)
      
      if (!data.agents || !Array.isArray(data.agents)) {
        throw new Error("Invalid agent response format")
      }
      
      setAgents(data.agents)
      return data.agents
    } catch (error) {
      console.error("Error fetching agents:", error)
      return []
    }
  }

  // Function to fetch transactions
  const fetchTransactions = async () => {
    try {
      // Only set loading to true on initial load, not during polling updates
      if (transactions.length === 0 && agentTransactions.length === 0) {
        setLoading(true)
      }
      setError(null)
      
      // Fetch agents first
      const agentsList = await fetchAgents()
      
      // Use the broker-specific API endpoint with a timestamp to prevent caching
      const timestamp = new Date().getTime()
      const response = await fetch(`/api/broker/transactions?limit=50&_t=${timestamp}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.transactions || !Array.isArray(data.transactions)) {
        throw new Error("Invalid response format")
      }
      
      // Transform the data to match our component's expected format
      const formattedTransactions = data.transactions.map((tx: any) => ({
        id: tx.transactionId || tx._id,
        property: tx.propertyAddress ? 
          `${tx.propertyAddress}${tx.city ? `, ${tx.city}` : ''}${tx.state ? `, ${tx.state}` : ''}` : 
          "Address not available",
        client: tx.clientName || "Client name not available",
        agentId: tx.agentId || "unknown",
        status: (tx.status || "pending").toLowerCase(),
        createdDate: tx.createdAt ? 
          new Date(tx.createdAt).toLocaleDateString() : 
          new Date().toLocaleDateString(),
        timestamp: tx.createdAt ? new Date(tx.createdAt).getTime() : Date.now(),
        brokerId: tx.brokerId // Use the actual broker ID from the database
      }))
      
      // Sort transactions by timestamp (newest first)
      formattedTransactions.sort((a, b) => b.timestamp - a.timestamp)
      
      // Only update state if there are changes to avoid unnecessary re-renders
      const currentIds = new Set(transactions.map(t => t.id))
      const newIds = new Set(formattedTransactions.map(t => t.id))
      
      // Check if there are new transactions or status changes
      const hasChanges = formattedTransactions.length !== transactions.length || 
        formattedTransactions.some(tx => !currentIds.has(tx.id)) ||
        transactions.some(tx => !newIds.has(tx.id)) ||
        formattedTransactions.some(tx => {
          const existingTx = transactions.find(t => t.id === tx.id)
          return existingTx && existingTx.status !== tx.status
        })
      
      if (hasChanges) {
        // Check if there are new transactions
        const hasNewTransactions = formattedTransactions.some(tx => !currentIds.has(tx.id))
        
        if (hasNewTransactions) {
          // Show new transaction alert
          setNewTransactionAlert(true)
          // Auto-hide the alert after 3 seconds
          setTimeout(() => setNewTransactionAlert(false), 3000)
        }
        
        // Update last update time
        setLastUpdateTime(new Date())
        
        setTransactions(formattedTransactions)
        
        // Group transactions by agent
        const agentMap = new Map<string, Agent>()
        agentsList.forEach((agent: Agent) => {
          agentMap.set(agent._id, agent)
        })
        
        // Create a map to group transactions by agent
        const transactionsByAgent = new Map<string, Transaction[]>()
        
        // Initialize with all agents, even those without transactions
        agentsList.forEach((agent: Agent) => {
          transactionsByAgent.set(agent._id, [])
        })
        
        // Add transactions to their respective agents
        formattedTransactions.forEach((transaction: Transaction) => {
          const agentId = transaction.agentId
          if (transactionsByAgent.has(agentId)) {
            transactionsByAgent.get(agentId)?.push(transaction)
          } else {
            // For transactions with agents not in our list
            transactionsByAgent.set(agentId, [transaction])
          }
        })
        
        // Convert the map to an array of AgentTransactions
        const agentTransactionsArray: AgentTransactions[] = []
        
        transactionsByAgent.forEach((transactions, agentId) => {
          const agent = agentMap.get(agentId) || {
            _id: agentId,
            name: "Unknown Agent",
            email: "",
            mobile: ""
          }
          
          if (transactions.length > 0) {
            agentTransactionsArray.push({
              agent,
              transactions
            })
          }
        })
        
        // Sort by agent name
        agentTransactionsArray.sort((a, b) => a.agent.name.localeCompare(b.agent.name))
        
        setAgentTransactions(agentTransactionsArray)
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
      
      // Don't use sample data, only show what's in the database
      console.log("No transactions found in database or error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Fetch transactions on component mount and set up polling
  useEffect(() => {
    // Initial fetch
    fetchTransactions()
    
    // Set up polling every 2 seconds for real-time updates
    const intervalId = setInterval(() => {
      fetchTransactions()
    }, 2000)
    
    // Add event listener for visibility changes to pause polling when tab is not visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Immediately fetch when tab becomes visible again
        fetchTransactions()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Clean up interval and event listener on component unmount
    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
      case "new":
        return <Badge variant="outline">Pending</Badge>
      case "in_progress":
      case "inprogress":
      case "in progress":
        return <Badge variant="secondary">In Progress</Badge>
      case "completed":
      case "complete":
      case "done":
        return <Badge variant="success">Completed</Badge>
      case "at_risk":
      case "atrisk":
      case "at risk":
        return <Badge variant="destructive">At Risk</Badge>
      case "cancelled":
      case "canceled":
        return <Badge variant="outline" className="bg-muted">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleManualRefresh = () => {
    fetchTransactions()
  }
  
  const createTestTransaction = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/broker/transactions/create-test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
      
      if (!response.ok) {
        throw new Error("Failed to create test transaction")
      }
      
      const data = await response.json()
      console.log("Created test transaction:", data)
      
      // Refresh the transaction list
      fetchTransactions()
    } catch (error) {
      console.error("Error creating test transaction:", error)
      setError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-sm font-medium flex items-center">
              Agent Transactions (Real-time)
              {newTransactionAlert && (
                <span className="ml-2 inline-flex h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
              )}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {lastUpdateTime.toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={createTestTransaction}
              disabled={loading}
              title="Create Test Transaction"
            >
              <span className="text-xs">+</span>
              <span className="sr-only">Create Test</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={handleManualRefresh}
              disabled={loading}
            >
              <RefreshCcw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="px-4 pb-4 space-y-4">
            {loading && agentTransactions.length === 0 ? (
              <div className="flex justify-center items-center h-[200px] text-muted-foreground">
                Loading transactions...
              </div>
            ) : error && agentTransactions.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-[200px] text-muted-foreground">
                <p className="text-destructive mb-2">Error loading transactions</p>
                <Button variant="outline" size="sm" onClick={handleManualRefresh}>
                  Try Again
                </Button>
              </div>
            ) : agentTransactions.length > 0 ? (
              agentTransactions.map((agentTx) => (
                <div key={agentTx.agent._id} className="space-y-2">
                  <div className="font-medium text-sm border-b pb-1">
                    {agentTx.agent.name} ({agentTx.transactions.length} transactions)
                  </div>
                  
                  <div className="space-y-2 pl-2">
                    {agentTx.transactions.map((transaction) => {
                      // Check if this is a new transaction (created in the last 30 seconds)
                      const isNew = (Date.now() - transaction.timestamp) < 30000;
                      
                      return (
                      <div 
                        key={transaction.id} 
                        className={`p-2 rounded-md border hover:bg-muted/50 transition-colors ${isNew ? 'border-green-500 animate-pulse-light' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-medium text-xs flex items-center">
                            {transaction.id}
                            {isNew && (
                              <span className="ml-2 text-[10px] text-green-500 font-medium">NEW</span>
                            )}
                          </div>
                          {transaction.status.includes("risk") && (
                            <AlertTriangle className="h-3 w-3 text-destructive" />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mb-1 truncate" title={transaction.property}>
                          {transaction.property}
                        </div>
                        <div className="text-xs text-muted-foreground mb-1 truncate">
                          Client: {transaction.client}
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-xs">{getStatusBadge(transaction.status)}</div>
                          <Link href={`/broker/transactions?id=${transaction.id}`}>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Eye className="h-3 w-3" />
                              <span className="sr-only">View</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : transactions.length > 0 && agentTransactions.length === 0 ? (
              <div>
                <div className="font-medium text-sm border-b pb-1 mb-2">
                  Transactions without assigned agents
                </div>
                <div className="space-y-2 pl-2">
                  {transactions.map((transaction) => {
                    // Check if this is a new transaction (created in the last 30 seconds)
                    const isNew = (Date.now() - transaction.timestamp) < 30000;
                    
                    return (
                    <div 
                      key={transaction.id} 
                      className={`p-2 rounded-md border hover:bg-muted/50 transition-colors ${isNew ? 'border-green-500 animate-pulse-light' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium text-xs flex items-center">
                          {transaction.id}
                          {isNew && (
                            <span className="ml-2 text-[10px] text-green-500 font-medium">NEW</span>
                          )}
                        </div>
                        {transaction.status.includes("risk") && (
                          <AlertTriangle className="h-3 w-3 text-destructive" />
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mb-1 truncate" title={transaction.property}>
                        {transaction.property}
                      </div>
                      <div className="text-xs text-muted-foreground mb-1 truncate">
                        Client: {transaction.client}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-xs">{getStatusBadge(transaction.status)}</div>
                        <Link href={`/broker/transactions?id=${transaction.id}`}>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Eye className="h-3 w-3" />
                            <span className="sr-only">View</span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-[200px] text-muted-foreground">
                <p className="mb-4">No transactions found</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={createTestTransaction}
                  disabled={loading}
                >
                  Create Test Transaction
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}