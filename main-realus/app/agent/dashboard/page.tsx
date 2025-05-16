"use client"

import React, { useState, useEffect } from "react"
import { TransactionOverviewCard } from "@/components/dashboard/transaction-overview-card"
import { AIInsightsCard } from "@/components/dashboard/ai-insights-card"
import { QuickActionsPanel } from "@/components/dashboard/quick-actions-panel"
import { TransactionListTable, Transaction } from "@/components/dashboard/transaction-list-table"
import { AIDelayPredictionWidget } from "@/components/dashboard/ai-delay-prediction-widget"
import AgentTaskPanel from "@/components/agent/task-panel"
import { PlusCircle, Upload, CheckSquare, AlertCircle } from "lucide-react"
import { TransactionStatus } from "@/models/transactionModel"
import { withAuth } from "@/components/auth/with-auth"
import { useAuth } from "@/hooks/use-auth"

function AgentDashboard() {
  // Get user data from auth hook
  const { user } = useAuth();
  // Define Action type for QuickActionsPanel
  type Action = {
    icon: React.ReactNode;
    label: string;
    href: string;
    variant?: "default" | "secondary" | "outline";
  }

  // State for transactions data
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionStats, setTransactionStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    atRisk: 0
  })
  
  // State for loading
  const [isLoading, setIsLoading] = useState(true)
  
  // Fetch transaction data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log("Fetching agent transactions...")
        // Add a timestamp to prevent caching
        const timestamp = new Date().getTime()
        
        try {
          const response = await fetch(`/api/agent/transactions/list?_=${timestamp}`)
          console.log("Response status:", response.status)
          
          if (response.ok) {
            const data = await response.json()
            console.log("Received transaction data:", data)
            
            if (!data.transactions || data.transactions.length === 0) {
              console.log("No transactions found in response")
              setTransactions([])
              setTransactionStats({
                total: 0,
                completed: 0,
                pending: 0,
                atRisk: 0
              })
              setIsLoading(false)
              return
            }
            
            // Process transactions for display
            const formattedTransactions: Transaction[] = data.transactions.map((transaction: any) => {
              console.log("Processing transaction:", transaction.transactionId || transaction.id)
              
              // Map transaction status to UI status
              let uiStatus = "pending"
              if (transaction.status === TransactionStatus.New || transaction.status === "New") {
                uiStatus = "pending"
              } else if (transaction.status === TransactionStatus.InProgress || transaction.status === "InProgress") {
                uiStatus = "in_progress"
              } else if (transaction.status === TransactionStatus.Closed || transaction.status === "Closed" || 
                         transaction.status === TransactionStatus.Approved || transaction.status === "Approved") {
                uiStatus = "completed"
              } else if (transaction.status === TransactionStatus.PendingDocuments || transaction.status === "PendingDocuments") {
                uiStatus = "at_risk"
              }
              
              // Format the closing date
              let formattedDate = "No date"
              if (transaction.closingDate) {
                try {
                  const closingDate = new Date(transaction.closingDate)
                  formattedDate = closingDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })
                } catch (e) {
                  console.error("Error formatting date:", e)
                }
              }
              
              // Create a formatted transaction object for display
              return {
                id: transaction.transactionId || transaction.id || `TR-${Math.floor(Math.random() * 10000)}`,
                property: (transaction.propertyAddress || "") + 
                  (transaction.city ? `, ${transaction.city}` : '') + 
                  (transaction.state ? `, ${transaction.state}` : ''),
                client: transaction.clientName || "Unknown Client",
                agent: "You",
                status: uiStatus,
                dueDate: formattedDate,
                riskLevel: uiStatus === "at_risk" ? "high" : undefined,
              }
            })
            
            console.log("Formatted transactions:", formattedTransactions)
            setTransactions(formattedTransactions)
            
            // Calculate transaction statistics
            const stats = {
              total: data.transactions.length,
              completed: data.transactions.filter((t: any) => 
                t.status === TransactionStatus.Closed || 
                t.status === TransactionStatus.Approved || 
                t.status === "Closed" || 
                t.status === "Approved"
              ).length,
              pending: data.transactions.filter((t: any) => 
                t.status === TransactionStatus.New || 
                t.status === TransactionStatus.InProgress || 
                t.status === "New" || 
                t.status === "InProgress"
              ).length,
              atRisk: data.transactions.filter((t: any) => 
                t.status === TransactionStatus.PendingDocuments || 
                t.status === TransactionStatus.UnderReview || 
                t.status === "PendingDocuments" || 
                t.status === "UnderReview"
              ).length
            }
            
            console.log("Transaction stats:", stats)
            setTransactionStats(stats)
          } else {
            console.error("Error response from API:", response.status)
            // Use fallback data
            console.log("Using fallback transaction data due to API error")
            setTransactions(fallbackTransactions)
            setTransactionStats({
              total: fallbackTransactions.length,
              completed: fallbackTransactions.filter((t: Transaction) => t.status === "completed").length,
              pending: fallbackTransactions.filter((t: Transaction) => t.status === "pending").length,
              atRisk: fallbackTransactions.filter((t: Transaction) => t.status === "at_risk").length
            })
          }
        } catch (fetchError) {
          console.error("Fetch error:", fetchError)
          // Use fallback data
          console.log("Using fallback transaction data due to fetch error")
          setTransactions(fallbackTransactions)
          setTransactionStats({
            total: fallbackTransactions.length,
            completed: fallbackTransactions.filter((t: Transaction) => t.status === "completed").length,
            pending: fallbackTransactions.filter((t: Transaction) => t.status === "pending").length,
            atRisk: fallbackTransactions.filter((t: Transaction) => t.status === "at_risk").length
          })
        } finally {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error fetching transactions:", error)
        setIsLoading(false)
      }
    }
    
    fetchTransactions()
    
    // Set up polling for real-time updates (every 30 seconds)
    const intervalId = setInterval(() => {
      fetchTransactions()
    }, 30000)
    
    return () => clearInterval(intervalId)
  }, [])
  
  // Sample data for demonstration
  const aiInsightsData: {
    id: string;
    type: "tip" | "warning" | "delay" | "trend";
    content: string;
  }[] = [
    {
      id: "1",
      type: "tip",
      content: "Complete the property inspection for 123 Main St by tomorrow to avoid delays.",
    },
    {
      id: "2",
      type: "warning",
      content: "Missing documents for transaction #TR-7829 may cause closing delays.",
    },
    {
      id: "3",
      type: "delay",
      content: "Transaction #TR-6543 is progressing faster than average. Great work!",
    },
  ]

  const quickActionsData: Action[] = [
    {
      icon: <PlusCircle className="h-6 w-6" />,
      label: "New Transaction",
      href: "/agent/new-transaction",
      variant: "default",
    },
    {
      icon: <Upload className="h-6 w-6" />,
      label: "Upload Documents",
      href: "/agent/upload-documents",
    },
    {
      icon: <CheckSquare className="h-6 w-6" />,
      label: "View Tasks",
      href: "/agent/tasks",
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      label: "File Complaint",
      href: "/agent/complaints",
    },
  ]

  // Fallback data for when API data is not available
  const fallbackTransactions: Transaction[] = [
    {
      id: "TR-7829",
      property: "123 Main St, Austin, TX",
      client: "Robert Johnson",
      agent: "You",
      status: "at_risk",
      dueDate: "Apr 15, 2025",
      riskLevel: "high",
    },
    {
      id: "TR-6543",
      property: "456 Oak Ave, Dallas, TX",
      client: "Jennifer Williams",
      agent: "You",
      status: "in_progress",
      dueDate: "Apr 22, 2025",
    },
    {
      id: "TR-9021",
      property: "789 Pine Rd, Houston, TX",
      client: "Michael Davis",
      agent: "You",
      status: "pending",
      dueDate: "May 3, 2025",
    },
    {
      id: "TR-5432",
      property: "321 Elm St, San Antonio, TX",
      client: "Lisa Martinez",
      agent: "You",
      status: "completed",
      dueDate: "Apr 5, 2025",
    },
  ]

  const delayPredictions = [
    {
      transactionId: "TR-7829",
      property: "123 Main St, Austin, TX",
      currentStage: "Document Collection",
      delayProbability: 85,
      estimatedDelay: 7,
      reason: "Missing inspection report and title documents",
    },
    {
      transactionId: "TR-9021",
      property: "789 Pine Rd, Houston, TX",
      currentStage: "Initial Review",
      delayProbability: 45,
      estimatedDelay: 3,
      reason: "Pending client signature on disclosure forms",
    },
    {
      transactionId: "TR-6543",
      property: "456 Oak Ave, Dallas, TX",
      currentStage: "Financing",
      delayProbability: 15,
      estimatedDelay: 0,
      reason: "All documents submitted on time",
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {user?.name ? `${user.name}'s Dashboard` : 'Agent Dashboard'}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TransactionOverviewCard 
          title="My Transactions" 
          total={transactionStats.total} 
          completed={transactionStats.completed} 
          pending={transactionStats.pending} 
          atRisk={transactionStats.atRisk}
          isLoading={isLoading}
        />
        <QuickActionsPanel actions={quickActionsData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TransactionListTable
            transactions={transactions}
            title="My Active Transactions"
            description="Your current transaction portfolio"
            onViewDetails={(id) => console.log(`View details for transaction ${id}`)}
            isLoading={isLoading}
          />
        </div>
        <div className="space-y-6">
          <AgentTaskPanel />
          <AIDelayPredictionWidget predictions={delayPredictions} />
          <AIInsightsCard insights={aiInsightsData} />
        </div>
      </div>
    </div>
  )
}

// Export the component wrapped with authentication protection
export default withAuth(AgentDashboard, ["Agent"]);

