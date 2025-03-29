"use client"

import { TransactionOverviewCard } from "@/components/dashboard/transaction-overview-card"
import { AIInsightsCard } from "@/components/dashboard/ai-insights-card"
import { QuickActionsPanel } from "@/components/dashboard/quick-actions-panel"
import { LiveNotificationsPanel } from "@/components/dashboard/live-notifications-panel"
import { TransactionListTable } from "@/components/dashboard/transaction-list-table"
import { AIDelayPredictionWidget } from "@/components/dashboard/ai-delay-prediction-widget"
import { FileCheck, CheckSquare, AlertCircle, CheckCircle } from "lucide-react"

export default function TCDashboard() {
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

  const transactionsData = [
    {
      id: "TR-7829",
      property: "123 Main St, Austin, TX",
      client: "Robert Johnson",
      agent: "Sarah Johnson",
      status: "at_risk",
      dueDate: "Apr 15, 2025",
      riskLevel: "high",
    },
    {
      id: "TR-6543",
      property: "456 Oak Ave, Dallas, TX",
      client: "Jennifer Williams",
      agent: "John Smith",
      status: "in_progress",
      dueDate: "Apr 22, 2025",
    },
    {
      id: "TR-9021",
      property: "789 Pine Rd, Houston, TX",
      client: "Michael Davis",
      agent: "Michael Brown",
      status: "pending",
      dueDate: "May 3, 2025",
    },
    {
      id: "TR-5432",
      property: "321 Elm St, San Antonio, TX",
      client: "Lisa Martinez",
      agent: "John Smith",
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
      <h1 className="text-3xl font-bold tracking-tight">Transaction Coordinator Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TransactionOverviewCard title="Assigned Transactions" total={18} completed={7} pending={9} atRisk={2} />
        <LiveNotificationsPanel notifications={notificationsData} />
        <QuickActionsPanel actions={quickActionsData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TransactionListTable
            transactions={transactionsData}
            title="Active Transactions"
            description="Transactions currently assigned to you"
            onViewDetails={(id) => console.log(`View details for transaction ${id}`)}
          />
        </div>
        <div className="space-y-6">
          <AIDelayPredictionWidget predictions={delayPredictions} />
          <AIInsightsCard insights={aiInsightsData} />
        </div>
      </div>
    </div>
  )
}

