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
  agentName: string  // Changed from optional to required
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

  // Function to fetch agents from the API
  const fetchAgents = async () => {
    console.log("Fetching agents")
    try {
      // Fetch agents from the API
      const response = await fetch('/api/agents/list')
      const data = await response.json()
      
      if (response.ok) {
        // Combine pending and approved agents
        const allAgents = [...(data.pendingAgents || []), ...(data.approvedAgents || [])];
        
        console.log("Fetched agents:", allAgents);
        
        if (allAgents.length > 0) {
          // Map the agents to our Agent interface
          const mappedAgents = allAgents.map((agent: any) => ({
            _id: agent._id || agent.id,
            name: agent.name || `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || "Unknown Agent",
            email: agent.email || "unknown@example.com",
            mobile: agent.mobile || agent.phone || "unknown"
          }));
          
          setAgents(mappedAgents);
          return mappedAgents;
        } else {
          console.log("No agents returned from API or API failed");
          
          // Return empty array instead of sample data to force database lookup
          setAgents([]);
          return [];
        }
      }
    } catch (error) {
      console.error("Error fetching agents:", error);
      
      // Return empty array instead of sample data to force database lookup
      setAgents([]);
      return [];
    }
  }

  // Function to generate a transaction - will be replaced with API call
  const generateTransaction = (agentId: string, agentName: string): Transaction => {
    // This will be replaced with actual transaction data from API
    // For now, returning a minimal transaction object
    return {
      id: "",
      property: "",
      client: "",
      agentId: agentId,
      agentName: agentName,
      status: "pending",
      createdDate: new Date().toISOString().split('T')[0],
      timestamp: Date.now(),
      brokerId: ""
    };
  }

  // Function to add a new transaction - will be connected to API in the future
  const addNewTransaction = (agentId: string) => {
    // This function will be replaced with actual API call
    console.log("Add new transaction function called, but no static data is being added")
    
    // Update last update time
    setLastUpdateTime(new Date())
    
    // No transactions are being added since we're removing static data
  }

  // Function to fetch transactions from the API
  const fetchTransactions = async () => {
    try {
      // Set loading state
      setLoading(true)
      
      // Update last update time
      setLastUpdateTime(new Date())
      
      // Clear error
      setError(null)
      
      // Fetch agents first
      const agentsList = await fetchAgents()
      
      // Create a map of agent IDs to agent names for quick lookup
      const agentMap = new Map<string, string>();
      console.log("Creating agent ID to name mapping:");
      agentsList.forEach((agent: Agent) => {
        console.log(`Mapping agent ID: ${agent._id} to name: ${agent.name}`);
        agentMap.set(agent._id, agent.name);
      });
      
      // Log all mapped agents
      console.log("Agent ID to name map created with entries:", agentMap.size);
      
      // Fetch transactions from the API
      const response = await fetch('/api/broker/transactions')
      const data = await response.json()
      
      console.log("API response data:", data);
      console.log("API transactions:", data.transactions);
      
      if (response.ok) {
        // Determine which transactions to use (API data or sample data)
        let transactionsToUse = []
        
        if (data.transactions && data.transactions.length > 0) {
          console.log("Fetched transactions:", data.transactions)
          
          // Log the raw transaction data to see what fields are available
          console.log("Raw transaction data sample:", data.transactions[0]);
          
          // Ensure each transaction has the agent name from our agent map
          transactionsToUse = data.transactions.map((tx: any) => {
            // Check if transaction has agentId field
            if (!tx.agentId) {
              console.log("Transaction missing agentId:", tx);
              // Try to find agent ID in other fields
              tx.agentId = tx.agent_id || tx.agent || "";
              console.log("Assigned agentId:", tx.agentId);
              
              // If we have an agent name but no agent ID, try to find the agent ID from the name
              if (tx.agentName && !tx.agentId) {
                console.log("Transaction has agent name but no ID, trying to find ID from name:", tx.agentName);
                // Create a reverse map from name to ID
                const nameToIdMap = new Map<string, string>();
                agentsList.forEach(agent => {
                  nameToIdMap.set(agent.name, agent._id);
                });
                
                // Try to find the agent ID from the name
                tx.agentId = nameToIdMap.get(tx.agentName) || "";
                console.log("Found agent ID from name:", tx.agentId);
              }
            }
            
            // Get the agent name from our map if available
            // Log the agent ID to debug
            console.log(`Looking up agent name for ID: ${tx.agentId}`);
            console.log(`Available agent IDs in map: ${Array.from(agentMap.keys()).join(', ')}`);
            
            // Try to get the agent name from the database first
            const agentName = agentMap.get(tx.agentId);
            
            if (agentName) {
              console.log(`Found agent name in database: ${agentName}`);
            } else {
              console.log(`Agent name not found in database for ID: ${tx.agentId}, using fallback: ${tx.agentName || "Unknown Agent"}`);
            }
            
            // Use the database name if available, otherwise fall back to the transaction's agent name
            const finalAgentName = agentName || tx.agentName || "Unknown Agent";
            console.log(`Final resolved agent name: ${finalAgentName}`);
            return {
              ...tx,
              agentName: finalAgentName // Use the resolved agent name from database
            };
          });
          
          // Check if agent names are present in the mapped transactions
          transactionsToUse.forEach((tx: any, index: number) => {
            console.log(`API transaction ${index} agent name:`, tx.agentName);
          });
        } else {
          console.log("No transactions returned from API, using sample data")
          
          // Instead of using sample transactions, we'll try to fetch from the database
          console.log("Attempting to fetch transactions from database...");
          
          // Empty array for now - we'll rely on the API to provide real data
          const sampleTransactions = [];
          
          console.log("No sample transactions available - will use database data only");
          
          transactionsToUse = sampleTransactions;
        }
        
        // Log all transactions with their agent names
        console.log("Final transactions with agent names:");
        transactionsToUse.forEach((tx: any, index: number) => {
          console.log(`Transaction ${index} agent name:`, tx.agentName);
        });
        
        // Make sure all transactions have agent names
        transactionsToUse.forEach((tx: any) => {
          if (!tx.agentName && tx.agentId) {
            tx.agentName = agentMap.get(tx.agentId) || "Unknown Agent";
            console.log(`Added missing agent name for transaction: ${tx.agentName}`);
          }
        });
        
        // Set the transactions
        setTransactions(transactionsToUse)
        
        // Create agent transactions mapping
        const agentTxMap = new Map<string, AgentTransactions>()
        
        // Create a dummy agent if no agents are available
        if (agentsList.length === 0) {
          const dummyAgent: Agent = {
            _id: "dummy-agent",
            name: "Agent",
            email: "agent@example.com",
            mobile: "1234567890"
          }
          
          // Group all transactions under the dummy agent
          const mappedTransactions = transactionsToUse.map((tx: any) => {
            const transactionObj = {
              id: tx._id || tx.id || "unknown",
              property: tx.propertyAddress || tx.property || "Unknown Property",
              client: tx.clientName || tx.client || "Unknown Client",
              agentId: tx.agentId || "unknown",
              agentName: tx.agentName || "Unknown Agent", // Use the agent name from the transaction
              status: tx.status || "pending",
              createdDate: tx.createdDate || new Date(tx.createdAt || Date.now()).toISOString().split('T')[0],
              timestamp: tx.timestamp || Date.now(),
              brokerId: tx.brokerId || ""
            };
            
            console.log("Dummy agent case - Transaction:", transactionObj);
            console.log("Dummy agent case - Agent name:", transactionObj.agentName);
            
            return transactionObj;
          });
          
          const agentTransactions: AgentTransactions = {
            agent: dummyAgent,
            transactions: mappedTransactions
          }
          
          // Log the dummy agent transactions
          console.log("Dummy agent transactions:", agentTransactions);
          console.log("Dummy agent name:", agentTransactions.agent.name);
          agentTransactions.transactions.forEach((tx, index) => {
            console.log(`Dummy agent transaction ${index} agent name:`, tx.agentName);
          });
          
          setAgentTransactions([agentTransactions])
        } else {
          // Group transactions by agent
          transactionsToUse.forEach((tx: any) => {
            const agentId = tx.agentId
            
            if (!agentTxMap.has(agentId)) {
              // Find the agent in our list
              let agentName = agentMap.get(agentId);
              if (!agentName) {
                const agent = agentsList.find((a: Agent) => a._id === agentId);
                if (agent) {
                  agentName = agent.name;
                } else {
                  agentName = tx.agentName || "Unknown Agent";
                }
              }
              
              console.log(`Creating agent object for ID ${agentId} with name ${agentName}`);
              
              const agent = agentsList.find((a: Agent) => a._id === agentId) || {
                _id: agentId,
                name: agentName,
                email: "unknown@example.com",
                mobile: "unknown"
              }
              
              agentTxMap.set(agentId, {
                agent,
                transactions: []
              })
            }
            
            // Get the real-time agent name - prioritize the agent from our map
            console.log(`Looking up agent name for ID in transaction object: ${agentId}`);
            
            // First try to get from our agent map (most accurate and real-time)
            let agentName = agentMap.get(agentId);
            
            // If not found in map, try to find in the agent list
            if (!agentName) {
              const agent = agentsList.find((a: Agent) => a._id === agentId);
              if (agent) {
                agentName = agent.name;
                console.log(`Found agent name in agent list: ${agentName}`);
              }
            }
            
            // If still not found, use the name from transaction or default
            if (!agentName) {
              agentName = tx.agentName || "Unknown Agent";
              console.log(`Using transaction agent name or default: ${agentName}`);
            }
            
            console.log(`Final agent name for transaction: ${agentName}`);
            
            // Create transaction object with agent name
            const transactionObj = {
              id: tx._id || tx.id || "unknown",
              property: tx.propertyAddress || tx.property || "Unknown Property",
              client: tx.clientName || tx.client || "Unknown Client",
              agentId: tx.agentId,
              agentName: agentName, // Use the real-time agent name
              status: tx.status || "pending",
              createdDate: tx.createdDate || new Date(tx.createdAt || Date.now()).toISOString().split('T')[0],
              timestamp: tx.timestamp || Date.now(),
              brokerId: tx.brokerId || ""
            };
            
            console.log("Created transaction object:", transactionObj);
            console.log("Agent name in transaction object:", transactionObj.agentName);
            
            // Add the transaction to the agent's list
            agentTxMap.get(agentId)?.transactions.push(transactionObj);
            
            // Log the transaction that was added to the agent's list
            console.log(`Added transaction to agent ${agentId} list:`, transactionObj);
            console.log(`Agent name in added transaction:`, transactionObj.agentName);
          })
          
          // Convert the map to an array
          const agentTxArray = Array.from(agentTxMap.values());
          
          // Log the agent transactions array
          console.log("Agent transactions array:", agentTxArray);
          agentTxArray.forEach((agentTx, index) => {
            console.log(`Agent ${index} name:`, agentTx.agent.name);
            agentTx.transactions.forEach((tx, txIndex) => {
              console.log(`Agent ${index} transaction ${txIndex} agent name:`, tx.agentName);
            });
          });
          
          setAgentTransactions(agentTxArray)
        }
        
        console.log("Transaction data loaded from API")
      } else {
        console.error("Failed to fetch transactions:", data)
        setError("Failed to load transactions")
        
        // Set empty arrays as fallback
        setTransactions([])
        setAgentTransactions([])
      }
    } catch (error) {
      console.error("Error:", error)
      setError("Failed to load transactions")
      
      // Set empty arrays as fallback
      setTransactions([])
      setAgentTransactions([])
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
                    {/* Removed console.log that was causing the type error */}
                    {agentTx.transactions.map((transaction) => {
                      // Moved console logs to comments to avoid React node issues
                      // console.log("Transaction in render:", transaction);
                      // console.log("Agent name in transaction:", transaction.agentName);
                      // console.log("Agent name from agentTx:", agentTx.agent.name);
                      return (
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
                            <p className="text-xs text-muted-foreground">Agent: <span className="font-medium text-primary">{transaction.agentName || "Unknown Agent"}</span></p>
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
                    );
                  })}
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