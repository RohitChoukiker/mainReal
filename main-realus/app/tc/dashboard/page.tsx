"use client"

import { useState, useEffect } from "react"
import { TransactionOverviewCard } from "@/components/dashboard/transaction-overview-card"
import { AIInsightsCard } from "@/components/dashboard/ai-insights-card"
import { QuickActionsPanel } from "@/components/dashboard/quick-actions-panel"
import { LiveNotificationsPanel } from "@/components/dashboard/live-notifications-panel"
import { TransactionListTable } from "@/components/dashboard/transaction-list-table"
import { AIDelayPredictionWidget } from "@/components/dashboard/ai-delay-prediction-widget"
import { FileCheck, CheckSquare, AlertCircle, CheckCircle, RefreshCcw } from "lucide-react"
import { toast } from "sonner"
import { TransactionDetailsModal } from "@/components/dashboard/transaction-details-modal"
import { Button } from "@/components/ui/button"

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

export default function TCDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [apiTransactions, setApiTransactions] = useState<ApiTransaction[]>([])
  const [transactionsData, setTransactionsData] = useState<any[]>([])
  const [transactionStats, setTransactionStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    atRisk: 0
  })
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null)

  // Function to open transaction details modal
  const handleViewDetails = (id: string) => {
    console.log(`View details for transaction ${id}`)
    const transaction = transactionsData.find(t => t.id === id)
    if (transaction) {
      setSelectedTransaction(transaction)
      setIsDetailsModalOpen(true)
    }
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
          
          // Process transactions for the dashboard
          const processed = data.transactions.map((t: ApiTransaction) => {
            // Format property address
            const property = t.propertyAddress ? 
              `${t.propertyAddress}${t.city ? `, ${t.city}` : ''}${t.state ? `, ${t.state}` : ''}` : 
              "Address not available"
            
            // Format closing date
            let dueDate = "N/A"
            try {
              if (t.closingDate) {
                dueDate = new Date(t.closingDate).toLocaleDateString()
              }
            } catch (e) {
              console.error("Error formatting closingDate:", e)
            }
            
            // Map status
            let status = t.status?.toLowerCase() || "pending"
            if (status === "new") status = "pending"
            if (status === "inprogress") status = "in_progress"
            
            return {
              id: t.transactionId || `TR-${Math.floor(Math.random() * 10000)}`,
              property,
              client: t.clientName || "Unknown Client",
              agent: t.agentId || "Unknown Agent",
              status,
              dueDate,
              // Random risk level for demo purposes
              riskLevel: status === "at_risk" ? "high" : undefined
            }
          })
          
          setTransactionsData(processed)
          
          // Calculate stats
          const total = processed.length
          const completed = processed.filter(t => t.status === "completed").length
          const atRisk = processed.filter(t => t.status === "at_risk").length
          const pending = total - completed - atRisk
          
          setTransactionStats({
            total,
            completed,
            pending,
            atRisk
          })
        } else {
          console.warn('API returned no transactions or invalid format:', data)
          setApiTransactions([])
          setTransactionsData([])
        }
      } catch (error) {
        console.error('Error fetching transactions:', error)
        toast.error('Failed to load transactions. Please try again later.')
        setApiTransactions([])
        setTransactionsData([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTransactions()
  }, [])

  // Sample data for demonstration
  const aiInsightsData = [
    {
      id: "1",
      type: "warning",
      content: "3 transactions have documents awaiting your review for over 24 hours.",
    },
    {
      id: "2",
      type: "tip",
      content: "Consider assigning additional tasks to Agent Smith who has completed all current tasks.",
    },
    {
      id: "3",
      type: "trend",
      content: "Document verification time has improved by 15% this month. Great work!",
    },
  ]

  const quickActionsData = [
    {
      icon: <FileCheck className="h-6 w-6" />,
      label: "Review Documents",
      href: "/tc/document-review",
      variant: "default",
    },
    {
      icon: <CheckSquare className="h-6 w-6" />,
      label: "Assign Tasks",
      href: "/tc/tasks",
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      label: "Handle Complaints",
      href: "/tc/complaints",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      label: "Process Closures",
      href: "/tc/ready-for-closure",
    },
  ]

  const notificationsData = [
    {
      id: "1",
      title: "New Documents Uploaded",
      message: "Agent Johnson has uploaded 5 new documents for transaction #TR-7829.",
      time: "15 min ago",
      read: false,
      type: "info",
    },
    {
      id: "2",
      title: "Task Completed",
      message: "Agent Smith has completed the home inspection task for 456 Oak Ave.",
      time: "1 hour ago",
      read: false,
      type: "success",
    },
    {
      id: "3",
      title: "Transaction Ready for Closure",
      message: "Transaction #TR-5432 has all requirements completed and is ready for closure.",
      time: "3 hours ago",
      read: true,
      type: "info",
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Transaction Coordinator Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TransactionOverviewCard 
            title="Assigned Transactions" 
            total={transactionStats.total} 
            completed={transactionStats.completed} 
            pending={transactionStats.pending} 
            atRisk={transactionStats.atRisk}
            isLoading={isLoading}
          />
          <TransactionListTable
            transactions={transactionsData}
            title="Active Transactions"
            description="Transactions currently assigned to you"
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
          />
        </div>
        <div className="space-y-6">
          <LiveNotificationsPanel notifications={notificationsData} />
          <QuickActionsPanel actions={quickActionsData} />
          <AIDelayPredictionWidget predictions={delayPredictions} />
          <AIInsightsCard insights={aiInsightsData} />
        </div>
      </div>
      
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

