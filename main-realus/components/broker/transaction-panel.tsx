"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Eye, AlertTriangle, RefreshCcw } from "lucide-react"
import { TransactionDetailsModal } from "@/components/dashboard/transaction-details-modal"

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
  
  // State for transaction details modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  
  // Function to open transaction details modal
  const openTransactionModal = (transaction: Transaction) => {
    console.log("Opening modal for transaction:", transaction)
    setSelectedTransaction(transaction)
    setIsDetailsModalOpen(true)
  }

  // Function to fetch agents - will be connected to API in the future
  const fetchAgents = async () => {
    console.log("Fetching agents")
    // This will be replaced with actual API call
    // For now, returning empty array to remove static data
    setAgents([])
    return []
  }

  // Function to generate a transaction - will be replaced with API call
  const generateTransaction = (agentId: string, agentName: string): Transaction => {
    // This will be replaced with actual transaction data from API
    // For now, returning a minimal transaction object
    return {
      id: "",
      property: "",
      client: "",
      agentId: "",
      agentName: "",
      status: "pending",
      createdDate: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      brokerId: ""
    }
  }

  // Function to add a new transaction - will be connected to API in the future
  const addNewTransaction = (agentId: string) => {
    // This function will be replaced with actual API call
    console.log("Add new transaction function called, but no static data is being added")
    
    // Update last update time
    setLastUpdateTime(new Date())
    
    // No transactions are being added since we're removing static data
  }

  // Function to fetch transactions - will be connected to API in the future
  const fetchTransactions = async () => {
    try {
      // Set loading state
      setLoading(true)
      
      // Update last update time
      setLastUpdateTime(new Date())
      
      // Clear error
      setError(null)
      
      // Fetch agents first
      await fetchAgents()
      
      // This will be replaced with actual API call to get transactions
      // For now, setting empty arrays to remove static data
      setTransactions([])
      setAgentTransactions([])
      
      console.log("Transaction data cleared - will be replaced with API data")
    } catch (error) {
      console.error("Error:", error)
      setError("Failed to load transactions")
    } finally {
      setLoading(false)
    }
  }

  // Component mount effect - fetch transactions on mount
  useEffect(() => {
    fetchTransactions()
    
    // No automatic transaction creation to avoid static data
    
    // Clean up function
    return () => {
      // No timers to clean up
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
    // Fetch transactions again
    fetchTransactions()
  }
  
  // Function to manually create a new transaction - will be connected to API
  const handleCreateNewTransaction = () => {
    // This will be replaced with actual API call
    console.log("Create new transaction button clicked, but no static data is being added")
    
    // No transactions are being added since we're removing static data
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
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-6 text-xs" 
              onClick={handleCreateNewTransaction}
              disabled={loading || agents.length === 0}
            >
              + New Transaction
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
            {loading ? (
              <div className="flex justify-center items-center h-[200px] text-muted-foreground">
                Loading transactions...
              </div>
            ) : error ? (
              <div className="flex flex-col justify-center items-center h-[200px] text-muted-foreground">
                <p className="text-destructive mb-2">Error loading transactions</p>
                <Button variant="outline" size="sm" onClick={handleManualRefresh}>
                  Try Again
                </Button>
              </div>
            ) : agentTransactions.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-[200px] text-muted-foreground">
                <p>No transactions available</p>
                <Button variant="outline" size="sm" onClick={handleManualRefresh} className="mt-2">
                  Refresh
                </Button>
              </div>
            ) : (
              // Display agent transactions
              agentTransactions.map((agentTx) => (
                <div key={agentTx.agent._id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{agentTx.agent.name}</h3>
                    <span className="text-xs text-muted-foreground">{agentTx.transactions.length} transactions</span>
                  </div>
                  
                  <div className="space-y-2">
                    {agentTx.transactions.map((transaction) => (
                      <div 
                        key={transaction.id} 
                        className={`p-3 rounded-md border ${
                          Date.now() - transaction.timestamp < 10000 ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-border'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-sm font-medium">{transaction.property}</p>
                            <p className="text-xs text-muted-foreground">Client: {transaction.client}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(transaction.status)}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6" 
                              onClick={() => openTransactionModal(transaction)}
                            >
                              <Eye className="h-3 w-3" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            ID: {transaction.id}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.createdDate}
                          </p>
                        </div>
                        {Date.now() - transaction.timestamp < 10000 && (
                          <div className="mt-1 flex items-center">
                            <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-green-500 mr-1"></span>
                            <span className="text-xs text-green-600 dark:text-green-400">New transaction</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
      
      {/* Transaction Details Modal */}
      {isDetailsModalOpen && (
        <TransactionDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            console.log("Closing modal...");
            setIsDetailsModalOpen(false);
          }}
          transaction={selectedTransaction}
        />
      )}
    </Card>
  )
}