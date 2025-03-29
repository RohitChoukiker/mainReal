"use client"

import { TransactionOverviewCard } from "@/components/dashboard/transaction-overview-card"
import { AIInsightsCard } from "@/components/dashboard/ai-insights-card"
import { QuickActionsPanel } from "@/components/dashboard/quick-actions-panel"
import { LiveNotificationsPanel } from "@/components/dashboard/live-notifications-panel"
import { TransactionListTable } from "@/components/dashboard/transaction-list-table"
import { AIDelayPredictionWidget } from "@/components/dashboard/ai-delay-prediction-widget"
import { PlusCircle, Upload, CheckSquare, AlertCircle } from "lucide-react"

export default function AgentDashboard() {
  // Sample data for demonstration
  const aiInsightsData = [
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

  const quickActionsData = [
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

  const notificationsData = [
    {
      id: "1",
      title: "Document Rejected",
      message: "The title report for 123 Main St was rejected. Please resubmit with corrections.",
      time: "30 min ago",
      read: false,
      type: "error",
    },
    {
      id: "2",
      title: "New Task Assigned",
      message: "You have been assigned a new task: Schedule home inspection for 456 Oak Ave.",
      time: "2 hours ago",
      read: false,
      type: "info",
    },
    {
      id: "3",
      title: "Transaction Update",
      message: "Transaction #TR-5432 has moved to the closing phase.",
      time: "1 day ago",
      read: true,
      type: "success",
    },
  ]

  const transactionsData = [
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
      <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TransactionOverviewCard title="My Transactions" total={12} completed={5} pending={6} atRisk={1} />
        <LiveNotificationsPanel notifications={notificationsData} />
        <QuickActionsPanel actions={quickActionsData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TransactionListTable
            transactions={transactionsData}
            title="My Active Transactions"
            description="Your current transaction portfolio"
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

