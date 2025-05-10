"use client"

import { useEffect, useState } from "react"
import { TransactionOverviewCard } from "@/components/dashboard/transaction-overview-card"
import { AgentPerformanceWidget } from "@/components/dashboard/agent-performance-widget"
import { AIInsightsCard } from "@/components/dashboard/ai-insights-card"
import { QuickActionsPanel } from "@/components/dashboard/quick-actions-panel"
import { LiveNotificationsPanel } from "@/components/dashboard/live-notifications-panel"
import { TransactionListTable } from "@/components/dashboard/transaction-list-table"
import { TransactionDetailsModal } from "@/components/dashboard/transaction-details-modal"
import BrokerIdCard from "@/components/broker/broker-id-card"
import { FileText, UserPlus, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TransactionStatus } from "@/models/transactionModel"

export default function BrokerDashboard() {
  // State for transactions data
  const [transactions, setTransactions] = useState([]);
  const [transactionStats, setTransactionStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    atRisk: 0
  });
  
  // State for agent performance data
  const [agentPerformance, setAgentPerformance] = useState([]);
  
  // State for loading
  const [isLoading, setIsLoading] = useState(true);
  
  // State for transaction details modal
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Function to handle opening the modal
  const openTransactionModal = (transaction: any) => {
    console.log("Opening modal for transaction:", transaction);
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
  };
  
  // Fetch transaction data
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log("Fetching broker transactions...");
        // Add a timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/broker/transactions?_=${timestamp}`);
        
        console.log("Response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Received transaction data:", data);
          
          if (!data.transactions || data.transactions.length === 0) {
            console.log("No transactions found in response");
            setTransactions([]);
            setTransactionStats({
              total: 0,
              completed: 0,
              pending: 0,
              atRisk: 0
            });
            return;
          }
          
          // Process transactions for display
          const formattedTransactions = data.transactions.map(transaction => {
            console.log("Processing transaction:", transaction.transactionId);
            
            // Map transaction status to UI status
            let uiStatus = "pending";
            if (transaction.status === TransactionStatus.New || transaction.status === "New") {
              uiStatus = "pending";
            } else if (transaction.status === TransactionStatus.InProgress || transaction.status === "InProgress") {
              uiStatus = "in_progress";
            } else if (transaction.status === TransactionStatus.Closed || transaction.status === "Closed" || 
                       transaction.status === TransactionStatus.Approved || transaction.status === "Approved") {
              uiStatus = "completed";
            } else if (transaction.status === TransactionStatus.PendingDocuments || transaction.status === "PendingDocuments") {
              uiStatus = "at_risk";
            }
            
            // Format the closing date
            let formattedDate = "No date";
            if (transaction.closingDate) {
              try {
                const closingDate = new Date(transaction.closingDate);
                formattedDate = closingDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                });
              } catch (e) {
                console.error("Error formatting date:", e);
              }
            }
            
            // Create a formatted transaction object for display
            // Include both the UI-specific fields and the original transaction data
            return {
              // UI-specific fields for the table
              id: transaction.transactionId || `TR-${Math.floor(Math.random() * 10000)}`,
              property: transaction.propertyAddress + (transaction.city ? `, ${transaction.city}` : ''),
              client: transaction.clientName || "Unknown Client",
              agent: transaction.agentName || "Agent", // We'll update this when we have agent names
              status: uiStatus,
              dueDate: formattedDate,
              riskLevel: uiStatus === "at_risk" ? "high" : undefined,
              
              // Include all original transaction data for the modal
              transactionId: transaction.transactionId,
              agentId: transaction.agentId,
              brokerId: transaction.brokerId,
              clientName: transaction.clientName,
              clientEmail: transaction.clientEmail,
              clientPhone: transaction.clientPhone,
              transactionType: transaction.transactionType,
              propertyAddress: transaction.propertyAddress,
              city: transaction.city,
              state: transaction.state,
              zipCode: transaction.zipCode,
              price: transaction.price,
              closingDate: transaction.closingDate,
              notes: transaction.notes,
              createdAt: transaction.createdAt,
              updatedAt: transaction.updatedAt
            };
          });
          
          console.log("Formatted transactions:", formattedTransactions);
          setTransactions(formattedTransactions);
          
          // Calculate transaction statistics
          const stats = {
            total: data.transactions.length,
            completed: data.transactions.filter(t => 
              t.status === TransactionStatus.Closed || 
              t.status === TransactionStatus.Approved || 
              t.status === "Closed" || 
              t.status === "Approved"
            ).length,
            pending: data.transactions.filter(t => 
              t.status === TransactionStatus.New || 
              t.status === TransactionStatus.InProgress || 
              t.status === "New" || 
              t.status === "InProgress"
            ).length,
            atRisk: data.transactions.filter(t => 
              t.status === TransactionStatus.PendingDocuments || 
              t.status === TransactionStatus.UnderReview || 
              t.status === "PendingDocuments" || 
              t.status === "UnderReview"
            ).length
          };
          
          console.log("Transaction stats:", stats);
          setTransactionStats(stats);
        } else {
          console.error("Error response from API:", response.status);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };
    
    const fetchAgentPerformance = async () => {
      try {
        console.log("Fetching agent performance data...");
        // Add a timestamp to prevent caching
        const timestamp = new Date().getTime();
        const response = await fetch(`/api/broker/transactions?_=${timestamp}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        });
        
        console.log("Agent performance response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Received agent performance data:", data);
          
          if (data.agents && data.agents.length > 0) {
            setAgentPerformance(data.agents);
            console.log("Updated agent performance state with", data.agents.length, "agents");
          } else {
            console.log("No agent performance data found");
            setAgentPerformance([]);
          }
        } else {
          console.error("Error response from API:", response.status);
          setAgentPerformance([]);
        }
      } catch (error) {
        console.error("Error fetching agent performance:", error);
        setAgentPerformance([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
    fetchAgentPerformance();
  }, []);

  // Sample data for parts we're not updating yet
  const aiInsightsData = [
    {
      id: "1",
      type: "trend",
      content: "Transaction volume has increased by 15% compared to last month.",
    },
    {
      id: "2",
      type: "warning",
      content: "3 transactions are at high risk of delay due to missing documentation.",
    },
    {
      id: "3",
      type: "delay",
      content: "Average closing time has increased to 23 days, up from 19 days last quarter.",
    },
    {
      id: "4",
      type: "tip",
      content: "Consider reassigning Agent Brown's workload to improve completion rates.",
    },
  ]

  const quickActionsData = [
    {
      icon: <UserPlus className="h-6 w-6" />,
      label: "Approve Agents",
      href: "/broker/agents",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      label: "View Transactions",
      href: "/broker/transactions",
    },
    {
      icon: <AlertCircle className="h-6 w-6" />,
      label: "Handle Complaints",
      href: "/broker/complaints",
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      label: "Review Closures",
      href: "/broker/closure-requests",
    },
  ]

  const notificationsData = [
    {
      id: "1",
      title: "New Agent Registration",
      message: "Emily Davis has registered as a new agent and is awaiting approval.",
      time: "10 min ago",
      read: false,
      type: "info",
    },
    {
      id: "2",
      title: "Transaction at Risk",
      message: "Transaction #TR-7829 is flagged as high risk due to delayed document submission.",
      time: "1 hour ago",
      read: false,
      type: "warning",
    },
    {
      id: "3",
      title: "Closure Request",
      message: "Transaction #TR-6543 is ready for final review and closure approval.",
      time: "3 hours ago",
      read: true,
      type: "success",
    },
  ]

  // Fallback data for when API data is not available
  const fallbackTransactions = [
    {
      id: "TR-7829",
      property: "123 Main St, Austin, TX",
      client: "Robert Johnson",
      agent: "Sarah Johnson",
      status: "at_risk",
      dueDate: "Apr 15, 2025",
      riskLevel: "high",
      
      // Additional fields for the modal
      transactionId: "TR-7829",
      agentId: "agent-123",
      brokerId: "broker-456",
      clientName: "Robert Johnson",
      clientEmail: "robert@example.com",
      clientPhone: "555-123-4567",
      transactionType: "Purchase",
      propertyAddress: "123 Main St",
      city: "Austin",
      state: "TX",
      zipCode: "78701",
      price: 450000,
      closingDate: "2025-04-15",
      notes: "Client is concerned about inspection results. Need to follow up urgently.",
      createdAt: "2025-03-01T12:00:00Z",
      updatedAt: "2025-03-15T14:30:00Z"
    },
    {
      id: "TR-6543",
      property: "456 Oak Ave, Dallas, TX",
      client: "Jennifer Williams",
      agent: "John Smith",
      status: "in_progress",
      dueDate: "Apr 22, 2025",
      
      // Additional fields for the modal
      transactionId: "TR-6543",
      agentId: "agent-456",
      brokerId: "broker-456",
      clientName: "Jennifer Williams",
      clientEmail: "jennifer@example.com",
      clientPhone: "555-234-5678",
      transactionType: "Sale",
      propertyAddress: "456 Oak Ave",
      city: "Dallas",
      state: "TX",
      zipCode: "75201",
      price: 375000,
      closingDate: "2025-04-22",
      notes: "All documents submitted, waiting for lender approval.",
      createdAt: "2025-03-05T10:15:00Z",
      updatedAt: "2025-03-18T09:45:00Z"
    },
    {
      id: "TR-9021",
      property: "789 Pine Rd, Houston, TX",
      client: "Michael Davis",
      agent: "Michael Brown",
      status: "pending",
      dueDate: "May 3, 2025",
      
      // Additional fields for the modal
      transactionId: "TR-9021",
      agentId: "agent-789",
      brokerId: "broker-456",
      clientName: "Michael Davis",
      clientEmail: "michael@example.com",
      clientPhone: "555-345-6789",
      transactionType: "Purchase",
      propertyAddress: "789 Pine Rd",
      city: "Houston",
      state: "TX",
      zipCode: "77002",
      price: 525000,
      closingDate: "2025-05-03",
      notes: "Client is a first-time homebuyer. Extra guidance needed.",
      createdAt: "2025-03-10T14:20:00Z",
      updatedAt: "2025-03-20T11:30:00Z"
    },
    {
      id: "TR-5432",
      property: "321 Elm St, San Antonio, TX",
      client: "Lisa Martinez",
      agent: "John Smith",
      status: "completed",
      dueDate: "Apr 5, 2025",
      
      // Additional fields for the modal
      transactionId: "TR-5432",
      agentId: "agent-456",
      brokerId: "broker-456",
      clientName: "Lisa Martinez",
      clientEmail: "lisa@example.com",
      clientPhone: "555-456-7890",
      transactionType: "Sale",
      propertyAddress: "321 Elm St",
      city: "San Antonio",
      state: "TX",
      zipCode: "78205",
      price: 410000,
      closingDate: "2025-04-05",
      notes: "Transaction completed successfully. All documents finalized.",
      createdAt: "2025-02-15T09:30:00Z",
      updatedAt: "2025-04-05T16:00:00Z"
    },
  ];

  const fallbackAgentPerformance = [
    {
      id: "1",
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      transactions: 24,
      completionRate: 95,
      avgTimeToClose: 18,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      transactions: 18,
      completionRate: 92,
      avgTimeToClose: 21,
    },
    {
      id: "3",
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      transactions: 15,
      completionRate: 88,
      avgTimeToClose: 25,
    },
  ];

  // Use real data if available, otherwise use fallback data
  const displayTransactions = transactions.length > 0 ? transactions : fallbackTransactions;
  const displayAgentPerformance = agentPerformance.length > 0 ? agentPerformance : fallbackAgentPerformance;
  
  // Calculate stats for the transaction overview card
  const displayStats = {
    total: transactionStats.total || 42,
    completed: transactionStats.completed || 18,
    pending: transactionStats.pending || 20,
    atRisk: transactionStats.atRisk || 4
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Broker Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TransactionOverviewCard 
          title="Transactions" 
          total={displayStats.total} 
          completed={displayStats.completed} 
          pending={displayStats.pending} 
          atRisk={displayStats.atRisk} 
        />
        <LiveNotificationsPanel notifications={notificationsData} />
        <QuickActionsPanel actions={quickActionsData} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <BrokerIdCard />
          
          {/* Test button for modal */}
          {process.env.NODE_ENV === 'development' && (
            <Button 
              className="mt-4 w-full" 
              onClick={() => {
                if (displayTransactions.length > 0) {
                  openTransactionModal(displayTransactions[0]);
                }
              }}
            >
              Test Transaction Modal
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TransactionListTable
            transactions={displayTransactions}
            title={isLoading ? "Loading Transactions..." : "Recent Transactions"}
            onViewDetails={(id) => {
              console.log(`View details for transaction ${id}`);
              // Find the transaction by ID
              const transaction = displayTransactions.find(t => t.id === id || t.transactionId === id);
              if (transaction) {
                console.log("Found transaction:", transaction);
                openTransactionModal(transaction);
              } else {
                console.error("Transaction not found with ID:", id);
              }
            }}
          />
        </div>
        <div className="space-y-6">
          <AgentPerformanceWidget agents={displayAgentPerformance} />
          <AIInsightsCard insights={aiInsightsData} />
        </div>
      </div>
      
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
    </div>
  )
}

